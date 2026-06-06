import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn, ui } from "../../lib/ui";

const MotionDiv = motion.div;

const ToastStack = ({ toasts, onDismiss }) => (
  <div className="pointer-events-none fixed bottom-4 right-4 z-[80] grid w-[min(24rem,calc(100vw-2rem))] gap-2">
    <AnimatePresence>
      {toasts.map((toast) => (
        <MotionDiv
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="pointer-events-auto rounded-xl border border-white/10 bg-[#101212]/96 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          key={toast.id}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <strong className="block text-sm text-white">{toast.title}</strong>
              {toast.description && <p className="mt-1 text-xs leading-5 text-white/48">{toast.description}</p>}
            </div>
            <button className={cn(ui.ghost, "min-h-7 px-1.5")} type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss toast">
              <X size={14} />
            </button>
          </div>
          {toast.action && (
            <button className={cn(ui.secondary, "mt-2 min-h-8 px-3 text-xs")} type="button" onClick={toast.action.onClick}>
              {toast.action.label}
            </button>
          )}
        </MotionDiv>
      ))}
    </AnimatePresence>
  </div>
);

export default ToastStack;
