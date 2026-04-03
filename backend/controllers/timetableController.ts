import { Request, Response } from 'express';
import { parseSchedule } from '../services/timetableService';

const ALLOWED_MAX_TIME = "8:30"; // university cutoff

function timeToMinutes(t: string) {
  if (!t || typeof t !== "string") return NaN;
  const parts = t.trim().split(":");
  return Number(parts[0]) * 60 + Number(parts[1]);
}

export const getAvailableBatches = (req: Request, res: Response) => {
  try {
    const { results } = parseSchedule();
    const uniqueBatches = Array.from(new Set(results.map(item => item.batch_code))).sort();
    res.status(200).json(uniqueBatches);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch batches." });
  }
};

export const getFullSchedule = (req: Request, res: Response) => {
  try {
    const schedule = parseSchedule();
    res.status(200).json(schedule);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to parse timetable." });
  }
};

export const getBatchTimetable = (req: Request, res: Response) => {
  try {
    const { batchCode } = req.params;
    const { results } = parseSchedule();
    
    // Filter by batch code (flexible match)
    const filtered = results.filter(item => 
      item.title.toUpperCase().includes(batchCode.trim().toUpperCase()) ||
      item.batch_code.toUpperCase().includes(batchCode.trim().toUpperCase())
    );
    
    res.status(200).json(filtered);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to filter timetable." });
  }
};

export const getFreeSlots = (req: Request, res: Response) => {
  try {
    const { results, timeBlocks, dayOrder } = parseSchedule();
    const allowedMaxMin = timeToMinutes(ALLOWED_MAX_TIME);
    const newSections: any[] = [];

    const entriesByTableDay: Record<string, any[]> = {};
    for (const e of results) {
      const tb = timeBlocks[e.table];
      if (!tb) continue;
      const startIdx = tb.startTimes.indexOf(e.start);
      const endIdx = tb.endTimes.indexOf(e.end);
      const key = `${e.table}||${e.day}`;
      if (!entriesByTableDay[key]) entriesByTableDay[key] = [];
      entriesByTableDay[key].push({ startIdx, endIdx, entry: e });
    }

    const tableIndices = Object.keys(timeBlocks).map(Number).sort((a, b) => a - b);
    for (const tableIndex of tableIndices) {
      const tb = timeBlocks[tableIndex];
      const { startTimes, endTimes } = tb;
      const lastIndex = Math.min(startTimes.length, endTimes.length) - 1;
      const days = dayOrder[tableIndex] || [];

      for (const day of days) {
        const key = `${tableIndex}||${day}`;
        const classList = entriesByTableDay[key] || [];
        const startMap: Record<number, any> = {};
        for (const c of classList) {
          if (c.startIdx >= 0) startMap[c.startIdx] = c;
        }

        const slots: any[] = [];
        let i = 0;
        while (i <= lastIndex) {
          if (startMap[i]) {
            const { startIdx, endIdx, entry } = startMap[i];
            slots.push({ type: "class", title: entry.title, start: entry.start, end: entry.end });
            i = endIdx + 1;
          } else {
            let k = i;
            while (k <= lastIndex && !startMap[k]) k++;
            const freeStart = startTimes[i];
            const freeEnd = endTimes[k - 1];
            const freeStartMin = timeToMinutes(freeStart);
            const freeEndMin = timeToMinutes(freeEnd);

            if (Number.isFinite(freeStartMin) && Number.isFinite(freeEndMin)) {
              if (freeStartMin < allowedMaxMin) {
                const clippedEndMin = Math.min(freeEndMin, allowedMaxMin);
                if (clippedEndMin > freeStartMin) {
                  slots.push({
                    type: "free",
                    title: `Free Slot (${i + 1}..${k})`,
                    start: freeStart,
                    end: clippedEndMin === freeEndMin ? freeEnd : ALLOWED_MAX_TIME
                  });
                }
              }
            }
            i = k;
          }
        }
        if (slots.length > 0) {
          newSections.push({ key: `${day}-table-${tableIndex}-${newSections.length}`, day, table: tableIndex, slots });
        }
      }
    }
    res.status(200).json(newSections);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to calculate free slots." });
  }
};

export const getTeacherSchedule = (req: Request, res: Response) => {
  try {
    const { courses, teacherName } = req.body; 
    // courses: Array of { course_code, batch, department, subject }
    // teacherName: string from current user's profile
    
    if (!courses || !Array.isArray(courses)) {
      return res.status(400).json({ error: "Invalid courses data" });
    }

    if (!teacherName) {
      return res.status(400).json({ error: "Teacher name is required for matching" });
    }

    const { results } = parseSchedule();
    const normalizedTeacherName = teacherName.trim().toUpperCase();

    const filtered = results.filter(item => {
      const itemTitle = item.title.toUpperCase();
      
      return courses.some(c => {
        const itemBatchCode = item.batch_code.trim().toUpperCase();
        const extractedBatchCode = (c.batch || "").trim().toUpperCase();
        
        // Precise Batch & Section Match
        const batchMatch = itemBatchCode === extractedBatchCode || itemBatchCode.includes(extractedBatchCode) || extractedBatchCode.includes(itemBatchCode);
        
        const courseCodeMatch = item.title.toUpperCase().includes(c.course_code.trim().toUpperCase());
        const teacherMatch = itemTitle.includes(normalizedTeacherName);
        
        let deptMatch = true;
        if (c.department) {
          deptMatch = itemTitle.includes(c.department.trim().toUpperCase());
        }

        return courseCodeMatch && teacherMatch && batchMatch && deptMatch;
      });
    });
    
    res.status(200).json(filtered);
  } catch (error: any) {
    console.error("❌ Teacher Timetable Filter Error:", error);
    res.status(500).json({ error: "Failed to filter teacher timetable." });
  }
};

export const getPersonalizedTimetable = (req: Request, res: Response) => {
  try {
    const { courses } = req.body; // Array of { course_code, batch_code }
    if (!courses || !Array.isArray(courses)) {
      return res.status(400).json({ error: "Invalid courses data" });
    }

    const { results } = parseSchedule();
    
    const filtered = results.filter(item => 
      courses.some(c => 
        item.title.toUpperCase().includes(c.course_code.trim().toUpperCase()) &&
        (item.batch_code.trim().toUpperCase() === c.batch_code.trim().toUpperCase() ||
         item.batch_code.trim().toUpperCase().includes(c.batch_code.trim().toUpperCase()) ||
         c.batch_code.trim().toUpperCase().includes(item.batch_code.trim().toUpperCase()))
      )
    );
    
    res.status(200).json(filtered);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to filter personalized timetable." });
  }
};
