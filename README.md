# Gemini Chat Assistant Chrome Extension

A Chrome extension that provides a chat interface powered by Google's Gemini model.

## Features

- Clean and modern chat interface
- Real-time chat with Gemini AI
- API key configuration via .env file
- Responsive design

## Installation

1. Clone this repository or download the source code
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Setup

1. The extension uses the API key from the `.env` file
2. Make sure your `.env` file contains the `GEMINI_API_KEY` variable
3. Start chatting!

## Usage

- Click the extension icon to open the chat interface
- Type your message and press Enter or click Send
- The Gemini AI will respond to your messages
- You can use Shift+Enter for new lines in your messages

## Security

- The API key is stored in the `.env` file
- The extension only makes requests to Google's official Gemini API endpoints

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## License

MIT License 