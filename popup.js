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

    // Get API key from .env file
    const apiKey = 'AIzaSyD5jmsstKV0Cyk1sqfpLWF-R1Yja_dJSZ4';

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
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
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        showMessage(data.candidates[0].content.parts[0].text, 'bot');
      } else {
        showMessage('Sorry, I couldn\'t process your request. Please try again.', 'bot');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('An error occurred. Please try again later.', 'bot');
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
}); 