export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const ui = {
  canvas: "bg-[#07080a] text-[#f4f4f6]",
  panel:
    "rounded-xl border border-white/10 bg-[#0d0f0f]/88 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]",
  panelElevated:
    "rounded-xl border border-white/12 bg-[#101212]/94 shadow-[0_24px_80px_rgba(0,0,0,0.26)]",
  input:
    "rounded-lg border border-white/10 bg-[#101212] text-[#f4f4f6] outline-none transition placeholder:text-white/32 focus:border-[#b6f264]/60 focus:ring-2 focus:ring-[#b6f264]/15",
  primary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-black transition hover:-translate-y-px hover:bg-[#e8e8e8] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/78 transition hover:-translate-y-px hover:border-white/18 hover:bg-white/[0.07] hover:text-white disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50",
  ghost:
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-white/62 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50",
  icon:
    "inline-grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/70 transition hover:-translate-y-px hover:border-white/18 hover:bg-white/[0.07] hover:text-white disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50",
  label: "text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#b6f264]",
  muted: "text-white/54",
  hairline: "border-white/10",
  focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b6f264]/45",
};

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

export const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};
