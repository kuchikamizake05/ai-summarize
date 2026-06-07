import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download, FileText, Image, Loader2, RotateCcw, Scissors, X } from "lucide-react";
import { createElement, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { cn, fadeUp, ui } from "../lib/ui";

const MotionArticle = motion.article;
const MotionDiv = motion.div;
const MotionSection = motion.section;

const markdownClass =
  "prose prose-invert max-w-none text-white/72 prose-headings:text-white prose-p:text-white/72 prose-strong:text-white prose-a:text-[#b6f264] prose-code:rounded prose-code:border prose-code:border-white/10 prose-code:bg-white/[0.04] prose-code:px-1 prose-code:text-white prose-pre:border prose-pre:border-white/10 prose-pre:bg-[#07080a] prose-blockquote:border-[#b6f264] prose-blockquote:text-white/72";

const formatDateTime = (value) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const Summarizer = ({
  inputText,
  setInputText,
  summary,
  error,
  handleSummarize,
  handleReset,
  model,
  models,
  setModel,
  summaryMode,
  setSummaryMode,
  loading,
  loadingStep,
  hasSummary,
  history,
  stats,
  focusComposerToken,
  onSourceChange,
  onToast,
}) => {
  const textareaRef = useRef(null);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const [mode, setMode] = useState("text");

  const activeModel = useMemo(() => models.find((item) => item.value === model), [model, models]);
  const latestTime = history.at(-1)?.time;
  const exampleInputs = [
    "Ringkas materi kuliah ini menjadi 5 poin inti dan action item.",
    "Buat summary notulen rapat ini dengan keputusan dan tindak lanjut.",
    "Ambil ide utama artikel ini dan tulis dalam bullet pendek.",
  ];
  const summaryModes = [
    ["bullets", "Bullets"],
    ["executive", "Executive"],
    ["actions", "Actions"],
    ["simple", "Simple"],
  ];

  useEffect(() => {
    if (focusComposerToken) {
      setMode("text");
      window.setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [focusComposerToken]);

  const extractTextFromImage = async (file) => {
    setImageProcessing(true);
    setOcrError("");
    setInputText("Memproses gambar untuk ekstraksi teks...");
    let worker;

    try {
      const { createWorker } = await import("tesseract.js");
      worker = await createWorker("eng+ind");
      const {
        data: { text },
      } = await worker.recognize(file);
      setInputText(text.trim());
      setMode("text");
      onSourceChange("ocr");
      onToast({ title: "OCR complete", description: "Teks gambar masuk ke composer." });
    } catch {
      setOcrError("OCR gagal. Coba gambar lebih jelas atau paste teks manual.");
      setInputText("");
    } finally {
      if (worker) {
        await worker.terminate();
      }
      setImageProcessing(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => setUploadedImage(readerEvent.target.result);
    reader.readAsDataURL(file);

    await extractTextFromImage(file);
    event.target.value = "";
  };

  const handleCopy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    onToast({ title: "Copied", description: "Summary disalin ke clipboard." });
    window.setTimeout(() => setCopied(false), 1400);
  };

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `summary-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
    onToast({ title: "Downloaded", description: "Markdown summary dibuat." });
  };

  return (
    <div className={cn("grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.82fr)]", hasSummary && "xl:grid-cols-[minmax(22rem,0.82fr)_minmax(0,1fr)]")}>
      <MotionSection
        className={cn(ui.panel, "min-w-0 p-3")}
        initial="hidden"
        animate="show"
        variants={fadeUp}
        transition={{ duration: 0.28 }}
      >
        <div className="mb-2.5 flex flex-col justify-between gap-2 border-b border-white/10 pb-2.5 sm:flex-row sm:items-center">
          <div>
            <p className={ui.label}>Composer</p>
            <h3 className="mt-0.5 font-display text-lg font-semibold tracking-[-0.02em] text-white">
              {inputText.trim() ? "Ready to summarize" : "Input source"}
            </h3>
          </div>
          <div className="grid grid-cols-2 rounded-lg border border-white/10 bg-white/[0.03] p-1">
            {[
              ["text", FileText, "Text"],
              ["ocr", Image, "OCR"],
            ].map(([value, Icon, label]) => (
              <button
                className={cn(
                  "inline-flex min-h-8 items-center justify-center gap-2 rounded-md px-3 text-sm transition",
                  mode === value ? "bg-white text-black" : "text-white/54 hover:bg-white/[0.05] hover:text-white",
                )}
                key={value}
                type="button"
                onClick={() => setMode(value)}
              >
                {createElement(Icon, { size: 15 })}
                {label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === "text" ? (
            <MotionDiv
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              key="text"
            >
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(event) => {
                  setInputText(event.target.value);
                  onSourceChange("text");
                }}
                className={cn(ui.input, "min-h-[12rem] w-full resize-y p-3 text-sm leading-6 sm:min-h-[15rem] lg:min-h-[18rem]")}
                placeholder="Tempel artikel, catatan rapat, materi kuliah, atau teks hasil OCR di sini..."
                disabled={imageProcessing}
              />
            </MotionDiv>
          ) : (
            <MotionDiv
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              key="ocr"
              className="grid min-h-[12rem] place-items-center rounded-lg border border-dashed border-white/14 bg-[#07080a]/80 p-4 text-center sm:min-h-[16rem] sm:p-5 lg:min-h-[18rem]"
            >
              <div>
                <Image className="mx-auto text-[#b6f264]" size={28} />
                <h4 className="mt-3 font-display text-base font-semibold text-white">Upload screenshot atau gambar teks</h4>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/46">
                  OCR berjalan di browser, lalu hasilnya otomatis pindah ke composer text.
                </p>
                <label className={cn(ui.primary, "mt-4 min-h-9 cursor-pointer px-3")}>
                  Upload image
                  <input className="hidden" type="file" accept="image/*" onChange={handleImageUpload} disabled={imageProcessing} />
                </label>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>

        <div className="mt-2.5 grid grid-cols-2 items-center gap-2 text-xs text-white/38 sm:flex sm:flex-wrap sm:gap-3">
          <span>{stats.words} kata</span>
          <span>{stats.chars} karakter</span>
          <label className="col-span-2 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 sm:col-span-1 sm:inline-flex">
            <span>Model</span>
            <select
              className={cn(ui.input, "min-h-8 min-w-0 rounded-md px-2 py-1 text-xs")}
              value={model}
              onChange={(event) => setModel(event.target.value)}
            >
              {models.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <span className="hidden sm:inline">{activeModel?.tone}</span>
          <label className="col-span-2 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 sm:col-span-1 sm:inline-flex">
            <span>Mode</span>
            <select
              className={cn(ui.input, "min-h-8 min-w-0 rounded-md px-2 py-1 text-xs")}
              value={summaryMode}
              onChange={(event) => setSummaryMode(event.target.value)}
            >
              {summaryModes.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {imageProcessing && <span className="text-[#ffc533]">OCR berjalan</span>}
        </div>

        {(error || ocrError) && (
          <div className="mt-3 rounded-lg border border-[#ff6161]/35 bg-[#ff6161]/10 px-4 py-3 text-sm text-[#ffd0d0]">
            {error || ocrError}
          </div>
        )}

        {uploadedImage && (
          <div className="relative mt-3 inline-block rounded-lg border border-white/10 bg-[#07080a] p-2">
            <img className="block max-h-36 max-w-52 rounded-md object-cover" src={uploadedImage} alt="Pratinjau unggahan" />
            <button
              className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-black/65 text-white"
              type="button"
              onClick={() => setUploadedImage(null)}
              aria-label="Hapus gambar"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="mt-3 grid grid-cols-[2.5rem_2.5rem_minmax(0,1fr)] items-center gap-2 sm:flex sm:flex-wrap sm:justify-end">
          <label
            className={cn(
              ui.ghost,
              "h-10 min-h-10 w-10 cursor-pointer px-0 sm:w-auto sm:px-3",
              imageProcessing && "cursor-not-allowed opacity-60",
            )}
            title="Upload image"
          >
            <Image size={16} />
            <span className="hidden sm:inline">Upload image</span>
            <input className="hidden" type="file" accept="image/*" onChange={handleImageUpload} disabled={imageProcessing} />
          </label>
          <button
            className={cn(ui.ghost, "h-10 min-h-10 w-10 px-0 sm:w-auto sm:px-3")}
            type="button"
            onClick={handleReset}
            disabled={loading || imageProcessing}
            title="Reset"
            aria-label="Reset"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            className={cn(ui.primary, "min-h-10 min-w-0 px-4 shadow-[0_12px_40px_rgba(182,242,100,0.12)] sm:px-5")}
            type="button"
            onClick={handleSummarize}
            disabled={loading || imageProcessing || !inputText.trim()}
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Scissors size={16} />}
            {loading ? loadingStep || "Summarizing" : "Summarize"}
          </button>
        </div>
      </MotionSection>

      <MotionSection className={cn(ui.panel, "min-w-0 p-3", hasSummary && "border-[#b6f264]/25 bg-[#10140f]/88")} initial="hidden" animate="show" variants={fadeUp}>
        <div className="mb-2.5 flex items-center justify-between gap-3 border-b border-white/10 pb-2.5">
          <div>
            <p className={ui.label}>Output</p>
            <h3 className="mt-0.5 font-display text-lg font-semibold tracking-[-0.02em] text-white">Summary result</h3>
          </div>
          <div className="flex items-center gap-2">
            <button className={cn(ui.ghost, "min-h-9 px-2")} type="button" onClick={handleCopy} disabled={!summary}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>
            <button className={cn(ui.ghost, "min-h-9 px-2")} type="button" onClick={handleDownload} disabled={!summary}>
              <Download size={16} />
              <span className="hidden sm:inline">MD</span>
            </button>
          </div>
        </div>

        <div className="min-h-[20rem] max-h-[36rem] overflow-auto rounded-lg border border-white/10 bg-[#07080a] p-3">
          <AnimatePresence mode="wait">
            {loading && !summary && (
              <MotionDiv
                animate={{ opacity: 1 }}
                className="grid min-h-72 place-items-center content-center gap-3 text-center text-sm text-white/40"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="loading"
              >
                <Loader2 className="animate-spin text-[#b6f264]" size={28} />
                <p>{loadingStep || "Memadatkan teks..."}</p>
                <div className="flex gap-1.5">
                  {["Reading text", "Extracting points", "Formatting summary"].map((step) => (
                    <span
                      className={cn("h-1.5 w-8 rounded-full", loadingStep === step ? "bg-[#b6f264]" : "bg-white/10")}
                      key={step}
                    />
                  ))}
                </div>
              </MotionDiv>
            )}

            {!loading && !summary && (
              <MotionDiv
                animate={{ opacity: 1 }}
                className="grid min-h-72 place-items-center content-center gap-3 text-center text-sm text-white/40"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="empty"
              >
                <FileText className="text-[#b6f264]" size={28} />
                <div>
                  <p className="text-white/56">
                    {inputText.trim() ? "Input sudah siap. Klik Summarize untuk memproses." : "Paste teks di kiri, lalu klik Summarize."}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {exampleInputs.map((example) => (
                      <button
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/54 transition hover:border-[#b6f264]/35 hover:text-white"
                        key={example}
                        type="button"
                        onClick={() => {
                          setInputText(example);
                          onSourceChange("text");
                        }}
                      >
                        {example.split(" ").slice(1, 3).join(" ")}
                      </button>
                    ))}
                  </div>
                </div>
              </MotionDiv>
            )}

            {summary && (
              <MotionArticle
                animate={{ opacity: 1, y: 0 }}
                className={markdownClass}
                exit={{ opacity: 0, y: -8 }}
                initial={{ opacity: 0, y: 12 }}
                key="summary"
              >
                <ReactMarkdown>{summary}</ReactMarkdown>
                {latestTime && <time className="mt-4 block text-right text-xs text-white/34">{formatDateTime(latestTime)}</time>}
              </MotionArticle>
            )}
          </AnimatePresence>
        </div>
      </MotionSection>

    </div>
  );
};

export default Summarizer;

