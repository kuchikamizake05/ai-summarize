import React from "react";
import ReactMarkdown from "react-markdown";

const History = ({ history, onSelect, onDelete, onClearAll }) => (
  <div className="h-full flex flex-col">
    <div className="px-3 pt-3 pb-2 border-b border-[var(--theme-divider-color)]">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-[var(--theme-text-secondary)] tracking-wide text-base sm:text-xs">
          History
        </div>
        <div className="flex items-center gap-2">
          {history && history.length > 0 && (
            <>
              <span className="text-[12px] sm:text-[10px] text-[var(--theme-text-secondary)] px-2 py-0.5 bg-[var(--theme-bg-tertiary)] rounded-full border border-[var(--theme-border-color)]">
                {history.length} item
              </span>
              {/* Tombol Clear All - dibuat seperti item */}
              <button
                onClick={onClearAll}
                className="text-[12px] sm:text-[10px] px-2 py-0.5 text-red-500 hover:text-white bg-[var(--theme-bg-tertiary)] hover:bg-red-500 rounded-full border border-[var(--theme-border-color)] hover:border-red-500 transition-colors"
                title="Hapus semua riwayat"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>
    </div>

    <div className="flex-1 overflow-y-auto px-3 py-2">
      {!history || history.length === 0 ? (
        <p className="text-base sm:text-xs text-[var(--theme-text-placeholder)]">
          There is no summary history yet.
        </p>
      ) : (
        <ul className="space-y-1">
          {[...history]
            .reverse()
            .map((item, idx) => {
              const originalIndex = history.length - 1 - idx;
              return (
                <li
                  key={idx}
                  className="group relative cursor-pointer px-2 py-2 rounded hover:bg-[var(--theme-bg-tertiary)] transition"
                >
                  {/* Area yang bisa diklik untuk select */}
                  <div
                    className="pr-6"
                    title={typeof item === "string" ? item : item.summary || ""}
                    onClick={() => onSelect(item)}
                  >
                    <span className="block truncate text-[var(--theme-text-secondary)] text-base sm:text-xs">
                      {typeof item === "string"
                        ? item
                        : (item.summary || "").replace(/\n/g, " ")}
                    </span>
                    {item.time && (
                      <span className="block text-[10px] sm:text-[8px] text-[var(--theme-text-placeholder)] mt-1">
                        {new Date(item.time).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>

                  {/* Tombol Delete - muncul saat hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(originalIndex);
                    }}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-white hover:bg-red-500 rounded transition-all"
                    title="Hapus riwayat ini"
                  >
                    <svg
                      className="w-3 h-3 sm:w-2.5 sm:h-2.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  </div>
);

export default History;
