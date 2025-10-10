// --- VIEW SWITCHING LOGIC ---
const aiView = document.getElementById('ai-view');
const storyView = document.getElementById('story-view');
const showStoryBtn = document.getElementById('show-story-btn');
const showAiBtn = document.getElementById('show-ai-btn');

showStoryBtn.addEventListener('click', () => {
    aiView.classList.remove('active-view');
    storyView.classList.add('active-view');
});

showAiBtn.addEventListener('click', () => {
    storyView.classList.remove('active-view');
    aiView.classList.add('active-view');
});

// --- GEMINI AI CHAT LOGIC ---
const aiForm = document.getElementById('ai-form');
const aiQuestionInput = document.getElementById('ai-question-input');
const chatContainer = document.getElementById('chat-container');

aiForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const question = aiQuestionInput.value.trim();
    if (!question) return;

    // Add user's question to the chat
    addBubble(question, 'user-bubble');
    aiQuestionInput.value = ''; // Clear the input

    // Show a "thinking" bubble for the AI
    const thinkingBubble = addBubble('AI is thinking...', 'ai-bubble');

    const apiUrl = '/api/ask';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question })
        });
        if (!response.ok) { throw new Error('Network response was not ok'); }
        
        const data = await response.json();

        // Update the "thinking" bubble with the real answer
        updateBubble(thinkingBubble, data.answer);

    } catch (error) {
        console.error("Error with AI function:", error);
        updateBubble(thinkingBubble, 'Sorry, I encountered an error. Please try again.');
    }
});

function addBubble(text, className) {
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', className);
    // Use textContent to avoid accidental HTML injection; if you want formatting, you can still use innerHTML
    bubble.innerHTML = text;
    chatContainer.appendChild(bubble);
    // Scroll to the bottom of the chat
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return bubble;
}

function updateBubble(bubble, newText) {
    // Format the text (bold, italics, new lines)
    let formattedText = (newText || '')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    bubble.innerHTML = formattedText;
    chatContainer.scrollTop = chatContainer.scrollHeight;
        }
