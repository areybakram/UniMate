import axios from "axios";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export interface ExtractedCourse {
  course_code: string;
  batch_code: string;
  subject: string;
}

/**
 * Sends a base64 image of a registration card to Gemini AI
 * to extract course codes and their respective batches.
 */
export const extractCoursesFromImage = async (base64Image: string): Promise<ExtractedCourse[]> => {
  try {
    const prompt = `
      Analyze this University Registration Card image.
      Extract all registered courses. For each, return:
      - Course Code (e.g. CSC211)
      - Batch/Section (e.g. SP24-BCS-A) 
      - Subject Name

      Return ONLY a raw JSON array: [{"course_code": "...", "batch_code": "...", "subject": "..."}]
    `;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
      generation_config: {
        response_mime_type: "application/json",
      },
    };

    const response = await axios.post(API_URL, payload);

    const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("--- RAW GEMINI RESPONSE ---");
    console.log(resultText);

    const extractedData: ExtractedCourse[] = JSON.parse(resultText);
    
    // Sanitize batch codes (e.g., "BCS 8 FA22-BCS-A A" -> "FA22-BCS-A")
    const sanitizedData = extractedData.map(course => {
      // Look for a pattern like FA22-BCS-A or SP24-BSE-B
      const batchMatch = course.batch_code.match(/(FA|SP)\d{2}-[A-Z0-9]+-[A-Z]/i);
      return {
        ...course,
        batch_code: batchMatch ? batchMatch[0].toUpperCase() : course.batch_code.split(' ')[0].trim()
      };
    });

    console.log("--- PARSED & SANITIZED EXTRACTION ---");
    console.dir(sanitizedData, { depth: null });

    return sanitizedData;
  } catch (error: any) {
    console.error("Gemini Extraction Error:", error?.response?.data || error.message);
    throw new Error("Failed to extract data from the registration card.");
  }
};
