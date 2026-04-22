import apiClient from "./apiClient";

export interface ExtractedCourse {
  course_code: string;
  batch_code: string;
  subject: string;
  batch?: string; // teacher
  department?: string; // teacher
  instructor?: string; // teacher
}

/**
 * Sends a base64 image of a document to the UniMate Backend
 * to extract courses according to the user's role.
 */
export const extractCoursesFromImage = async (
  base64Image: string, 
  role: 'student' | 'teacher' = 'student'
): Promise<ExtractedCourse[]> => {
  try {
    const response = await apiClient.post("/ai/extract-courses", { base64Image, role });
    return response.data;
  } catch (error: any) {
    const errorMsg = error?.response?.data?.error || error.message;
    console.error("Backend Extraction Error:", errorMsg);
    throw new Error(`Failed to extract data: ${errorMsg}`);
  }
};

export interface LectureNotes {
  title: string;
  overview: string;
  key_concepts: string[];
  sections: { heading: string; content: string }[];
  summary: string;
}

/**
 * Sends a base64 audio file to the backend to be transcribed
 * and structured by Gemini.
 */
export const transcribeLecture = async (
  audioBase64: string,
  mimeType: string = "audio/mpeg"
): Promise<LectureNotes> => {
  try {
    const response = await apiClient.post("/ai/transcribe-lecture", { 
      audioBase64, 
      mimeType 
    });
    return response.data;
  } catch (error: any) {
    const errorMsg = error?.response?.data?.error || error.message;
    console.error("Transcription Error:", errorMsg);
    throw new Error(`Failed to transcribe lecture: ${errorMsg}`);
  }
};
/**
 * Saves lecture notes to the backend database.
 */
export const saveLectureNotes = async (payload: {
  userId: string;
  courseId: string;
  professorName: string;
  lectureDate: string;
  notesData: LectureNotes;
}) => {
  try {
    const response = await apiClient.post("/ai/save-lecture-notes", payload);
    return response.data;
  } catch (error: any) {
    const errorMsg = error?.response?.data?.error || error.message;
    console.error("Save Notes Error:", errorMsg);
    throw new Error(`Failed to save notes: ${errorMsg}`);
  }
};
