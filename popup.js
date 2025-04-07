document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');

  // Handle send button click
  sendButton.addEventListener('click', sendMessage);

  // Handle Enter key press
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Disable input while processing
    userInput.disabled = true;
    sendButton.disabled = true;

    // Add user message to chat
    showMessage(message, 'user');
    userInput.value = '';

    try {
      // Get API key from Chrome storage
      const result = await chrome.storage.local.get(['geminiApiKey']);
      const apiKey = result.geminiApiKey;

      if (!apiKey) {
        throw new Error('API key not found. Please set it in the extension settings.');
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`API Error: ${data.error?.message || 'Unknown error'}`);
      }

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        showMessage(data.candidates[0].content.parts[0].text, 'bot');
      } else {
        showMessage('Sorry, I couldn\'t process your request. The response format was unexpected.', 'bot');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage(`Error: ${error.message}`, 'bot');
    }

    // Re-enable input
    userInput.disabled = false;
    sendButton.disabled = false;
  }

  function showMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Initial welcome message
  showMessage('Hello! I am your Gemini AI assistant. How can I help you today?', 'bot');
}); 