import axios from 'axios';
import { Request, Response } from 'express';

export const extractCourses = async (req: Request, res: Response) => {
  try {
    let { base64Image } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_MODEL = "gemini-2.5-flash";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    if (!GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY is missing from environment variables.");
      return res.status(500).json({ error: "Server configuration error: API key missing." });
    }

    if (!base64Image) {
      return res.status(400).json({ error: "No image data provided" });
    }

    // Strip prefix if exists (Gemini expects pure base64)
    if (base64Image.includes("base64,")) {
      base64Image = base64Image.split("base64,")[1];
    }

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
    let resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      console.error("❌ Gemini Error: Empty response body", response.data);
      throw new Error("Gemini returned an empty response.");
    }

    // Strip markdown formatting (```json ... ```) if exists
    const cleanedText = resultText.replace(/```json|```/g, "").trim();
    const extractedData = JSON.parse(cleanedText);

    // Sanitize batch codes
    const sanitizedData = extractedData.map((course: any) => {
      const batchMatch = course.batch_code?.match(/(FA|SP)\d{2}-[A-Z0-9]+-[A-Z]/i);
      return {
        ...course,
        batch_code: batchMatch ? batchMatch[0].toUpperCase() : (course.batch_code || "").split(' ')[0].trim()
      };
    });

    res.status(200).json(sanitizedData);
  } catch (error: any) {
    const errorDetails = error?.response?.data || error.message;
    console.error("❌ Gemini Extraction Error Details:", errorDetails);
    
    res.status(500).json({ 
      error: "Failed to extract data from the registration card.",
      details: typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails)
    });
  }
};
