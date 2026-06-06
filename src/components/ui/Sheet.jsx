import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn, ui } from "../../lib/ui";

const MotionAside = motion.aside;
const MotionDiv = motion.div;

const Sheet = ({ open, title, subtitle, children, onClose }) => (
  <AnimatePresence>
    {open && (
      <MotionDiv
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[60] bg-black/62 backdrop-blur-sm lg:hidden"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
      >
        <button className="absolute inset-0 cursor-default" type="button" onClick={onClose} aria-label="Close sheet" />
        <MotionAside
          animate={{ x: 0 }}
          className="relative z-10 flex h-full w-[min(25rem,90vw)] flex-col border-r border-white/10 bg-[#0b0d0d] p-3"
          exit={{ x: "-100%" }}
          initial={{ x: "-100%" }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 p-3">
            <div>
              <p className={ui.label}>{title}</p>
              {subtitle && <strong className="mt-1 block text-sm text-white">{subtitle}</strong>}
            </div>
            <button className={cn(ui.icon, "h-9 w-9")} type="button" onClick={onClose} aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <div className="min-h-0 flex-1 pt-3">{children}</div>
        </MotionAside>
      </MotionDiv>
    )}
  </AnimatePresence>
);

export default Sheet;
