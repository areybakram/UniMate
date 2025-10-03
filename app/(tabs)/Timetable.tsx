//this is simple reading of excel file and showing data in json format

// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, StyleSheet } from "react-native";
// import * as FileSystem from "expo-file-system/legacy"; // ✅ use legacy API
// import { Asset } from "expo-asset";
// import * as XLSX from "xlsx";

// const Timetable = () => {
//   const [data, setData] = useState<any[]>([]);
//   console.log(data);

//   useEffect(() => {
//     const loadExcel = async () => {
//       try {

//         const asset = Asset.fromModule(require("../../assets/sample.xlsx"));
//         await asset.downloadAsync();

//         const fileUri = FileSystem.documentDirectory + "sample.xlsx";
//         await FileSystem.copyAsync({
//           from: asset.localUri!,
//           to: fileUri,
//         });

//         const b64 = await FileSystem.readAsStringAsync(fileUri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });

//         const wb = XLSX.read(b64, { type: "base64" });
//         const wsName = wb.SheetNames[0]; // first sheet
//         const ws = wb.Sheets[wsName];

//         const jsonData: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
//         setData(jsonData);
//       } catch (err) {
//         console.error("Error loading Excel:", err);
//       }
//     };

//     loadExcel();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Excel Data:</Text>
//       <FlatList
//         data={data}
//         keyExtractor={(_, i) => i.toString()}
//         renderItem={({ item }) => (
//           <Text style={styles.row}>{JSON.stringify(item)}</Text>
//         )}
//       />
//     </View>
//   );
// };

// export default Timetable;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
//   row: { fontSize: 14, marginVertical: 4 },
// });

// ----------------------------------------------------------------------------





// this is structured timetable view without time and free slots

// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, StyleSheet } from "react-native";
// import * as FileSystem from "expo-file-system/legacy"; // ✅ legacy API
// import { Asset } from "expo-asset";
// import * as XLSX from "xlsx";

// const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

// // ✅ Function to parse Excel JSON into structured timetable
// const parseTimetable = (rawData: any[]) => {
//   let structured: any[] = [];

//   rawData.forEach((row) => {
//     const day = row[0]; // first column contains "Mo", "Tu", etc.

//     if (DAYS.includes(day)) {
//       const periods: any[] = [];

//       row.slice(1).forEach((cell: any, index: number) => {
//         if (!cell) {
//           periods.push({
//             period: index + 1,
//             free: true,
//           });
//         } else {
//           const [instructor, course, batch] = cell.split("\n");
//           periods.push({
//             period: index + 1,
//             free: false,
//             instructor: instructor?.trim(),
//             course: course?.trim(),
//             batch: batch?.trim(),
//           });
//         }
//       });

//       structured.push({ day, periods });
//     }
//   });

//   return structured;
// };

// const Timetable = () => {
//   const [timetable, setTimetable] = useState<any[]>([]);

//   useEffect(() => {
//     const loadExcel = async () => {
//       try {
//         const asset = Asset.fromModule(require("../../assets/sample.xlsx"));
//         await asset.downloadAsync();

//         const fileUri = FileSystem.documentDirectory + "sample.xlsx";
//         await FileSystem.copyAsync({
//           from: asset.localUri!,
//           to: fileUri,
//         });

//         const b64 = await FileSystem.readAsStringAsync(fileUri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });

//         const wb = XLSX.read(b64, { type: "base64" });
//         const wsName = wb.SheetNames[0];
//         const ws = wb.Sheets[wsName];

//         const jsonData: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

//         // ✅ Parse into structured timetable
//         const structured = parseTimetable(jsonData);
//         setTimetable(structured);
//       } catch (err) {
//         console.error("Error loading Excel:", err);
//       }
//     };

//     loadExcel();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Weekly Timetable</Text>
//       <FlatList
//         data={timetable}
//         keyExtractor={(item) => item.day}
//         renderItem={({ item }) => (
//           <View style={styles.dayBlock}>
//             <Text style={styles.dayTitle}>{item.day}</Text>
//             {item.periods.map((p: any, i: number) =>
//               p.free ? (
//                 <Text key={i} style={styles.free}>
//                   Period {p.period}: Free
//                 </Text>
//               ) : (
//                 <View key={i} style={styles.classBlock}>
//                   <Text style={styles.course}>{p.course}</Text>
//                   <Text style={styles.instructor}>{p.instructor}</Text>
//                   <Text style={styles.batch}>{p.batch}</Text>
//                 </View>
//               )
//             )}
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// export default Timetable;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
//   dayBlock: { marginBottom: 20 },
//   dayTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#2a4d69" },
//   classBlock: { backgroundColor: "#eaf2f8", padding: 8, marginVertical: 4, borderRadius: 6 },
//   course: { fontSize: 16, fontWeight: "600", color: "#1a5276" },
//   instructor: { fontSize: 14, color: "#117a65" },
//   batch: { fontSize: 13, color: "#616a6b" },
//   free: { fontSize: 14, color: "#999", fontStyle: "italic", marginVertical: 2 },
// });





