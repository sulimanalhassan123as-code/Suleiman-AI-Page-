// Backend function for Generative AI on Vercel (uses GENERATIVE_MODEL env var)
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    return response.status(500).json({ error: "Server misconfiguration: GEMINI_API_KEY not set." });
  }

  // Set GENERATIVE_MODEL in Vercel to the exact model id returned by listModels (e.g. "models/xyz-001")
  const MODEL_NAME = process.env.GENERATIVE_MODEL;
  if (!MODEL_NAME) {
    console.error("GENERATIVE_MODEL is not set.");
    return response.status(500).json({
      error: "Server misconfiguration: GENERATIVE_MODEL not set. Run list-models.js to find available models and set GENERATIVE_MODEL to an exact model id."
    });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const { question } = request.body;
    if (!question || typeof question !== 'string') {
      return response.status(400).json({ error: 'Invalid question provided.' });
    }

    const prompt = `As a helpful AI assistant, answer the following question. Question: "${question}"`;

    // Use the configured model. If the model name is wrong or unsupported for generateContent,
    // the library will throw an error that we handle below and return a helpful message.
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;

    if (!geminiResponse) {
      throw new Error("The AI did not provide a response.");
    }

    const text = geminiResponse.text();
    response.status(200).json({ answer: text });

  } catch (error) {
    console.error("Error in /api/ask:", error);

    const msg = (error && error.message) ? error.message : String(error);

    // Common case: model not found or model not supporting generateContent
    if (msg.includes("not found") || msg.includes("not supported") || msg.includes("is not found")) {
      return response.status(500).json({
        error: "Model not available or doesn't support generateContent. Run the list-models.js script to get the exact model id and supported methods, then set GENERATIVE_MODEL in Vercel to a supported model id."
      });
    }

    // Generic fallback
    response.status(500).json({ error: "Sorry, I could not process your question at this time." });
  }
};
