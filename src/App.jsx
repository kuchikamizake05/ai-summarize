import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import { Mail, Menu, MessageCircle, Trash2 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import LandingPage from "./components/LandingPage";
import Summarizer from "./components/Summarizer";
import History from "./components/History";
import HistoryDetailDrawer from "./components/HistoryDetailDrawer";
import Dialog from "./components/ui/Dialog";
import Sheet from "./components/ui/Sheet";
import ToastStack from "./components/ui/ToastStack";
import { brand, brandAssets } from "./constants/brand";
import { models } from "./constants/models";
import { cn, ui } from "./lib/ui";

const STORAGE_KEY = "summaryHistory";
const DRAFT_KEY = "summaryDraft";
const loadingSteps = ["Reading text", "Extracting points", "Formatting summary"];

const CopilotProvider = lazy(async () => {
  const copilotModule = await import("@copilotkit/react-core/v2");
  const CopilotKitComponent = copilotModule.CopilotKit;
  return {
    default: ({ runtimeUrl, children }) => (
      <CopilotKitComponent runtimeUrl={runtimeUrl} showDevConsole={false}>
        {children}
      </CopilotKitComponent>
    ),
  };
});

const CopilotChatPopup = lazy(async () => {
  const copilotModule = await import("@copilotkit/react-core/v2");
  const CopilotPopupComponent = copilotModule.CopilotPopup;
  return {
    default: () => (
      <CopilotPopupComponent
        defaultOpen={false}
        width={420}
        height={620}
        labels={{
          title: "AI Summarizer Copilot",
          initial: "Bisa bantu bikin ringkasan, ubah gaya bahasa, atau cek poin penting.",
        }}
        clickOutsideToClose
      />
    ),
  };
});

const readHistory = () => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const saveHistory = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const StatPill = ({ label, value }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.035] px-2.5 py-1.5">
    <span className="block text-sm font-semibold text-white">{value}</span>
    <span className="text-[0.62rem] uppercase tracking-[0.14em] text-white/34">{label}</span>
  </div>
);

const LogoMark = ({ className = "h-9 w-9" }) => (
  <img
    src={brandAssets.logoIcon}
    alt={`${brand.product} logo`}
    className={cn("shrink-0 rounded-lg object-contain", className)}
  />
);

const BrandLockup = ({ compact = false }) => (
  compact ? (
    <div className="flex min-w-0 items-center gap-3">
      <LogoMark className="h-8 w-8" />
      <div className="min-w-0">
        <p className={ui.label}>{brand.lab}</p>
        <h1 className="truncate font-display text-base font-semibold tracking-[-0.04em] text-white">{brand.product}</h1>
      </div>
    </div>
  ) : (
    <div>
      <p className={ui.label}>{brand.lab}</p>
      <img
        src={brandAssets.logoWordmark}
        alt={`${brand.product} wordmark`}
        className="mt-2 h-auto w-full max-w-[13rem] object-contain"
      />
    </div>
  )
);

const SocialDock = () => (
  <div className="grid grid-cols-3 gap-2">
    <a
      className={cn(ui.icon, "h-9 w-9")}
      href="https://mail.google.com/mail/u/0/?to=faaidsakhaa@gmail.com&fs=1&tf=cm"
      title="Email"
    >
      <Mail size={16} />
    </a>
    <a
      className={cn(ui.icon, "h-9 w-9")}
      href="https://github.com/kuchikamizake05"
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub"
    >
      <FaGithub size={16} />
    </a>
    <a
      className={cn(ui.icon, "h-9 w-9")}
      href="https://discordapp.com/users/489719895425155082"
      target="_blank"
      rel="noopener noreferrer"
      title="Discord"
    >
      <MessageCircle size={16} />
    </a>
  </div>
);

