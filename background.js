// Background script for future use if needed
console.log('Gemini Chat Assistant background script loaded');

// Read API key from .env file and store it in Chrome storage
async function initializeApiKey() {
  try {
    const response = await fetch(chrome.runtime.getURL('.env'));
    const envContent = await response.text();
    
    // Find the API key line and extract its value
    const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.+)/);
    if (!apiKeyMatch) {
      throw new Error('GEMINI_API_KEY not found in .env file');
    }
    
    const apiKey = apiKeyMatch[1].trim();
    await chrome.storage.local.set({ geminiApiKey: apiKey });
    console.log('API key stored successfully');
  } catch (error) {
    console.error('Error storing API key:', error);
  }
}

// Initialize when the extension is installed or updated
chrome.runtime.onInstalled.addListener(initializeApiKey);

// Also initialize when the extension starts
initializeApiKey(); 