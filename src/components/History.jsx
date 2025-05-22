import React from "react";
import ReactMarkdown from "react-markdown";

const History = ({ history, onSelect }) => (
  <div className="h-full flex flex-col">
    <div className="px-3 pt-3 pb-2 border-b border-[var(--theme-divider-color)]">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-[var(--theme-text-secondary)] tracking-wide text-base sm:text-xs">
          Riwayat Ringkasan
        </div>
        {history && history.length > 0 && (
          <span className="text-[12px] sm:text-[10px] text-[var(--theme-text-secondary)] px-2 py-0.5 bg-[var(--theme-bg-tertiary)] rounded-full border border-[var(--theme-border-color)]">
            {history.length} item
          </span>
        )}
      </div>
    </div>

    {/* Container dengan overflow-y-auto untuk scrolling */}
    <div className="flex-1 overflow-y-auto px-3 py-2">
      {!history || history.length === 0 ? (
        <p className="text-base sm:text-xs text-[var(--theme-text-placeholder)]">
          Belum ada riwayat ringkasan.
        </p>
      ) : (
        <ul className="space-y-1">
          {[...history]
            .reverse()
            .map((item, idx) => (
              <li
                key={idx}
                className="truncate cursor-pointer px-2 py-1 rounded hover:bg-[var(--theme-bg-tertiary)] transition"
                title={typeof item === "string" ? item : item.summary || ""}
                onClick={() => onSelect(item)}
              >
                <span className="block truncate text-[var(--theme-text-secondary)] text-base sm:text-xs">
                  {typeof item === "string"
                    ? item
                    : (item.summary || "").replace(/\n/g, " ")}
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  </div>
);

export default History;
