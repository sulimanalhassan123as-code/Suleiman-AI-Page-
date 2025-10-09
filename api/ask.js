// This is the final, correct backend function for Gemini AI on Vercel
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (request, response) => {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // Make sure you add your GEMINI_API_KEY to your Vercel Environment Variables
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    const { question } = request.body;
    
    if (!question || typeof question !== 'string') {
      return response.status(400).json({ error: 'Invalid question provided.' });
    }

    const prompt = `As a helpful AI assistant, answer the following question. Question: "${question}"`;
    
    // Using the stable and reliable model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const geminiResponse = await result.response;
        
    if (!geminiResponse) {
      throw new Error("The AI did not provide a response.");
    }
    
    const text = geminiResponse.text();
    response.status(200).json({ answer: text });

  } catch (error) {
    console.error("Error in /api/ask:", error);
    response.status(500).json({ error: "Sorry, I could not process your question at this time." });
