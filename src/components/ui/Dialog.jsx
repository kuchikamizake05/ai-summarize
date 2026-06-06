import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn, ui } from "../../lib/ui";

const MotionDiv = motion.div;

const Dialog = ({ open, title, description, children, onClose }) => (
  <AnimatePresence>
    {open && (
      <MotionDiv
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[70] grid place-items-center bg-black/62 p-4 backdrop-blur-sm"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
      >
        <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Close dialog" />
        <MotionDiv
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={cn(ui.panelElevated, "relative w-full max-w-md p-5")}
          exit={{ opacity: 0, scale: 0.98, y: 8 }}
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="dialog-title" className="text-lg font-semibold text-white">
                {title}
              </h2>
              {description && <p className={cn(ui.muted, "mt-2 text-sm")}>{description}</p>}
            </div>
            <button className={cn(ui.icon, "h-9 w-9")} type="button" onClick={onClose} aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <div className="mt-5">{children}</div>
        </MotionDiv>
      </MotionDiv>
    )}
  </AnimatePresence>
);

export default Dialog;
