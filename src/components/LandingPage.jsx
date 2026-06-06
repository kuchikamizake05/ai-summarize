import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Image,
  Layers3,
  LockKeyhole,
  ScanText,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn, fadeUp, stagger, ui } from "../lib/ui";

const MotionArticle = motion.article;
const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

const summarySteps = [
  { label: "Input", value: "1.284 kata dari catatan pelatihan" },
  { label: "Model", value: "Claude 3.5 Haiku, bahasa otomatis" },
  { label: "Output", value: "5 poin inti + tindak lanjut" },
];

const commandRows = [
  { icon: FileText, title: "Paste long notes", meta: "artikel, rapat, materi kuliah" },
  { icon: Image, title: "Extract text from image", meta: "OCR client-side" },
  { icon: Sparkles, title: "Summarize in same language", meta: "server-safe OpenRouter endpoint" },
];

const featureCards = [
  {
    icon: ScanText,
    title: "OCR flow",
    copy: "Gambar jadi teks, lalu langsung masuk composer.",
    span: "lg:col-span-2",
  },
  {
    icon: Zap,
    title: "Fast models",
    copy: "Pilih model sesuai tempo kerja.",
    span: "",
  },
  {
    icon: LockKeyhole,
    title: "Server-safe API",
    copy: "Key OpenRouter tidak masuk client bundle.",
    span: "",
  },
  {
    icon: Layers3,
    title: "Local archive",
    copy: "History ringan, privat, dan cepat di browser.",
    span: "lg:col-span-2",
  },
];

const LandingPage = () => {
  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className={cn(ui.canvas, "min-h-screen overflow-hidden")}>
      <section className="relative mx-auto grid max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#ff6161,#ffc533,#59d499,#57c1ff)] opacity-80" />
        <div className="pointer-events-none absolute left-[6%] top-24 h-56 w-56 animate-float rounded-full bg-[#59d499]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 right-[8%] h-72 w-72 animate-float-delayed rounded-full bg-[#57c1ff]/10 blur-3xl" />

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(26rem,0.98fr)]">
          <MotionDiv className="max-w-[42rem]" initial="hidden" animate="show" variants={stagger}>
            <MotionP variants={fadeUp} className={ui.label}>
              AI Summarizer command center
            </MotionP>
            <MotionH1
              variants={fadeUp}
              className="mt-5 max-w-3xl text-balance font-display text-[clamp(2.75rem,6.4vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-white"
            >
              Ringkas bahan mentah jadi keputusan.
            </MotionH1>
            <MotionP variants={fadeUp} className="mt-5 max-w-xl text-base leading-7 text-white/62 sm:text-lg">
              Paste catatan panjang, upload screenshot, pilih model, lalu dapatkan ringkasan yang siap dipakai tanpa login.
            </MotionP>
            <MotionDiv variants={fadeUp} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link className={cn(ui.primary, "min-h-12 px-5")} to="/app">
                Mulai Ringkas
                <ArrowRight size={17} />
              </Link>
              <button className={cn(ui.secondary, "min-h-12 px-5")} type="button" onClick={scrollToDemo}>
                Lihat cara kerja
              </button>
            </MotionDiv>
            <MotionDiv variants={fadeUp} className="mt-6 grid gap-2 text-sm text-white/48 sm:grid-cols-3">
              {["Tanpa login", "History lokal", "API key server-side"].map((item) => (
                <div className="flex items-center gap-2" key={item}>
                  <CheckCircle2 className="text-[#59d499]" size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </MotionDiv>
          </MotionDiv>

          <MotionDiv
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(ui.panelElevated, "relative w-full max-w-[58rem] justify-self-center overflow-hidden p-3 lg:justify-self-end")}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(182,242,100,0.12),transparent)]" />
            <div className="relative rounded-lg border border-white/10 bg-[#07080a] p-3">
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff6161]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffc533]" />
                  <span className="h-3 w-3 rounded-full bg-[#59d499]" />
                </div>
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-white/48">
                  Ctrl K summarize
                </span>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#101111] p-3">
                <div className="flex items-center gap-3 rounded-md border border-[#b6f264]/35 bg-[#b6f264]/10 px-3 py-2 text-sm text-white">
                  <Sparkles size={16} className="text-[#b6f264]" />
                  summarize training notes into action bullets
                </div>
                <div className="mt-3 space-y-1">
                  {commandRows.map((row, index) => {
                    const Icon = row.icon;
                    return (
                      <MotionDiv
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/72"
                        initial={{ opacity: 0, x: -12 }}
                        key={row.title}
                        transition={{ delay: 0.35 + index * 0.12 }}
                      >
                        <Icon size={16} className="text-white/38" />
                        <span className="flex-1">{row.title}</span>
                        <span className="hidden text-xs text-white/32 sm:block">{row.meta}</span>
                      </MotionDiv>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 grid gap-3 lg:grid-cols-3">
                {summarySteps.map((step, index) => (
                  <MotionDiv
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-white/10 bg-white/[0.035] p-3"
                    initial={{ opacity: 0, y: 14 }}
                    key={step.label}
                    transition={{ delay: 0.72 + index * 0.12 }}
                  >
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#b6f264]">
                      {step.label}
                    </p>
                    <p className="mt-2 text-sm text-white/70">{step.value}</p>
                  </MotionDiv>
                ))}
              </div>

              <MotionDiv
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-lg border border-[#59d499]/25 bg-[#59d499]/10 p-4"
                initial={{ opacity: 0, y: 16 }}
                transition={{ delay: 1.05 }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#59d499]">Output</p>
                <ul className="mt-3 space-y-2 text-sm text-white/78">
                  <li>- Tujuan pelatihan dipadatkan jadi 3 prioritas.</li>
                  <li>- Materi panjang berubah jadi ringkasan siap kirim.</li>
                  <li>- Tindak lanjut tersimpan di history lokal.</li>
                </ul>
              </MotionDiv>
            </div>
          </MotionDiv>
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className={ui.label}>Product proof</p>
            <h2 className="mt-3 max-w-3xl text-balance font-display text-[clamp(2rem,4.5vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
              Animasi yang menjelaskan workflow, bukan dekorasi.
            </h2>
          </div>
          <Link className={cn(ui.secondary, "self-start lg:self-end")} to="/app">
            Buka app
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid auto-rows-[13rem] gap-4 lg:grid-cols-3">
          {featureCards.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <MotionArticle
                className={cn(ui.panel, "group relative overflow-hidden p-5", feature.span)}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.45 }}
                viewport={{ once: true, margin: "-80px" }}
                key={feature.title}
              >
                <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                  <div className="absolute inset-x-4 top-0 h-px bg-[linear-gradient(90deg,transparent,#b6f264,transparent)]" />
                  <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#b6f264]/10 blur-2xl" />
                </div>
                <Icon className="text-[#b6f264]" size={30} />
                <h3 className="mt-7 font-display text-2xl font-semibold tracking-[-0.02em] text-white">{feature.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/56">{feature.copy}</p>
              </MotionArticle>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default LandingPage;

