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
