import axios from 'axios';
import { Request, Response } from 'express';
import { supabaseAdmin } from '../supabaseAdmin';

export const saveLectureNotes = async (req: Request, res: Response) => {
  try {
    const { userId, courseId, professorName, lectureDate, notesData } = req.body;

    if (!userId || !notesData) {
      return res.status(400).json({ error: "User ID and Notes Data are required." });
    }

    const { data, error } = await supabaseAdmin
      .from('lecture_notes')
      .insert([
        {
          user_id: userId,
          course_id: courseId,
          professor_name: professorName,
          lecture_date: lectureDate || new Date().toISOString(),
          title: notesData.title,
          overview: notesData.overview,
          key_concepts: notesData.key_concepts,
          sections: notesData.sections,
          summary: notesData.summary,
        }
      ])
      .select();

    if (error) throw error;

    res.status(200).json({ message: "Lecture notes saved successfully", data });
  } catch (error: any) {
    console.error("❌ Save Notes Error:", error.message);
    res.status(500).json({ error: "Failed to save lecture notes", details: error.message });
  }
};

export const extractCourses = async (req: Request, res: Response) => {
  try {
    let { base64Image, role } = req.body; // role can be 'student' or 'teacher'
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

    const isTeacher = role === 'teacher';

    const prompt = isTeacher 
      ? `
        Analyze this University Document (Course Offering or Timetable).
        Extract all courses assigned to the instructor. 
        IMPORTANT: If a course is taught to multiple sections (e.g. Section A and Section B of FA24-BSE), you MUST return them as DIFFERENT objects in the array.
        
        For each section-course pair, return:
        - course_code (e.g. CSC262)
        - subject (e.g. Operating Systems)
        - batch (Full string including session, program, and section suffix, e.g. FA24-BSE-A, SP24-BCS-B) 
        - department (e.g. SE, CS, EE)
        - instructor (Name mentioned on card, if any)

        Return ONLY a raw JSON array: [{"course_code": "...", "subject": "...", "batch": "...", "department": "...", "instructor": "..."}]
      `
      : `
        Analyze this University Registration Card image.
        Extract all registered courses. For each, return:
        - course_code (e.g. CSC211)
        - batch_code (e.g. SP24-BCS-A) 
        - subject

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

    // Sanitize batch codes for students or teachers
    const sanitizedData = extractedData.map((course: any) => {
      const batchValue = course.batch_code || course.batch || "";
      const batchMatch = batchValue.match(/(FA|SP)\d{2}-[A-Z0-9]+-[A-Z]/i);
      
      const sanitized = {
        ...course,
        batch_code: batchMatch ? batchMatch[0].toUpperCase() : (batchValue || "").split(' ')[0].trim()
      };

      // Ensure consistent keys for teacher role if needed
      if (isTeacher) {
        sanitized.batch = sanitized.batch_code;
      }
      
      return sanitized;
    });

    res.status(200).json(sanitizedData);
  } catch (error: any) {
    const errorDetails = error?.response?.data || error.message;
    console.error("❌ Gemini Extraction Error Details:", errorDetails);
    
    res.status(500).json({ 
      error: "Failed to extract data from the document.",
      details: typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails)
    });
  }
};

export const transcribeLecture = async (req: Request, res: Response) => {
  try {
    let { audioBase64, mimeType = "audio/mpeg" } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_MODEL = "gemini-2.5-flash"; 
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    if (audioBase64?.includes("base64,")) {
      audioBase64 = audioBase64.split("base64,")[1];
    }

    console.log(`🎙️ Attempting transcription with model: ${GEMINI_MODEL}`);
    console.log(`📏 Audio data length: ${audioBase64?.length} chars`);
    console.log(`📄 Mime Type: ${mimeType}`);

    if (!GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY is missing!");
      return res.status(500).json({ error: "GEMINI_API_KEY is missing." });
    }

    if (!audioBase64) {
      return res.status(400).json({ error: "No audio data provided" });
    }

    // Strip prefix if exists
    if (audioBase64.includes("base64,")) {
      audioBase64 = audioBase64.split("base64,")[1];
    }

    const prompt = `
      You are an expert academic assistant. 
      Analyze the provided audio recording of a university lecture.
      
      Tasks:
      1. Transcribe the lecture accurately.
      2. Convert the transcription into structured, professional lecture notes.
      
      The notes should include:
      - Title: A suitable title for the lecture.
      - Overview: A brief 2-3 sentence summary.
      - Key Concepts: Bullet points of the main ideas discussed.
      - Detailed Notes: Organized sections with subheadings.
      - Summary: A concluding summary of the lecture.

      Return the result as a raw JSON object with the following structure:
      {
        "title": "...",
        "overview": "...",
        "key_concepts": ["...", "..."],
        "sections": [
          { "heading": "...", "content": "..." }
        ],
        "summary": "..."
      }

      Return ONLY the JSON. No markdown formatting.
    `;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: audioBase64,
              },
            },
          ],
        },
      ],
      generation_config: {
        response_mime_type: "application/json",
      },
    };

    console.log("🎙️ Sending audio to Gemini for transcription...");
    const response = await axios.post(API_URL, payload);
    const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error("Gemini returned an empty response.");
    }

    const cleanedText = resultText.replace(/```json|```/g, "").trim();
    const structuredNotes = JSON.parse(cleanedText);

    res.status(200).json(structuredNotes);
  } catch (error: any) {
    const errorData = error?.response?.data;
    console.error("❌ Transcription Error Details:", JSON.stringify(errorData, null, 2) || error.message);
    res.status(500).json({ 
      error: "Failed to transcribe lecture.",
      details: errorData || error.message 
    });
  }
};
