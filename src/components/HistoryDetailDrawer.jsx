import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Download, RotateCcw, Trash2, X } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { cn, ui } from "../lib/ui";

const MotionAside = motion.aside;
const MotionDiv = motion.div;

const markdownClass =
  "prose prose-invert max-w-none text-sm text-white/72 prose-headings:text-white prose-p:text-white/72 prose-strong:text-white prose-a:text-[#b6f264] prose-code:rounded prose-code:border prose-code:border-white/10 prose-code:bg-white/[0.04] prose-code:px-1 prose-code:text-white prose-pre:border prose-pre:border-white/10 prose-pre:bg-[#07080a] prose-blockquote:border-[#b6f264] prose-blockquote:text-white/72";

const formatDateTime = (value) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const getSummary = (item) => (typeof item === "string" ? item : item?.summary || "");
const getPreview = (item) => (typeof item === "string" ? item : item?.inputPreview || item?.summary || "");

const HistoryDetailDrawer = ({ item, onClose, onDelete, onUseAsInput, onToast }) => {
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const summary = getSummary(item);
  const preview = getPreview(item);

  const handleCopy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    onToast({ title: "Copied", description: "History summary disalin." });
    window.setTimeout(() => setCopied(false), 1200);
  };

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `history-summary-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
    onToast({ title: "Downloaded", description: "History markdown dibuat." });
  };

  return (
    <AnimatePresence>
      {item && (
        <MotionDiv
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[65] bg-black/45 backdrop-blur-[2px]"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Tutup detail riwayat" />
          <MotionAside
            animate={{ x: 0 }}
            className="absolute right-0 top-0 flex h-full w-[min(34rem,92vw)] flex-col border-l border-white/10 bg-[#090b0b] shadow-[-24px_0_80px_rgba(0,0,0,0.38)]"
            exit={{ x: "100%" }}
            initial={{ x: "100%" }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="border-b border-white/10 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className={ui.label}>History detail</p>
                  <h2 className="mt-1 truncate font-display text-lg font-semibold tracking-[-0.02em] text-white">
                    {preview || "Ringkasan tersimpan"}
                  </h2>
                  <p className="mt-1 text-xs text-white/38">
                    {item?.model ? item.model.split("/").at(-1) : "summary"}
                    {item?.mode ? ` / ${item.mode}` : ""}
                    {item?.source ? ` / ${item.source}` : ""}
                    {item?.wordCount ? ` / ${item.wordCount} words` : ""}
                    {item?.summaryLength ? ` / ${item.summaryLength} chars` : ""}
                    {item?.time ? ` / ${formatDateTime(item.time)}` : ""}
                  </p>
                </div>
                <button className={cn(ui.icon, "h-9 w-9")} type="button" onClick={onClose} aria-label="Tutup">
                  <X size={16} />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button className={cn(ui.primary, "min-h-9 px-3")} type="button" onClick={onUseAsInput}>
                  <RotateCcw size={15} />
                  Use input
                </button>
                <button className={cn(ui.secondary, "min-h-9 px-3")} type="button" onClick={handleCopy} disabled={!summary}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button className={cn(ui.secondary, "min-h-9 px-3")} type="button" onClick={handleDownload} disabled={!summary}>
                  <Download size={15} />
                  MD
                </button>
                <button className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-[#ff6161]/25 bg-[#ff6161]/10 px-3 text-sm font-medium text-[#ffd0d0] transition hover:bg-[#ff6161]/15 disabled:cursor-not-allowed disabled:opacity-50" type="button" onClick={() => setConfirmDelete(true)}>
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
              {confirmDelete && (
                <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-[#ff6161]/25 bg-[#ff6161]/10 p-2 text-xs text-[#ffd0d0]">
                  <span>Hapus history ini?</span>
                  <div className="flex gap-2">
                    <button className="rounded-md px-2 py-1 text-white/62 hover:bg-white/10 hover:text-white" type="button" onClick={() => setConfirmDelete(false)}>
                      Batal
                    </button>
                    <button className="rounded-md bg-[#ff6161] px-2 py-1 font-semibold text-white" type="button" onClick={onDelete}>
                      Hapus
                    </button>
                  </div>
                </div>
              )}
            </header>

            <div className="min-h-0 flex-1 overflow-auto p-3">
              <article className={cn(markdownClass, "rounded-lg border border-white/10 bg-[#07080a] p-4")}>
                <ReactMarkdown>{summary || "Tidak ada ringkasan."}</ReactMarkdown>
              </article>
            </div>
          </MotionAside>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
};

export default HistoryDetailDrawer;
