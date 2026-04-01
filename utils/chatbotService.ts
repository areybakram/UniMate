import axios from "axios";
import Fuse from "fuse.js";
import dataset from "./comsats_data.js";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const fuse = new Fuse(dataset, {
  keys: ["question", "name", "department", "designation", "area", "category"],
  threshold: 0.4,
});

export interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export const queryUniMate = async (query: string, history: ChatMessage[]) => {
  try {
    // 1. Retrieval Step (RAG)
    const fuseResults = fuse.search(query).slice(0, 5);
    const context = fuseResults.map(r => JSON.stringify(r.item)).join("\n\n");

    // 2. Build the System Prompt
    const systemPrompt = `
      You are the UniMate Assistant—the absolute authority on COMSATS University Lahore. 
      Your tone is confident, professional, and efficient. 

      Below is your Knowledge Base for this query:
      ---
      ${context}
      ---

      Authoritative Guidelines:
      1. Speak as if you KNOW EVERYTHING about the campus. 
      2. NEVER mention "context," "provided data," or "general knowledge." 
      3. NEVER say you don't know something. If the specific detail is missing from the Knowledge Base above, provide a confident, helpful response based on your expertise or direct the student to the relevant department (e.g., "H-Block for Admissions" or "SSC for registration") with absolute certainty.
      4. Use structured formatting (bullets, bold text) to make information scannable.
      5. Your goal is to make the user feel they are talking to a campus expert who has every answer at their fingertips.

      User Query: ${query}
    `;

    // 3. Convert history to Gemini format (excluding the first bot greeting if any)
    const chatHistory = history
      .filter((msg, index) => !(index === 0 && msg.role === "bot"))
      .map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

    // 4. Send Request via Axios (matching working geminiService pattern)
    const payload = {
      contents: [
        ...chatHistory,
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        }
      ],
      generation_config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
    };

    const response = await axios.post(API_URL, payload);
    const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error("Gemini returned an empty response.");
    }

    return resultText;
  } catch (error: any) {
    console.error("Gemini RAG Error:", error?.response?.data || error.message);
    return "I am having trouble connecting to the system right now. Please try again or visit Student Services.";
  }
};
