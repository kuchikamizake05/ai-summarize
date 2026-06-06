import { useMemo, useState } from "react";
import { Clock, Search, Trash2 } from "lucide-react";
import { cn, ui } from "../lib/ui";

const formatShortDate = (value) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

const getSummaryText = (item) => (typeof item === "string" ? item : item.summary || "");
const getPreviewText = (item) => (typeof item === "string" ? item : item.inputPreview || item.summary || "");

const isToday = (value) => {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  return date.toDateString() === now.toDateString();
};

const isThisWeek = (value) => {
  if (!value) return false;
  const date = new Date(value);
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  return date >= sevenDaysAgo;
};

const History = ({ history, selectedHistory, onSelect, onDelete, onClearAll }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const visibleHistory = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...(history || [])]
      .map((item, index) => ({ item, originalIndex: index }))
      .filter(({ item }) => {
        if (filter === "today" && !isToday(item.time)) return false;
        if (filter === "week" && !isThisWeek(item.time)) return false;
        if (!normalizedQuery) return true;
        return `${getPreviewText(item)} ${getSummaryText(item)} ${item.model || ""}`.toLowerCase().includes(normalizedQuery);
      })
      .reverse();
  }, [filter, history, query]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]">
      <div className="border-b border-white/10 p-2.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={ui.label}>Archive</p>
            <strong className="mt-0.5 block text-sm text-white">Riwayat ringkasan</strong>
          </div>
          {history?.length > 0 && (
            <button className={cn(ui.ghost, "min-h-8 px-2 text-xs")} type="button" onClick={onClearAll}>
              Clear
            </button>
          )}
        </div>

        {history?.length > 0 && (
          <div className="mt-2 space-y-2">
            <label className={cn(ui.input, "flex min-h-8 items-center gap-2 px-2 text-xs")}>
              <Search size={13} className="text-white/34" />
              <input
                className="min-w-0 flex-1 border-0 bg-transparent text-white outline-none placeholder:text-white/28"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari history..."
              />
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-white/10 bg-white/[0.025] p-1">
              {[
                ["all", "All"],
                ["today", "Today"],
                ["week", "Week"],
              ].map(([value, label]) => (
                <button
                  className={cn(
                    "min-h-7 rounded-md text-[0.68rem] font-medium transition",
                    filter === value ? "bg-white text-black" : "text-white/42 hover:bg-white/[0.05] hover:text-white",
                  )}
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="min-h-0 overflow-auto p-1.5">
        {!history || history.length === 0 ? (
        <div className="grid place-items-center gap-2 px-3 py-8 text-center text-white/38">
          <Clock className="text-[#b6f264]" size={20} />
          <p>Belum ada riwayat.</p>
        </div>
      ) : visibleHistory.length === 0 ? (
        <div className="grid place-items-center gap-2 px-3 py-8 text-center text-sm text-white/38">
          <Search className="text-[#b6f264]" size={18} />
          <p>Tidak ada history cocok.</p>
        </div>
      ) : (
        visibleHistory.map(({ item, originalIndex }) => {
          const text = getPreviewText(item).replace(/\n/g, " ");
          const isSelected =
            selectedHistory &&
            (selectedHistory.id ? selectedHistory.id === item.id : getSummaryText(selectedHistory) === getSummaryText(item));

          return (
            <article
              className={cn(
                "relative grid grid-cols-[minmax(0,1fr)_1.75rem] items-center gap-1 rounded-lg transition",
                isSelected ? "bg-[#b6f264]/12 ring-1 ring-[#b6f264]/24" : "hover:bg-white/[0.045]",
              )}
              key={item.id || `${originalIndex}-${text.slice(0, 16)}`}
            >
              <button
                type="button"
                className="min-w-0 border-0 bg-transparent px-2 py-2.5 text-left text-inherit"
                title={text}
                onClick={() => onSelect(item, originalIndex)}
              >
                <span className={cn("block truncate text-[0.82rem]", isSelected ? "text-white" : "text-white/72")}>
                  {text || "Untitled summary"}
                </span>
                <small className="mt-1 flex items-center gap-1.5 text-[0.68rem] text-white/34">
                  <span>{item.model ? item.model.split("/").at(-1) : "summary"}</span>
                  <span>/</span>
                  {item.source && (
                    <>
                      <span>{item.source}</span>
                      <span>/</span>
                    </>
                  )}
                  {item.wordCount > 0 && (
                    <>
                      <span>{item.wordCount}w</span>
                      <span>/</span>
                    </>
                  )}
                  <span>{item.time ? formatShortDate(item.time) : "lama"}</span>
                </small>
              </button>
              <button
                type="button"
                className="grid h-6 w-6 place-items-center rounded-full border-0 bg-transparent text-white/34 transition hover:bg-[#ff6161]/10 hover:text-[#ff6161]"
                onClick={() => onDelete(originalIndex)}
                aria-label="Hapus riwayat"
              >
                <Trash2 size={14} />
              </button>
            </article>
          );
        })
        )}
      </div>
    </div>
  );
};

export default History;
