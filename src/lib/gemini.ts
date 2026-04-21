import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getJobMatchAdvice(userSkills: string[], jobDescription: string, jobTitle: string) {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      You are an expert career consultant in Dubai.
      Compare the following job seeker skills with the job description.
      
      Job Title: ${jobTitle}
      Job Description: ${jobDescription}
      Candidate Skills: ${userSkills.join(', ')}

      Provide a JSON response with:
      1. matchPercentage (0-100)
      2. advice (A brief helpful tip on why they are a good fit or what they lack)
      3. dubaiContext (A tip specific to the Dubai job market for this role)
    `;

    const response = await genAI.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini error:", error);
    return { matchPercentage: 0, advice: "Unable to calculate match at this time.", dubaiContext: "" };
  }
}
