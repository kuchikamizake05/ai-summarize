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
import { brand, brandAssets } from "../constants/brand";
import { cn, fadeUp, stagger, ui } from "../lib/ui";

const MotionArticle = motion.article;
const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;

const summarySteps = [
  { label: "Input", value: "1.284 kata dari catatan pelatihan" },
  { label: "Model", value: "Llama 3.3 70B, bahasa otomatis" },
  { label: "Output", value: "5 poin inti + tindak lanjut" },
];

const commandRows = [
  { icon: FileText, title: "Paste long notes", meta: "artikel, rapat, materi kuliah" },
  { icon: Image, title: "Extract text from image", meta: "OCR client-side" },
  { icon: Sparkles, title: "Summarize in same language", meta: "server-side Groq endpoint" },
];

const featureCards = [
  {
    icon: ScanText,
    title: "Bahan masuk cepat",
    copy: "Screenshot, catatan, dan potongan materi bisa langsung dibawa ke meja kerja yang sama.",
    span: "lg:col-span-2",
  },
  {
    icon: Zap,
    title: "Jawaban tidak bertele-tele",
    copy: "Hasilnya dibuat ringkas, enak dipindahkan ke tugas berikutnya.",
    span: "",
  },
  {
    icon: LockKeyhole,
    title: "Tenang dipakai",
    copy: "Hal penting tetap di sisi yang semestinya, bukan tersebar ke browser.",
    span: "",
  },
  {
    icon: Layers3,
    title: "Lanjut dari terakhir",
    copy: "Ringkasan sebelumnya tetap dekat saat kamu butuh membuka ulang konteks.",
    span: "lg:col-span-2",
  },
];

