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
    setInputText("Memproses gambar untuk ekstraksi teks..."); // Pesan loading
    let worker; // Deklarasikan worker di sini agar bisa diakses di finally

    try {
      // Sediakan bahasa langsung ke createWorker.
      // Tidak perlu lagi worker.loadLanguage() dan worker.initialize() secara terpisah.
      worker = await createWorker("eng+ind");

      const {
        data: { text },
      } = await worker.recognize(file);
      // worker.terminate() dipindahkan ke blok finally
      setInputText(text);
      // return text; // Tidak perlu return jika hanya set state
    } catch (error) {
      console.error("Error extracting text:", error);
      setInputText("Gagal mengekstrak teks dari gambar. Lihat konsol untuk detail.");
    } finally {
      if (worker) {
        await worker.terminate(); // Pastikan worker selalu dihentikan
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
    <div className="mt-2 grid grid-cols-1 gap-6">
      {/* Bagian Input */}
      <div className="bg-[var(--theme-bg-secondary)] p-5 rounded-lg border border-[var(--theme-border-color)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg font-medium text-[var(--theme-text-primary)] mb-3 sm:mb-0">
            Input Teks
          </h2>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label
              htmlFor="model-select"
              className="text-sm text-[var(--theme-text-secondary)] whitespace-nowrap"
            >
              Model AI:
            </label>
            <select
              id="model-select"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full sm:min-w-[180px] py-2 px-3 text-sm bg-[var(--theme-bg-tertiary)] border-[var(--theme-border-color)] focus:border-[var(--theme-accent-blue)] rounded-md"
            >
              <option value="openai/gpt-3.5-turbo:free">GPT 3.5 Turbo</option>
              <option value="anthropic/claude-3-opus:free">Claude 3 Opus</option>
              <option value="deepseek/deepseek-llm-r3:free">DeepSeek R3</option>
              <option value="google/gemini-2.5-pro:free">Gemini 2.5 Pro</option>
              <option value="meta-llama/llama-4-70b-instruct:free">Llama 4</option>
            </select>
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full min-h-[160px] p-3 text-sm bg-[var(--theme-bg-tertiary)] border-[var(--theme-border-color)] focus:border-[var(--theme-accent-blue)] rounded-md resize-y"
          placeholder="Ketik atau tempel teks di sini, atau unggah gambar..."
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
            {uploadedImage && (
              <button
                onClick={handleClearImage}
                className="ml-2 text-xs text-[var(--theme-text-placeholder)] hover:text-[var(--theme-accent-blue)] underline"
              >
                Hapus Gambar
              </button>
            )}
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
                  Meringkas...
                </>
              ) : (
                "Ringkas"
              )}
            </button>
          </div>
        </div>
        {uploadedImage && (
          <div className="mt-3 p-2 border border-dashed border-[var(--theme-border-color)] rounded-md inline-block bg-[var(--theme-bg-primary]">
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
          Hasil Ringkasan
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
              Memproses ringkasan...
            </div>
          )}
          {!loading && !summary && (
            <p className="text-[var(--theme-text-placeholder)]">
              Ringkasan akan muncul di sini setelah teks diproses.
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
      <div className="bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-color)] rounded p-4 min-h-[60px] relative transition">
        {selectedHistory ? (
          <>
            <button
              className="absolute top-2 right-2 text-xs text-[var(--theme-text-placeholder)] hover:text-red-400"
              onClick={() => setSelectedHistory(null)}
            >
              Tutup
            </button>
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
          </>
        ) : (
          <div className="text-[var(--theme-text-placeholder)] text-sm text-center py-4">
            Pilih salah satu riwayat ringkasan di sidebar untuk melihat detail di sini.
          </div>
        )}
      </div>
    </div>
  );
};

export default Summarizer;