const SummarizerApp = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryMode, setSummaryMode] = useState("bullets");
  const [error, setError] = useState("");
  const [model, setModel] = useState(models[0].value);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [sourceType, setSourceType] = useState("text");
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [selectedHistoryIndex, setSelectedHistoryIndex] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistoryMobile, setShowHistoryMobile] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [focusComposerToken, setFocusComposerToken] = useState(0);

  useEffect(() => {
    setHistory(readHistory());
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY));
      if (draft?.text) {
        setInputText(draft.text);
      }
      if (draft?.model && models.some((item) => item.value === draft.model)) {
        setModel(draft.model);
      }
      if (draft?.mode) {
        setSummaryMode(draft.mode);
      }
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ text: inputText, model, mode: summaryMode }));
  }, [inputText, model, summaryMode]);

  useEffect(() => {
    if (!loading) {
      setLoadingStep("");
      return undefined;
    }
    let index = 0;
    setLoadingStep(loadingSteps[index]);
    const interval = window.setInterval(() => {
      index = (index + 1) % loadingSteps.length;
      setLoadingStep(loadingSteps[index]);
    }, 900);
    return () => window.clearInterval(interval);
  }, [loading]);

  const dismissToast = useCallback((id) => {
    setToasts((items) => items.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (toast) => {
      const id = crypto.randomUUID();
      setToasts((items) => [...items, { ...toast, id }].slice(-3));
      window.setTimeout(() => dismissToast(id), toast.duration || 4200);
      return id;
    },
    [dismissToast],
  );

  const stats = useMemo(() => {
    const trimmedInput = inputText.trim();
    const words = trimmedInput ? trimmedInput.split(/\s+/).length : 0;
    return {
      words,
      chars: inputText.length,
      summaries: history.length,
    };
  }, [history.length, inputText]);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setSummary("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          model,
          mode: summaryMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Request ringkasan gagal.");
      }

      const newSummary = data?.summary?.trim();

      if (!newSummary) {
        throw new Error("API tidak mengembalikan ringkasan.");
      }

      const newHistoryItem = {
        id: crypto.randomUUID(),
        inputPreview: inputText.slice(0, 160),
        model,
        mode: summaryMode,
        source: sourceType,
        wordCount: stats.words,
        summaryLength: newSummary.length,
        summary: newSummary,
        time: new Date().toISOString(),
      };
      const updatedHistory = [...history, newHistoryItem];

      setSummary(newSummary);
      setHistory(updatedHistory);
      saveHistory(updatedHistory);
      showToast({ title: "Summary saved", description: `${stats.words} kata / ${summaryMode}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghubungi API.");
      showToast({ title: "Summarize gagal", description: err instanceof Error ? err.message : "Coba lagi." });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setSummary("");
    setError("");
    localStorage.removeItem(DRAFT_KEY);
    showToast({ title: "Draft cleared" });
  };

  const handleDeleteHistory = (indexToDelete) => {
    const itemToDelete = history[indexToDelete];
    const updatedHistory = history.filter((_, index) => index !== indexToDelete);

    setHistory(updatedHistory);
    saveHistory(updatedHistory);
    showToast({
      title: "History deleted",
      description: "Undo tersedia beberapa detik.",
      action: {
        label: "Undo",
        onClick: () => {
          const restored = [...updatedHistory];
          restored.splice(indexToDelete, 0, itemToDelete);
          setHistory(restored);
          saveHistory(restored);
          showToast({ title: "History restored" });
        },
      },
    });

    if (selectedHistory?.id === itemToDelete?.id) {
      setSelectedHistory(null);
      setSelectedHistoryIndex(null);
    }
  };

  const handleSelectHistory = (item, index) => {
    setSelectedHistory(item);
    setSelectedHistoryIndex(index);
  };

  const handleCloseHistoryDetail = () => {
    setSelectedHistory(null);
    setSelectedHistoryIndex(null);
  };

  const handleDeleteSelectedHistory = () => {
    if (selectedHistoryIndex === null) return;
    handleDeleteHistory(selectedHistoryIndex);
  };

  const handleUseHistoryAsInput = () => {
    if (!selectedHistory) return;
    setInputText(selectedHistory.inputPreview || selectedHistory.summary || String(selectedHistory));
    setSummary("");
    setError("");
    handleCloseHistoryDetail();
    showToast({ title: "History loaded into composer" });
  };

  const requestClearAllHistory = () => {
    if (history.length) {
      setConfirmClearOpen(true);
    }
  };

  const handleClearAllHistory = () => {
    const previousHistory = history;
    setHistory([]);
    setSelectedHistory(null);
    localStorage.removeItem(STORAGE_KEY);
    setConfirmClearOpen(false);
    showToast({
      title: "History cleared",
      action: {
        label: "Undo",
        onClick: () => {
          setHistory(previousHistory);
          saveHistory(previousHistory);
          showToast({ title: "History restored" });
        },
      },
    });
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        handleSummarize();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setFocusComposerToken((value) => value + 1);
      }
      if (event.key === "Escape") {
        handleCloseHistoryDetail();
        setShowHistoryMobile(false);
        setConfirmClearOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const historyPanel = (
    <History
      history={history}
      selectedHistory={selectedHistory}
      onSelect={handleSelectHistory}
      onDelete={handleDeleteHistory}
      onClearAll={requestClearAllHistory}
    />
  );

  return (
    <div className={cn(ui.canvas, "min-h-screen lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]")}>
      <aside className="sticky top-0 hidden h-screen min-h-0 flex-col gap-3 border-r border-white/10 bg-[#090b0b]/90 p-3 backdrop-blur-2xl lg:flex">
        <Link className={cn(ui.panelElevated, "group block p-3 no-underline")} to="/">
          <BrandLockup />
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <StatPill label="words" value={stats.words} />
          <StatPill label="saved" value={stats.summaries} />
        </div>

        <div className="min-h-0 flex-1">{historyPanel}</div>
        <SocialDock />
      </aside>

      <Sheet
        open={showHistoryMobile}
        title="Archive"
        subtitle={`${history.length} summary tersimpan`}
        onClose={() => setShowHistoryMobile(false)}
      >
        <History
          history={history}
          selectedHistory={selectedHistory}
          onSelect={(item, index) => {
            handleSelectHistory(item, index);
            setShowHistoryMobile(false);
          }}
          onDelete={handleDeleteHistory}
          onClearAll={requestClearAllHistory}
        />
      </Sheet>

      <main className="min-w-0 px-3 py-3 pb-20 sm:px-4 lg:px-[clamp(0.75rem,2vw,1.5rem)] lg:pb-5">
        <div className="sticky top-2 z-40 mb-3 rounded-xl border border-white/10 bg-[#0b0d0d]/88 p-2 backdrop-blur-2xl">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <button className={cn(ui.icon, "lg:hidden")} type="button" onClick={() => setShowHistoryMobile(true)} aria-label="Buka history">
                <Menu size={17} />
              </button>
              <BrandLockup compact />
            </div>

            <div className="hidden min-w-0 items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#07080a]/70 px-3 py-2 text-sm text-white/46 md:col-span-2 md:flex lg:col-span-1">
              <span className="truncate">Paste teks atau upload gambar, lalu summarize.</span>
              <span className="text-white/20">/</span>
              <span>{stats.words} kata</span>
              <span className="text-white/20">/</span>
              <span>{models.find((item) => item.value === model)?.label}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden min-h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-1.5 text-sm text-white/54 sm:flex">
                {stats.chars} chars
              </div>
              <button
                className={cn(ui.secondary, "min-h-9 px-3 max-sm:h-10 max-sm:w-10 max-sm:px-0")}
                type="button"
                onClick={requestClearAllHistory}
                disabled={!history.length}
                aria-label="Clear history"
                title="Clear history"
              >
                <Trash2 size={16} />
                <span className="max-sm:hidden">Clear</span>
              </button>
            </div>
          </div>
        </div>

        <Summarizer
          inputText={inputText}
          setInputText={setInputText}
          summary={summary}
          error={error}
          handleSummarize={handleSummarize}
          handleReset={handleReset}
          model={model}
          models={models}
          setModel={setModel}
          summaryMode={summaryMode}
          setSummaryMode={setSummaryMode}
          loading={loading}
          loadingStep={loadingStep}
          hasSummary={Boolean(summary)}
          history={history}
          stats={stats}
          focusComposerToken={focusComposerToken}
          onSourceChange={setSourceType}
          onToast={showToast}
        />
      </main>

      <HistoryDetailDrawer
        item={selectedHistory}
        onClose={handleCloseHistoryDetail}
        onDelete={handleDeleteSelectedHistory}
        onUseAsInput={handleUseHistoryAsInput}
        onToast={showToast}
      />

      <Dialog
        open={confirmClearOpen}
        title="Hapus semua riwayat?"
        description="Semua summary tersimpan di browser ini akan dibersihkan."
        onClose={() => setConfirmClearOpen(false)}
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button className={ui.secondary} type="button" onClick={() => setConfirmClearOpen(false)}>
            Batal
          </button>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#ff6161] px-4 text-sm font-semibold text-white transition hover:bg-[#ff7474]" type="button" onClick={handleClearAllHistory}>
            Hapus riwayat
          </button>
        </div>
      </Dialog>
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

const AppRoutes = () => (
  <Routes>
    <Route element={<LandingPage />} path="/" />
    <Route element={<SummarizerApp />} path="/app" />
    <Route element={<Navigate replace to="/" />} path="*" />
  </Routes>
);

const App = () => {
  const copilotRuntimeUrl = import.meta.env.VITE_COPILOTKIT_RUNTIME_URL;

  return (
    <BrowserRouter>
      {copilotRuntimeUrl ? (
        <Suspense fallback={<AppRoutes />}>
          <CopilotProvider runtimeUrl={copilotRuntimeUrl}>
            <AppRoutes />
            <CopilotChatPopup />
          </CopilotProvider>
        </Suspense>
      ) : (
        <AppRoutes />
      )}
    </BrowserRouter>
  );
};

export default App;
