const { GoogleGenerativeAI } = require("@google/generative-ai");

(async () => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Set GEMINI_API_KEY in your environment before running this script.");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const models = await genAI.listModels();
    console.log(JSON.stringify(models, null, 2));
  } catch (err) {
    console.error("Failed to list models:", err);
    process.exit(1);
  }
})();