// ----------------------------





//areebi code with time 


// import { Asset } from "expo-asset";
// import * as FileSystem from "expo-file-system/legacy"; // ✅ legacy API
// import { useEffect, useState } from "react";
// import { FlatList, StyleSheet, Text, View } from "react-native";
// import * as XLSX from "xlsx";

// // ✅ Normalizer (from your file)
// function normalizeTitle(s: string) {
//   return String(s).replace(/\s+/g, " ").trim();
// }

// const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

// // ✅ Merge-aware parser that matches index.js logic
// function parseScheduleFromWorksheet(ws: XLSX.WorkSheet) {
//   const matrix: any[] = XLSX.utils.sheet_to_json(ws, {
//     header: 1,
//     blankrows: false,
//     defval: "",
//   });

//   const merges: any[] = (ws as any)["!merges"] || [];
//   const mergeEndCol = new Map<string, number>();
//   for (const m of merges) {
//     const key = `${m.s.r},${m.s.c}`;
//     mergeEndCol.set(key, m.e.c);
//   }

//   const results: any[] = [];
//   let startTimes: string[] | null = null;
//   let endTimes: string[] | null = null;
//   let timeStartCol = 0;
//   let tableIndex = -1;

//   const isTime = (v: any) =>
//     typeof v === "string" && /^\d{1,2}:\d{2}$/.test(String(v).trim());
//   const isTimeRow = (row: any[]) =>
//     Array.isArray(row) && row.reduce((c, v) => c + (isTime(v) ? 1 : 0), 0) >= 6;

//   for (let r = 0; r < matrix.length; r++) {
//     const row: any[] = matrix[r] || [];
//     if (isTimeRow(row)) {
//       const firstCol = row.findIndex(isTime);
//       const times = row.filter(isTime);
//       if (startTimes && endTimes) {
//         startTimes = times;
//         endTimes = null;
//         timeStartCol = firstCol;
//         tableIndex += 1;
//       } else if (!startTimes) {
//         startTimes = times;
//         timeStartCol = firstCol;
//       } else if (!endTimes) {
//         endTimes = times;
//         timeStartCol = Math.min(timeStartCol, firstCol);
//         tableIndex = tableIndex < 0 ? 0 : tableIndex;
//       }
//       continue;
//     }

//     const dayCell = row[0];
//     const day = typeof dayCell === "string" ? dayCell.trim() : "";
//     if (!DAYS.includes(day)) continue;
//     if (!startTimes || !endTimes) continue;

//     let col = timeStartCol;
//     const lastCol =
//       timeStartCol + Math.min(startTimes.length, endTimes.length) - 1;
//     while (col <= lastCol) {
//       const cellRaw = row[col];
//       const cell = cellRaw != null ? String(cellRaw).trim() : "";
//       if (cell.length > 0) {
//         const key = `${r},${col}`;
//         let endCol = mergeEndCol.has(key)
//           ? (mergeEndCol.get(key) as number)
//           : col;
//         // fallback: extend over empties if no merge
//         while (!mergeEndCol.has(key) && endCol + 1 <= lastCol) {
//           const nextCell = row[endCol + 1];
//           if (nextCell == null || String(nextCell).trim() === "") {
//             endCol += 1;
//           } else {
//             break;
//           }
//         }
//         const startIdx = col - timeStartCol;
//         const endIdx = endCol - timeStartCol;
//         results.push({
//           table: tableIndex,
//           day,
//           title: normalizeTitle(cell),
//           start: startTimes[startIdx],
//           end: endTimes[endIdx],
//         });
//         col = endCol + 1;
//       } else {
//         col += 1;
//       }
//     }
//   }
//   return results;
// }

// const Timetable = () => {
//   const [entries, setEntries] = useState<any[]>([]);

//   useEffect(() => {
//     const loadExcel = async () => {
//       try {
//         const asset = Asset.fromModule(require("../../assets/sample.xlsx"));
//         await asset.downloadAsync();

