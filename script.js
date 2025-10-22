// script.js - Optimized for speed and smooth animation

document.addEventListener("DOMContentLoaded", () => {
  const aiView = document.getElementById("ai-view");
  const storyView = document.getElementById("story-view");
  const showStoryBtn = document.getElementById("show-story-btn");
  const showAiBtn = document.getElementById("show-ai-btn");
  const aiForm = document.getElementById("ai-form");
  const aiQuestionInput = document.getElementById("ai-question-input");
  const chatContainer = document.getElementById("chat-container");

  // --- Smooth View Switching ---
  const switchView = (viewToShow) => {
    aiView.classList.remove("active-view");
    storyView.classList.remove("active-view");
    viewToShow.classList.add("active-view");
  };

  showStoryBtn.addEventListener("click", () => switchView(storyView));
  showAiBtn.addEventListener("click", () => switchView(aiView));

  // --- AI CHAT ---
  aiForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const question = aiQuestionInput.value.trim();
    if (!question) return;

    addBubble(question, "user-bubble");
    aiQuestionInput.value = "";

    const thinking = addBubble("AI is thinking...", "ai-bubble");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) throw new Error("Network error");
      const data = await res.json();

      updateBubble(thinking, data.answer);
    } catch (err) {
      console.error(err);
      updateBubble(thinking, "Sorry, I encountered an error. Please try again.");
    }
  });

  // --- CHAT HELPERS ---
  function addBubble(text, className) {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble", className);
    bubble.innerHTML = text;
    chatContainer.appendChild(bubble);
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
    return bubble;
  }

  function updateBubble(bubble, newText) {
    const formatted = (newText || "")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
    bubble.innerHTML = formatted;
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
  }
});