# AI Summarizer

AI Summarizer is a web application that allows users to quickly summarize long texts using various AI models. It includes an animated landing page, an app workspace, OCR text extraction from images, and local browser history.

## Key Features

* **Landing Page**: Animated landing page at `/` with a quick product demo.
* **Text Summarization**: Use the app workspace at `/app` to input or paste long texts and get concise summaries.
* **AI Model Selection**: Choose from Groq production chat models (Llama 3.3 70B, Llama 3.1 8B, GPT OSS 120B, GPT OSS 20B) to perform summarization.
* **Text Extraction from Images (OCR)**: Upload an image containing text, and the application will extract the text for summarization.
* **Summarization History**: All summaries are stored locally in your browser.
  * View summary details from the history.
  * Delete individual history items.
  * Clear all history at once.
* **Responsive Design**: User interface accessible on both desktop and mobile devices.
* **Secure API Boundary**: The frontend calls `/api/summarize`; the Groq key stays server-side.

## Technologies Used

* **Frontend**:
  * [React](https://reactjs.org/)
  * [Vite](https://vitejs.dev/)
  * [Tailwind CSS](https://tailwindcss.com/)
  * [React Router](https://reactrouter.com/)
* **AI Summarization**:
  * [Groq API](https://console.groq.com/docs/) (OpenAI-compatible chat completions)
* **Text Extraction from Images (OCR)**:
  * [Tesseract.js](https://tesseract.projectnaptha.com/)
* **Icons**:
  * [React Icons](https://react-icons.github.io/react-icons/)

## Prerequisites

* [Node.js](https://nodejs.org/) (version 16.x or higher recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation and Local Setup

1. **Clone the repository:**

    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd ai-summarize
    ```

2. **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Setup Environment Variables:**
    Create a `.env` file in the project root directory and add your Groq API key:

    ```env
    GROQ_API_KEY=your_groq_api_key_here
    ```

    Replace the placeholder with a valid Groq API key. Keep this key server-side only.

4. **Run the Application (Development Mode):**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The landing page runs at `http://localhost:5173`; the summarizer app runs at `http://localhost:5173/app`.

## How to Use

1. **Input Text**: Type or paste the text you want to summarize into the input text area.
2. **Upload Image (Optional)**: Click the "Upload" button to select an image. Text from the image will be extracted and inserted into the input area.
3. **Select AI Model**: Choose the desired AI model from the dropdown menu.
4. **Summarize**: Click the "Summarize" button.
5. **View Results**: The summary will appear below the input area.
6. **History**: New summaries will be automatically added to the history sidebar.
    * Click a history item to view its details in the detail box.
    * Use the delete button on each item or the "Clear" button in the history header to manage your history.

## Environment Variables

* `GROQ_API_KEY`: Server-side API key for accessing Groq. Required by `/api/summarize`.
* `VITE_COPILOTKIT_RUNTIME_URL`: Optional CopilotKit runtime endpoint. If omitted, the app runs without CopilotKit UI.

## Deployment

This application is configured for Vercel-style deployment with `api/summarize.js` and SPA rewrites in `vercel.json`. Configure `GROQ_API_KEY` in the deployment platform's server-side environment variables.

## Contributing

Contributions are always welcome! If you have suggestions or find a bug, please create an issue or pull request.

---
