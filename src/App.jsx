import { useState, useEffect } from "react";
import Summarizer from "./components/Summarizer";
import History from "./components/History";

const App = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [history, setHistory] = useState([]);
  const [model, setModel] = useState("deepseek/deepseek-chat-v3-0324:free");
  const [loading, setLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showHistoryMobile, setShowHistoryMobile] = useState(false);

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("summaryHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const handleSummarize = async () => {
    if (inputText.trim() === "") return;
    setSummary("");
    setLoading(true);
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: "user",
                content: `Summarize the following text without any addition answer. Answer in the language the user speaks:\n${inputText}`,
              },
            ],
          }),
        }
      );
      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const newSummary = data.choices[0].message.content;
        const newHistoryItem = {
          summary: newSummary,
          time: new Date().toISOString(),
        };
        const updatedHistory = [...history, newHistoryItem];
        setSummary(newSummary);
        setHistory(updatedHistory);
        localStorage.setItem("summaryHistory", JSON.stringify(updatedHistory));
      } else {
        setSummary("Gagal mendapatkan ringkasan dari API.");
      }
    } catch {
      setSummary("Terjadi kesalahan saat menghubungi API.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setSummary("");
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg-primary)] flex">
      {/* Sidebar hanya tampil di desktop */}
      <aside className="hidden sm:flex fixed left-0 top-0 w-64 h-screen bg-[var(--theme-bg-secondary)] border-r border-[var(--theme-divider-color)] flex-col z-40">
        <div className="h-16 flex items-center justify-center border-b border-[var(--theme-divider-color)]">
          <span className="text-xl font-bold text-[var(--theme-accent-blue)] tracking-wide">
            AI Summarizer
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <History
            history={history}
            onSelect={setSelectedHistory}
          />
        </div>
        <div className="border-t border-[var(--theme-divider-color)] px-4 py-3 text-xs text-[var(--theme-text-secondary)]">
          <div className="mb-2">
            <strong>About:</strong>
            <div>AI Summarizer adalah aplikasi untuk meringkas teks atau gambar secara otomatis menggunakan AI.</div>
          </div>
          <div>
            <strong>Contact:</strong>
            <div>Email: info@aisummarizer.com</div>
          </div>
        </div>
      </aside>

      {/* Header mobile */}
      <div className="sm:hidden fixed top-0 left-0 w-full flex items-center h-14 bg-[var(--theme-bg-primary)] border-b border-[var(--theme-divider-color)] z-50 px-3">
        {/* Tombol hamburger */}
        <button
          className="mr-3 p-2 rounded hover:bg-[var(--theme-bg-tertiary)] focus:outline-none"
          onClick={() => setShowHistoryMobile(true)}
          aria-label="Buka Riwayat"
        >
          {/* Ikon hamburger */}
          <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
            <rect y="5" width="24" height="2" rx="1" fill="currentColor" />
            <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
            <rect y="17" width="24" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        <span className="text-xl font-bold text-[var(--theme-accent-blue)] tracking-wide">
          AI Summarizer
        </span>
      </div>

      {/* Drawer/modal riwayat untuk mobile */}
      {showHistoryMobile && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowHistoryMobile(false)}
          />
          {/* Drawer */}
          <div className="relative bg-[var(--theme-bg-secondary)] w-72 max-w-full h-full p-4 shadow-lg overflow-y-auto z-10">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-xl text-[var(--theme-accent-blue)]">
                AI Summarizer
              </span>
              <button
                className="text-sm text-[var(--theme-accent-blue)]"
                onClick={() => setShowHistoryMobile(false)}
              >
                Tutup
              </button>
            </div>
            <History
              history={history}
              onSelect={(item) => {
                setSelectedHistory(item);
                setShowHistoryMobile(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 sm:pl-64 mt-14 sm:mt-0">
        <div className="w-full max-w-5xl mx-auto pt-3 pb-4 px-2 sm:px-6 lg:px-8">
          <Summarizer
            inputText={inputText}
            setInputText={setInputText}
            summary={summary}
            handleSummarize={handleSummarize}
            handleReset={handleReset}
            model={model}
            setModel={setModel}
            loading={loading}
            selectedHistory={selectedHistory}
            setSelectedHistory={setSelectedHistory}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
