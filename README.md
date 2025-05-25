# AI Summarizer

AI Summarizer is a web application that allows users to quickly summarize long texts using various AI models. The application also supports text extraction from images (OCR) for subsequent summarization. Summarization history is stored locally in the user's browser for easy access.

## Key Features

* **Text Summarization**: Input or paste long texts to get concise summaries.
* **AI Model Selection**: Choose from various available AI models (e.g., GPT-3.5 Turbo, Mistral, Llama 3, Claude 3.5 Haiku) to perform summarization.
* **Text Extraction from Images (OCR)**: Upload an image containing text, and the application will extract the text for summarization.
* **Summarization History**: All summaries are stored locally in your browser.
  * View summary details from the history.
  * Delete individual history items.
  * Clear all history at once.
* **Responsive Design**: User interface accessible on both desktop and mobile devices.
* **Light/Dark Theme**: (If implemented) Support for light and dark themes.

## Technologies Used

* **Frontend**:
  * [React](https://reactjs.org/)
  * [Vite](https://vitejs.dev/)
  * [Tailwind CSS](https://tailwindcss.com/)
* **AI Summarization**:
  * [OpenRouter API](https://openrouter.ai/) (for accessing various LLM models)
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
    Create a `.env` file in the project root directory and add your OpenRouter API key:

    ```env
    VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    ```

    Replace `sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` with your valid OpenRouter API key.

4. **Run the Application (Development Mode):**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The application will run at `http://localhost:5173` (or another port if 5173 is already in use).

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

* `VITE_OPENROUTER_API_KEY`: Your API key for accessing the OpenRouter service. Required for the AI summarization feature.

## Deployment

This application can be deployed to platforms like Vercel, Netlify, or GitHub Pages. Ensure you configure the `VITE_OPENROUTER_API_KEY` environment variable in your deployment platform's settings.

## Contributing

Contributions are always welcome! If you have suggestions or find a bug, please create an issue or pull request.

---
