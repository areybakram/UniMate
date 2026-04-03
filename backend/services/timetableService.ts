import * as XLSX from "xlsx";
import path from "path";

const EXCEL_PATH = path.join(__dirname, "../data/final_timetable_with_lab_codes.xlsx");
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function normalizeTitle(s: string) {
  return String(s).replace(/\s+/g, " ").trim();
}

function isTime(v: any) {
  return typeof v === "string" && /^\d{1,2}:\d{2}$/.test(String(v).trim());
}

function isTimeRow(row: any[]) {
  return Array.isArray(row) && row.reduce((c, v) => c + (isTime(v) ? 1 : 0), 0) >= 6;
}

export function parseSchedule() {
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const matrix: any[] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    blankrows: false,
    defval: "",
  });

  const merges: any[] = (worksheet as any)["!merges"] || [];
  const mergeEndCol = new Map<string, number>();
  for (const m of merges) {
    const key = `${m.s.r},${m.s.c}`;
    mergeEndCol.set(key, m.e.c);
  }

  const results: any[] = [];
  const timeBlocks: Record<number, { startTimes: string[]; endTimes: string[]; timeStartCol: number }> = {};
  const dayOrder: Record<number, string[]> = {};

  let startTimes: string[] | null = null;
  let endTimes: string[] | null = null;
  let timeStartCol = 0;
  let tableIndex = -1;

  for (let r = 0; r < matrix.length; r++) {
    const row: any[] = matrix[r] || [];

    if (isTimeRow(row)) {
      const firstCol = row.findIndex(isTime);
      const times = row.filter(isTime);
      if (startTimes && endTimes) {
        startTimes = times;
        endTimes = null;
        timeStartCol = firstCol;
        tableIndex += 1;
      } else if (!startTimes) {
        startTimes = times;
        timeStartCol = firstCol;
      } else if (!endTimes) {
        endTimes = times;
        timeStartCol = Math.min(timeStartCol, firstCol);
        tableIndex = tableIndex < 0 ? 0 : tableIndex;

        timeBlocks[tableIndex] = {
          startTimes: startTimes.slice(),
          endTimes: endTimes.slice(),
          timeStartCol,
        };
        if (!dayOrder[tableIndex]) dayOrder[tableIndex] = [];
      }
      continue;
    }

    const dayCell = row[0];
    const day = typeof dayCell === "string" ? dayCell.trim() : "";
    if (!DAYS.includes(day)) continue;
    if (!startTimes || !endTimes) continue;

    if (!dayOrder[tableIndex]) dayOrder[tableIndex] = [];
    if (!dayOrder[tableIndex].includes(day)) {
      dayOrder[tableIndex].push(day);
    }

    let col = timeStartCol;
    const lastCol = timeStartCol + Math.min(startTimes.length, endTimes.length) - 1;
    while (col <= lastCol) {
      const cellRaw = row[col];
      const cell = cellRaw != null ? String(cellRaw).trim() : "";
      if (cell.length > 0) {
        const key = `${r},${col}`;
        let endCol = mergeEndCol.has(key) ? (mergeEndCol.get(key) as number) : col;
        while (!mergeEndCol.has(key) && endCol + 1 <= lastCol) {
          const nextCell = row[endCol + 1];
          if (nextCell == null || String(nextCell).trim() === "") {
            endCol += 1;
          } else {
            break;
          }
        }
        const startIdx = col - timeStartCol;
        const endIdx = endCol - timeStartCol;
        results.push({
          table: tableIndex,
          day,
          title: normalizeTitle(cell),
          start: startTimes[startIdx],
          end: endTimes[endIdx],
        });
        col = endCol + 1;
      } else {
        col += 1;
      }
    }
  }

  return { results, timeBlocks, dayOrder };
}