//         const fileUri = FileSystem.documentDirectory + "sample.xlsx";
//         await FileSystem.copyAsync({
//           from: asset.localUri!,
//           to: fileUri,
//         });

//         const b64 = await FileSystem.readAsStringAsync(fileUri, {
//           encoding: FileSystem.EncodingType.Base64,
//         });

//         const wb = XLSX.read(b64, { type: "base64" });
//         const wsName = wb.SheetNames[0];
//         const ws = wb.Sheets[wsName];
//         // ✅ Use merge-aware parser aligned with index.js
//         const parsed = parseScheduleFromWorksheet(ws);
//         setEntries(parsed);
//       } catch (err) {
//         console.error("Error loading Excel:", err);
//       }
//     };

//     loadExcel();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Weekly Timetable</Text>
//       <FlatList
//         data={entries}
//         keyExtractor={(_, idx) => String(idx)}
//         renderItem={({ item }) => (
//           <View style={styles.entry}>
//             <Text style={styles.day}>
//               {item.day} ({item.start} - {item.end})
//             </Text>
//             <Text style={styles.course}>{item.title}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// export default Timetable;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
//   entry: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderColor: "#ddd",
//   },
//   day: { fontSize: 16, fontWeight: "600", color: "#2a4d69" },
//   course: { fontSize: 14, color: "#333" },
// });


// ----------------------------------

// final version




import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy"; // ✅ legacy API
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as XLSX from "xlsx";

/**
 * parseScheduleFromWorksheet:
 * - Merge-aware parsing
 */
