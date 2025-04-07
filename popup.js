document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup loaded'); // Initial log to confirm script is running
  
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');

  console.log('DOM elements loaded:', { chatMessages, userInput, sendButton });

  // Handle send button click
  sendButton.addEventListener('click', () => {
    console.log('Send button clicked');
    sendMessage();
  });

  // Handle Enter key press
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('Enter key pressed');
      e.preventDefault();
      sendMessage();
    }
  });

  async function listModels() {
    const apiKey = 'AIzaSyD5jmsstKV0Cyk1sqfpLWF-R1Yja_dJSZ4';
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1/models', {
        headers: {
          'x-goog-api-key': apiKey
        }
      });
      const data = await response.json();
      console.log('Available Models:', data);
      return data;
    } catch (error) {
      console.error('Error listing models:', error);
      return null;
    }
  }

  async function sendMessage() {
    console.log('sendMessage function called');
    const message = userInput.value.trim();
    if (!message) return;

    console.log('Processing message:', message);

    // Disable input while processing
    userInput.disabled = true;
    sendButton.disabled = true;

    // Add user message to chat
    showMessage(message, 'user');
    userInput.value = '';

    // Get API key from .env file
    const apiKey = 'AIzaSyD5jmsstKV0Cyk1sqfpLWF-R1Yja_dJSZ4';
    console.log('Using API key:', apiKey.substring(0, 10) + '...');

    try {
      console.log('Making API request...');
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

      console.log('API Response status:', response.status);
      const data = await response.json();
      console.log('Full API Response:', data);

      if (!response.ok) {
        throw new Error(`API Error: ${data.error?.message || 'Unknown error'}`);
      }

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        showMessage(data.candidates[0].content.parts[0].text, 'bot');
      } else {
        showMessage('Sorry, I couldn\'t process your request. The response format was unexpected.', 'bot');
      }
    } catch (error) {
      console.error('Detailed Error:', error);
      console.error('Error stack:', error.stack);
      showMessage(`Error: ${error.message}`, 'bot');
    }

    // Re-enable input
    userInput.disabled = false;
    sendButton.disabled = false;
  }

  function showMessage(text, sender) {
    console.log('Showing message:', { text, sender });
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // List available models when the popup opens
  listModels();

  // Test message to verify the extension is working
  console.log('Extension initialized successfully');
  showMessage('Hello! I am your Gemini AI assistant. How can I help you today?', 'bot');
}); 