const LandingPage = () => {
  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className={cn(ui.canvas, "min-h-screen overflow-hidden pt-[5.75rem] lg:pt-[6.25rem]")}>
      <div className="fixed inset-x-0 top-0 z-50">
        <div className="pointer-events-none h-1 bg-[linear-gradient(90deg,#ff6161,#ffc533,#59d499,#57c1ff)] opacity-80" />
        <nav className="border-b border-white/10 bg-[#07090a]/82 backdrop-blur-2xl">
          <div className="mx-auto flex h-[5.25rem] max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:h-[5.75rem] lg:px-8">
            <Link className="flex min-w-0 items-center gap-3 sm:gap-4" to="/">
              <img
                src={brandAssets.logoIcon}
                alt={`${brand.product} logo`}
                className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12"
              />
              <div className="min-w-0">
                <p className={ui.label}>{brand.lab}</p>
                <p className="mt-1 truncate font-display text-xl font-semibold leading-none text-white sm:text-2xl">
                  {brand.product}
                </p>
              </div>
            </Link>

            <div className="flex shrink-0 items-center gap-2">
              <button className={cn(ui.secondary, "hidden min-h-10 px-4 lg:inline-flex")} type="button" onClick={scrollToDemo}>
                Lihat cara kerja
              </button>
              <Link className={cn(ui.primary, "min-h-10 px-4")} to="/app">
                Mulai
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </nav>
      </div>

      <section className="relative mx-auto grid max-w-7xl px-5 pb-8 pt-5 sm:px-6 sm:pb-10 sm:pt-6 lg:px-8 lg:pb-6 lg:pt-7 xl:pb-8 xl:pt-8">
        <div className="pointer-events-none absolute left-[6%] top-24 h-56 w-56 animate-float rounded-full bg-[#59d499]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-20 right-[8%] h-72 w-72 animate-float-delayed rounded-full bg-[#57c1ff]/10 blur-3xl" />

        <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,0.66fr)_minmax(24rem,0.84fr)] lg:gap-6 xl:gap-7">
          <MotionDiv className="max-w-[35rem]" initial="hidden" animate="show" variants={stagger}>
            <MotionH1
              variants={fadeUp}
              className="max-w-3xl text-balance font-display text-[clamp(2.35rem,11.5vw,5.4rem)] font-semibold leading-[1.02] text-white sm:leading-[0.95] lg:text-[clamp(3.1rem,4.45vw,4.05rem)] lg:tracking-[-0.035em]"
            >
              Ringkas bahan mentah jadi keputusan.
            </MotionH1>
            <MotionP variants={fadeUp} className="mt-4 max-w-xl text-base leading-7 text-white/62 sm:mt-5 sm:text-lg lg:mt-3 lg:max-w-md lg:text-[0.95rem] lg:leading-6">
              Paste catatan panjang, upload screenshot, pilih model, lalu dapatkan ringkasan yang siap dipakai tanpa login.
            </MotionP>
            <MotionDiv variants={fadeUp} className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row lg:mt-4">
              <Link className={cn(ui.primary, "min-h-12 px-5 lg:min-h-11")} to="/app">
                Mulai Ringkas
                <ArrowRight size={17} />
              </Link>
              <button className={cn(ui.secondary, "min-h-12 px-5 lg:min-h-11")} type="button" onClick={scrollToDemo}>
                Lihat cara kerja
              </button>
            </MotionDiv>
            <MotionDiv variants={fadeUp} className="mt-5 grid gap-2.5 text-sm text-white/52 sm:mt-6 sm:grid-cols-3 lg:mt-4 lg:text-xs">
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
            className={cn(
              ui.panelElevated,
              "relative w-full max-w-[45rem] justify-self-center overflow-hidden p-2.5 sm:p-3 lg:justify-self-end lg:p-2",
            )}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(182,242,100,0.12),transparent)]" />
            <div className="relative rounded-lg border border-white/10 bg-[#07080a] p-2.5 sm:p-3 lg:p-2.5">
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-3 lg:mb-2.5 lg:pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff6161]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffc533]" />
                  <span className="h-3 w-3 rounded-full bg-[#59d499]" />
                </div>
                <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[0.68rem] text-white/48 sm:text-xs">
                  Ctrl K summarize
                </span>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#101111] p-2.5 sm:p-3 lg:p-2">
                <div className="flex items-center gap-2 rounded-md border border-[#b6f264]/35 bg-[#b6f264]/10 px-3 py-2 text-xs text-white sm:gap-3 sm:text-sm">
                  <Sparkles size={16} className="text-[#b6f264]" />
                  <span className="min-w-0 truncate">summarize training notes into action bullets</span>
                </div>
                <div className="mt-2 space-y-0.5">
                  {commandRows.map((row) => {
                    const Icon = row.icon;
                    return (
                      <div
                        className="flex items-center gap-3 rounded-md px-2.5 py-1.5 text-sm text-white/72 sm:px-3 lg:text-xs"
                        key={row.title}
                      >
                        <Icon size={16} className="text-white/38" />
                        <span className="flex-1">{row.title}</span>
                        <span className="hidden text-xs text-white/32 sm:block">{row.meta}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-2.5 grid gap-2.5 sm:gap-3 lg:grid-cols-3 lg:gap-2">
                {summarySteps.map((step) => (
                  <div
                    className="rounded-lg border border-white/10 bg-white/[0.035] p-3 lg:p-2"
                    key={step.label}
                  >
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#b6f264]">
                      {step.label}
                    </p>
                    <p className="mt-1.5 text-sm leading-5 text-white/70 lg:text-xs lg:leading-4">{step.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-2.5 rounded-lg border border-[#59d499]/25 bg-[#59d499]/10 p-3 sm:p-4 lg:p-2.5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#59d499]">Output</p>
                <ul className="mt-2 space-y-1.5 text-sm leading-5 text-white/78 lg:text-xs lg:leading-4">
                  <li>- Tujuan pelatihan dipadatkan jadi 3 prioritas.</li>
                  <li>- Materi panjang berubah jadi ringkasan siap kirim.</li>
                  <li>- Tindak lanjut tersimpan di history lokal.</li>
                </ul>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      <section id="demo" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className={ui.label}>Built for momentum</p>
          <h2 className="mt-3 max-w-3xl text-balance font-display text-[clamp(2rem,4.5vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-white">
            Dari bahan mentah ke keputusan kecil berikutnya.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/54">
            Bukan tempat menumpuk teks lagi. Cukup masukkan bahan, ambil intinya, lalu lanjut kerja tanpa kehilangan arah.
          </p>
        </div>

        <div id="features" className="grid auto-rows-[13rem] gap-4 lg:grid-cols-3">
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

