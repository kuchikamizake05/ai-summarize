import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { createWorker } from "tesseract.js";

const Summarizer = ({
  inputText,
  setInputText,
  summary,
  handleSummarize,
  handleReset,
  model,
  setModel,
  loading,
  selectedHistory,
  setSelectedHistory,
}) => {
  const [imageProcessing, setImageProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const extractTextFromImage = async (file) => {
    setImageProcessing(true);
    setInputText("Memproses gambar untuk ekstraksi teks..."); 
    let worker; 

    try {
      worker = await createWorker("eng+ind");

      const {
        data: { text },
      } = await worker.recognize(file);
      setInputText(text);
    } catch (error) {
      console.error("Error extracting text:", error);
      setInputText("Gagal mengekstrak teks dari gambar. Lihat konsol untuk detail.");
    } finally {
      if (worker) {
        await worker.terminate(); 
      }
      setImageProcessing(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target.result);
    reader.readAsDataURL(file);
    await extractTextFromImage(file);
  };

  const handleClearImage = () => {
    setUploadedImage(null);
  };

  return (
    <div className="mt-2 ml-1 mr-2 sm:mt-3 grid grid-cols-1 gap-5 sm:gap-5">
      {/* Bagian Input */}
      <div className="bg-[var(--theme-bg-secondary)] p-5 rounded-lg border border-[var(--theme-border-color)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg font-medium text-[var(--theme-text-primary)] mb-3 sm:mb-0">
            Input your Text
          </h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label
              htmlFor="model-select"
              className="text-sm text-[var(--theme-text-secondary)] whitespace-nowrap"
            >
              Select AI:
            </label>
            <select
              id="model-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full sm:min-w-[180px] py-2 px-3 text-sm bg-[var(--theme-bg-tertiary)] border-[var(--theme-border-color)] focus:border-[var(--theme-accent-blue)] rounded-md"
            >
              <option value="openai/gpt-3.5-turbo" className="text-[10px] sm:text-sm">GPT 3.5 Turbo</option>
              <option value="mistralai/devstral-small:free" className="text-[10px] sm:text-sm">Mistral: Devstral</option>
              <option value="meta-llama/llama-3-8b-instruct" className="text-[10px] sm:text-sm">Llama 3</option>
              <option value="anthropic/claude-3.5-haiku" className="text-[10px] sm:text-sm">Claude 3.5 Haiku</option>
              {/* Anda bisa menambahkan model lain atau menyesuaikan daftar ini */}
            </select>
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full min-h-[140px] sm:min-h-[180px] p-3 text-sm bg-[var(--theme-bg-tertiary)] border-[var(--theme-border-color)] focus:border-[var(--theme-accent-blue)] rounded-md resize-y"
          placeholder="Type or paste text here, or upload an image..."
          disabled={imageProcessing}
        ></textarea>

        <div className="mt-4 flex flex-row items-center gap-4">
          <div className="flex items-center">
            {/* tombol gambar */}
            <label
              htmlFor="image-upload-input"
              className={`inline-flex items-center px-3 py-2 border border-[var(--theme-border-color)] text-sm font-medium rounded-md text-[var(--theme-text-secondary)] bg-[var(--theme-bg-tertiary)] hover:bg-[var(--theme-border-color)] cursor-pointer transition-colors ${
                imageProcessing ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <svg
                className="-ml-0.5 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              {imageProcessing ? "Loading..." : "Upload"}
              <input
                id="image-upload-input"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={imageProcessing}
              />
            </label>
          </div>
          <div className="flex gap-3 ml-auto">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm bg-[var(--theme-button-secondary-bg)] text-[var(--theme-button-secondary-text)] hover:bg-[var(--theme-border-color)] border border-[var(--theme-border-color)] disabled:opacity-60 transition-colors"
              disabled={loading || imageProcessing}
            >
              Reset
            </button>
            <button
              onClick={handleSummarize}
              className="px-5 py-2 text-sm bg-[var(--theme-button-primary-bg)] text-[var(--theme-button-primary-text)] hover:bg-[var(--theme-accent-blue-hover)] disabled:opacity-60 flex items-center"
              disabled={loading || imageProcessing || !inputText.trim()}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--theme-button-primary-text)]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Summarizing...
                </>
              ) : (
                "Summarize"
              )}
            </button>
          </div>
        </div>
        {uploadedImage && (
          <div className="mt-3 p-2 border border-dashed border-[var(--theme-border-color)] rounded-md inline-block bg-[var(--theme-bg-primary)] relative">
            <button
              onClick={handleClearImage}
              className="absolute top-1 right-1 p-1 rounded-full bg-gray-400 hover:bg-red-200 transition group"
              aria-label="Hapus gambar"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeWidth={2}
                  d="M6 6l12 12M6 18L18 6"
                  className="stroke-black group-hover:stroke-red-700 transition"
                />
              </svg>
            </button>
            <img
              src={uploadedImage}
              alt="Pratinjau unggahan"
              className="max-h-32 rounded"
            />
          </div>
        )}
      </div>

      {/* Bagian Output */}
      <div className="w-full bg-[var(--theme-bg-secondary)] p-5 rounded-lg border border-[var(--theme-border-color)] min-h-[120px] max-h-[220px] overflow-y-auto">
        <h2 className="text-lg font-medium text-[var(--theme-text-primary)] mb-3">
          Summary
        </h2>
        <div className="text-sm">
          {loading && !summary && (
            <div className="flex items-center justify-center h-full text-[var(--theme-text-secondary)] py-10">
              <svg
                className="animate-spin mr-3 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </div>
          )}
          {!loading && !summary && (
            <p className="text-[var(--theme-text-placeholder)]">
              The summary will appear here after the text is processed.
            </p>
          )}
          {summary && (
            <div className="prose-custom-dark max-w-none">
              <ReactMarkdown>{summary}</ReactMarkdown>
              {/* Tampilkan waktu ringkasan terbaru jika ada */}
              {Array.isArray(history) && history.length > 0 && history[history.length - 1].time && (
                <div className="text-xs text-[var(--theme-text-placeholder)] mt-4 text-right">
                  {new Date(history[history.length - 1].time).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selalu tampilkan box detail riwayat */}
      <div className="bg-[var(--theme-bg-secondary)] p-5 rounded-lg border border-[var(--theme-border-color)] min-h-[60px] relative transition">
        {selectedHistory ? (
          <>
            <div className="text-sm text-[var(--theme-text-primary)] whitespace-pre-line">
              {typeof selectedHistory === "string"
                ? selectedHistory
                : selectedHistory.summary || ""}
            </div>
            {selectedHistory.time && (
              <div className="text-xs text-[var(--theme-text-placeholder)] mt-2 text-right">
                {new Date(selectedHistory.time).toLocaleString()}
              </div>
            )}
            <div className="flex justify-end mt-3">
              <button
                className="px-5 py-2 text-sm bg-[var(--theme-button-primary-bg)] text-[var(--theme-button-primary-text)] hover:bg-[var(--theme-accent-blue-hover)] border border-[var(--theme-border-color)] rounded disabled:opacity-60 transition-colors"
                onClick={() => setSelectedHistory(null)}
              >
                Clear
              </button>
            </div>
          </>
        ) : (
          <div className="text-[var(--theme-text-placeholder)] text-sm text-center py-4">
            Select one of the summary histories in the sidebar to see the details here.
          </div>
        )}
      </div>
    </div>
  );
};

export default Summarizer;
