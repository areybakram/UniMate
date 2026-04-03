import apiClient from "./apiClient";

export interface ExtractedCourse {
  course_code: string;
  batch_code: string;
  subject: string;
}

/**
 * Sends a base64 image of a registration card to the UniMate Backend
 * to extract course codes and their respective batches.
 */
export const extractCoursesFromImage = async (base64Image: string): Promise<ExtractedCourse[]> => {
  try {
    const response = await apiClient.post("/ai/extract-courses", { base64Image });
    return response.data;
  } catch (error: any) {
    console.error("Backend Extraction Error:", error?.response?.data || error.message);
    throw new Error("Failed to extract data from the registration card via server.");
  }
};
