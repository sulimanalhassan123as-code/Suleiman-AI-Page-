// === VIEW SWITCHING ===
const aiView = document.getElementById("ai-view");
const storyView = document.getElementById("story-view");
const showStoryBtn = document.getElementById("show-story-btn");
const showAiBtn = document.getElementById("show-ai-btn");

showStoryBtn.addEventListener("click", () => {
  aiView.classList.remove("active-view");
  storyView.classList.add("active-view");
});

showAiBtn.addEventListener("click", () => {
  storyView.classList.remove("active-view");
  aiView.classList.add("active-view");
});

// === AI CHAT LOGIC (OFFLINE FRIENDLY) ===
const aiForm = document.getElementById("ai-form");
const aiQuestionInput = document.getElementById("ai-question-input");
const chatContainer = document.getElementById("chat-container");

aiForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const question = aiQuestionInput.value.trim();
  if (!question) return;

  addBubble(question, "user-bubble");
  aiQuestionInput.value = "";

  const thinking = addBubble("💭 AI is thinking...", "ai-bubble");

  try {
    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fake AI reply (offline)
    const replies = [
      "🤖 I'm your AI assistant — ready to help!",
      "✨ Everything is working perfectly offline!",
      "🌙 Ask me anything — I’m always listening.",
      "🧠 Your system looks smooth and fast, great job!",
    ];
    const fakeAnswer = replies[Math.floor(Math.random() * replies.length)];

    updateBubble(thinking, fakeAnswer);
  } catch (error) {
    console.error(error);
    updateBubble(thinking, "⚠️ Something went wrong. Please refresh and try again.");
  }
});

// === CHAT FUNCTIONS ===
function addBubble(text, className) {
  const bubble = document.createElement("div");
  bubble.classList.add("chat-bubble", className);
  bubble.innerHTML = text;
  chatContainer.appendChild(bubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Fade-in animation
  bubble.style.opacity = 0;
  bubble.style.transform = "translateY(20px)";
  setTimeout(() => {
    bubble.style.transition = "all 0.4s ease";
    bubble.style.opacity = 1;
    bubble.style.transform = "translateY(0)";
  }, 10);

  return bubble;
}

function updateBubble(bubble, newText) {
  let formattedText = (newText || "")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
  bubble.innerHTML = formattedText;
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// === GLOBAL ANIMATION: SOFT ENTRANCE ===
window.addEventListener("load", () => {
  document.body.style.opacity = 0;
  document.body.style.transition = "opacity 1s ease";
  setTimeout(() => (document.body.style.opacity = 1), 200);
});