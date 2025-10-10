// This is the backend function for Generative AI on Vercel
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    return response.status(500).json({ error: "Server misconfiguration: GEMINI_API_KEY not set." });
  }

  // Allow configuring the model via environment variable so you can change without code edits.
  // After running list-models.js, set GENERATIVE_MODEL to the exact model id/name you want.
  const MODEL_NAME = process.env.GENERATIVE_MODEL || "models/chat-bison-001";

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const { question } = request.body;

    if (!question || typeof question !== 'string') {
      return response.status(400).json({ error: 'Invalid question provided.' });
    }

    const prompt = `As a helpful AI assistant, answer the following question. Question: "${question}"`;

    // Attempt to get and use the configured model
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Note: the library method you used previously was generateContent(prompt).
    // If your chosen model supports a different method, you'll see an error — use list-models to confirm.
    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;

    if (!geminiResponse) {
      throw new Error("The AI did not provide a response.");
    }

    const text = geminiResponse.text();
    response.status(200).json({ answer: text });

  } catch (error) {
    console.error("Error in /api/ask:", error);

    // If it's a model-not-found / unsupported-method error, guide the user
    const msg = (error && error.message) ? error.message : String(error);
    if (msg.includes("not found") || msg.includes("is not found") || msg.includes("not supported")) {
      return response.status(500).json({
        error: "Model not available or model doesn't support generateContent. Run the provided list-models.js to see valid models and set GENERATIVE_MODEL to a supported model name."
      });
    }

    response.status(500).json({ error: "Sorry, I could not process your question at this time." });
  }
};