function normalizeTitle(s: string) {
  return String(s).replace(/\s+/g, " ").trim();
}

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function parseScheduleFromWorksheet(ws: XLSX.WorkSheet) {
  const matrix: any[] = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    blankrows: false,
    defval: "",
  });

  const merges: any[] = (ws as any)["!merges"] || [];
  const mergeEndCol = new Map<string, number>();
  for (const m of merges) {
    const key = `${m.s.r},${m.s.c}`;
    mergeEndCol.set(key, m.e.c);
  }

  const results: any[] = [];
  const timeBlocks: Record<
    number,
    { startTimes: string[]; endTimes: string[]; timeStartCol: number }
  > = {};
  const dayOrder: Record<number, string[]> = {};

  let startTimes: string[] | null = null;
  let endTimes: string[] | null = null;
  let timeStartCol = 0;
  let tableIndex = -1;

  const isTime = (v: any) =>
    typeof v === "string" && /^\d{1,2}:\d{2}$/.test(String(v).trim());
  const isTimeRow = (row: any[]) =>
    Array.isArray(row) && row.reduce((c, v) => c + (isTime(v) ? 1 : 0), 0) >= 6;

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
    const lastCol =
      timeStartCol + Math.min(startTimes.length, endTimes.length) - 1;
    while (col <= lastCol) {
      const cellRaw = row[col];
      const cell = cellRaw != null ? String(cellRaw).trim() : "";
      if (cell.length > 0) {
        const key = `${r},${col}`;
        let endCol = mergeEndCol.has(key)
          ? (mergeEndCol.get(key) as number)
          : col;
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

/* -------------------------
   UI / Component
   ------------------------- */

const ALLOWED_MAX_TIME = "8:30"; // university cutoff

function timeToMinutes(t: string) {
  if (!t || typeof t !== "string") return NaN;
  const parts = t.trim().split(":");
  const h = Number(parts[0]);
  const m = Number(parts[1]);
  return h * 60 + m;
}

const Timetable = () => {
  const [sections, setSections] = useState<
    { key: string; day: string; table: number; slots: any[] }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExcel = async () => {
      try {
        const asset = Asset.fromModule(require("../../assets/sample.xlsx"));
        await asset.downloadAsync();

        const fileUri = FileSystem.documentDirectory + "sample.xlsx";
        await FileSystem.copyAsync({
          from: asset.localUri!,
          to: fileUri,
        });

        const b64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const wb = XLSX.read(b64, { type: "base64" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];

        const parsed = parseScheduleFromWorksheet(ws);
        const entries = parsed.results;
        const timeBlocks = parsed.timeBlocks;
        const dayOrder = parsed.dayOrder;

        const entriesByTableDay: Record<
          string,
          { startIdx: number; endIdx: number; entry: any }[]
        > = {};

        for (const e of entries) {
          const t = e.table;
          const tb = timeBlocks[t];
          if (!tb) continue;
          const startIdx = tb.startTimes.indexOf(e.start);
          const endIdx = tb.endTimes.indexOf(e.end);
          const key = `${t}||${e.day}`;
          if (!entriesByTableDay[key]) entriesByTableDay[key] = [];
          entriesByTableDay[key].push({ startIdx, endIdx, entry: e });
        }

        const allowedMaxMin = timeToMinutes(ALLOWED_MAX_TIME);
        const newSections: {
          key: string;
          day: string;
          table: number;
          slots: any[];
        }[] = [];

        const tableIndices = Object.keys(timeBlocks)
          .map((k) => Number(k))
          .sort((a, b) => a - b);

        for (const tableIndex of tableIndices) {
          const tb = timeBlocks[tableIndex];
          if (!tb) continue;
          const { startTimes, endTimes } = tb;
          const lastIndex = Math.min(startTimes.length, endTimes.length) - 1;

          const daysForThisTable = dayOrder[tableIndex] || [];

          for (const day of daysForThisTable) {
            const key = `${tableIndex}||${day}`;
            const classList = entriesByTableDay[key] || [];
            const startMap: Record<number, { startIdx: number; endIdx: number; entry: any }> =
              {};
            for (const c of classList) {
              if (typeof c.startIdx === "number" && c.startIdx >= 0) {
                startMap[c.startIdx] = c;
              }
            }

            const slots: any[] = [];
            let i = 0;
            while (i <= lastIndex) {
              if (startMap[i]) {
                const { startIdx, endIdx, entry } = startMap[i];
                slots.push({
                  type: "class",
                  title: entry.title,
                  start: startTimes[startIdx],
                  end: endTimes[endIdx],
                });
                i = endIdx + 1;
                continue;
              }

              let k = i;
              while (k <= lastIndex && !startMap[k]) {
                k++;
              }
              const freeStart = startTimes[i];
              const freeEnd = endTimes[k - 1];

              const freeStartMin = timeToMinutes(freeStart);
              const freeEndMin = timeToMinutes(freeEnd);

              if (Number.isFinite(freeStartMin) && Number.isFinite(freeEndMin)) {
                if (freeStartMin >= allowedMaxMin) {
                } else {
                  const clippedEndMin = Math.min(freeEndMin, allowedMaxMin);
                  if (clippedEndMin > freeStartMin) {
                    const endStr =
                      clippedEndMin === freeEndMin ? freeEnd : ALLOWED_MAX_TIME;
                    slots.push({
                      type: "free",
                      title: `Free Slot (${i + 1}..${k})`,
                      start: freeStart,
                      end: endStr,
                    });
                  }
                }
              } else {
                slots.push({
                  type: "free",
                  title: `Free Slot (${i + 1}..${k})`,
                  start: freeStart,
                  end: freeEnd,
                });
              }

              i = k;
            }

            if (slots.length > 0) {
              newSections.push({
                key: `${day}-table-${tableIndex}-${newSections.length}`,
                day,
                table: tableIndex,
                slots,
              });
            }
          }
        }

        setSections(newSections);
      } catch (err) {
        console.error("Error loading Excel:", err);
      } finally {
        setLoading(false);
      }
    };

    loadExcel();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0f3550" />
        <Text style={styles.loaderText}>Loading timetable...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Weekly Timetable</Text>

      <FlatList
        data={sections}
        keyExtractor={(s) => s.key}
        renderItem={({ item }) => (
          <View style={styles.dayBlock}>
            <Text style={styles.dayHeader}>
              {item.day} (Set {item.table + 1})
            </Text>

            {item.slots.map((slot: any, idx: number) => (
              <View
                key={idx}
                style={[
                  styles.slotCard,
                  slot.type === "free" ? styles.freeCard : styles.classCard,
                ]}
              >
                <Text style={styles.slotTitle}>
                  {slot.type === "free" ? "🟢 Free Slot" : "📘 " + slot.title}
                </Text>
                <Text style={styles.slotTime}>
                  ⏰ {slot.start} - {slot.end}
                </Text>
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={
          <View style={{ padding: 20 }}>
            <Text style={{ color: "#666" }}>
              No timetable data found (or all free slots were beyond 8:30).
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Timetable;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: "#f8fafb" },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
    color: "#1b3a57",
  },
  dayBlock: {
    marginBottom: 22,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f3550",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#e3e8ee",
    paddingBottom: 6,
  },
  slotCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  classCard: { backgroundColor: "#eef7ff" },
  freeCard: { backgroundColor: "#f0fff4" },
  slotTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#11324d",
  },
  slotTime: { fontSize: 13, color: "#425466" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafb",
  },
  loaderText: { marginTop: 10, fontSize: 16, color: "#0f3550" },
});
