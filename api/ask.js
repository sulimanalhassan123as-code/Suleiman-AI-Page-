// Backend function for Generative AI on Vercel using Gemini 2.5 Pro
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (request, response) => {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method Not Allowed" });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    return response.status(500).json({ error: "Server misconfiguration: GEMINI_API_KEY not set." });
  }

  // Default to the model you found: gemini-2.5-pro.
  // You can override by setting GENERATIVE_MODEL in Vercel (recommended).
  const MODEL_NAME = process.env.GENERATIVE_MODEL || "models/gemini-2.5-pro";

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const { question } = request.body;
    if (!question || typeof question !== "string") {
      return response.status(400).json({ error: "Invalid question provided." });
    }

    const prompt = `As a helpful AI assistant, answer the following question. Question: "${question}"`;

    // Create the model instance
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Use the generateContent method (same pattern used earlier)
    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;

    if (!geminiResponse) {
      throw new Error("The AI did not provide a response.");
    }

    const text = geminiResponse.text();
    return response.status(200).json({ answer: text });

  } catch (error) {
    console.error("Error in /api/ask:", error);

    const msg = (error && error.message) ? error.message : String(error);
    if (msg.includes("not found") || msg.includes("not supported") || msg.includes("is not found")) {
      return response.status(500).json({
        error: "Configured model not available or doesn't support generateContent. Set GENERATIVE_MODEL to a supported model id (for example: models/gemini-2.5-pro) after confirming via list-models.js."
      });
    }

    return response.status(500).json({ error: "Sorry, I could not process your question at this time." });
  }
};
