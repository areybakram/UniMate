import { AttendanceRecord } from "./attendanceService";
import { Task } from "./taskService";

export interface StorySlide {
  id: string;
  type: "intro" | "productivity" | "savage" | "study_pattern" | "top_subject" | "danger" | "achievement" | "prediction";
  title: string;
  content: string;
  subContent?: string;
  emoji: string;
  gradient: string[];
}

export const generateSemesterStory = (
  userData: { name: string },
  attendanceData: any,
  tasks: Task[],
  usageLogs: any[]
): StorySlide[] => {
  const slides: StorySlide[] = [];

  // 1. Intro Slide
  slides.push({
    id: "intro",
    type: "intro",
    title: `UniMate Wrapped 🎬`,
    content: `Hey ${userData.name},\nYour Semester Story is Ready!`,
    emoji: "🔥",
    gradient: ["#4f46e5", "#7c3aed"],
  });

  // 2. Productivity Story
  const completedTasks = tasks.filter(t => t.status === "done").length;
  let productivityMsg = `You completed ${completedTasks} tasks... not bad 👀`;
  if (completedTasks > 20) productivityMsg = `Task master! ${completedTasks} items crushed! 🔥`;
  if (completedTasks < 5) productivityMsg = `5 tasks completed... living life on the edge? 💀`;

  slides.push({
    id: "productivity",
    type: "productivity",
    title: "Productivity",
    content: productivityMsg,
    emoji: "📈",
    gradient: ["#10b981", "#059669"],
  });

  // 3. Savage Slide (Attendance)
  let totalTaken = 0;
  let totalMissed = 0;
  const subjects: { [key: string]: number } = {};

  Object.values(attendanceData).forEach((dayData: any) => {
    Object.entries(dayData).forEach(([classId, status]) => {
      if (status === "taken") totalTaken++;
      else totalMissed++;
    });
  });

  const attendanceRate = totalTaken + totalMissed > 0 
    ? (totalTaken / (totalTaken + totalMissed)) * 100 
    : 100;

  let savageMsg = `You skipped ${totalMissed} classes... impressive in the wrong way 💀`;
  if (totalMissed === 0) savageMsg = `Wait, you actually attended EVERYTHING? Legend 👑`;
  if (totalMissed > 15) savageMsg = `Attendance: ${attendanceRate.toFixed(1)}%\nYou're basically a guest student now 😭`;

  slides.push({
    id: "savage",
    type: "savage",
    title: "The Bunking Report",
    content: savageMsg,
    emoji: "💀",
    gradient: ["#ef4444", "#dc2626"],
  });

  // 4. Study Pattern (Late Night Logs)
  const lateNightLogs = usageLogs.filter(log => {
    const hour = new Date(log.created_at).getHours();
    return hour >= 0 && hour <= 4;
  }).length;

  let studyPatternMsg = `You open the app mostly in the afternoon. Normal person behavior.`;
  if (lateNightLogs > 5) {
    studyPatternMsg = `You study mostly at 2 AM... are you okay? 🧛`;
  }

  slides.push({
    id: "study_pattern",
    type: "study_pattern",
    title: "Study Habits",
    content: studyPatternMsg,
    emoji: "🧛",
    gradient: ["#1e293b", "#0f172a"],
  });

  // 5. Danger Slide (Missed Deadlines)
  const deadLineMissed = tasks.filter(t => t.status === "todo" && new Date(t.endDate) < new Date()).length;
  if (deadLineMissed > 0) {
    slides.push({
      id: "danger",
      type: "danger",
      title: "Danger Zone",
      content: `${deadLineMissed} deadlines missed... we need to talk 😤`,
      subContent: "Finals are coming. Lock in! 🔒",
      emoji: "😤",
      gradient: ["#f97316", "#ea580c"],
    });
  }

  // 6. Achievement Slide
  slides.push({
    id: "achievement",
    type: "achievement",
    title: "Semester Status",
    content: "You survived (barely) 🎉",
    subContent: "Jan - April semester complete!",
    emoji: "🎉",
    gradient: ["#3b82f6", "#2563eb"],
  });

  // 7. Prediction Slide
  const predictedGPA = Math.min(4.0, 2.5 + (attendanceRate / 100 * 1.5)).toFixed(2);
  slides.push({
    id: "prediction",
    type: "prediction",
    title: "GPA Oracle 🔮",
    content: `Estimated GPA: ${predictedGPA}`,
    subContent: "(if you don't mess up finals)",
    emoji: "🔮",
    gradient: ["#d946ef", "#c026d3"],
  });

  return slides;
};
