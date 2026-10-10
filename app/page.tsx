import { AuroraBackground } from "@/components/aurora-background";
import { LearnerGate } from "@/components/learner-gate";
import { ThemeToggle } from "@/components/theme-toggle";
import { copy } from "@/lib/i18n";

export default function Home() {
  return (
    <LearnerGate>
      <main className="relative min-h-screen overflow-hidden bg-[#fffaf7] text-[#321c26] dark:bg-[#1b1118] dark:text-[#fff5f0]">
        <AuroraBackground />
        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-8 pt-6 sm:px-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#e86673] text-xl text-white shadow-lg shadow-[#e86673]/25">
              ♥
            </span>
            <div>
              <p className="font-semibold tracking-[-0.04em]">Phasa Rak</p>
              <p className="font-thai text-[11px] text-[#9f7881]">ภาษารัก</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <nav className="mt-10 flex gap-5 text-xs font-medium text-[#a17a82] sm:mt-16">
          <span className="border-b-2 border-[#e86673] pb-2 text-[#6e3c49] dark:text-[#ffd6d4]">{copy.today}</span>
          <span>{copy.together}</span>
          <span>{copy.words}</span>
        </nav>

        <section className="flex flex-1 flex-col justify-center py-14 sm:py-20">
          <p className="font-thai text-sm text-[#ad737d]">{copy.greetingThai}</p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.055em] sm:text-6xl">
            {copy.greeting}
            <span className="ml-2 inline-block text-[#e86673]">✦</span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#87656d] dark:text-[#d0afb5] sm:text-base">
            {copy.intro}
            <br />
            <span className="font-thai text-[#ad737d]">{copy.introThai}</span>
          </p>

          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["✦", "2 words", "คำใหม่วันนี้"],
              ["7", "day streak", "วันที่เรียนต่อเนื่อง"],
              ["♡", "together", "เรียนรู้ด้วยกัน"],
            ].map(([icon, title, subtitle]) => (
              <div key={title} className="rounded-2xl border border-white/80 bg-white/65 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <span className="text-lg text-[#e86673]">{icon}</span>
                <p className="mt-3 text-sm font-semibold">{title}</p>
                <p className="font-thai text-[11px] text-[#a17a82]">{subtitle}</p>
              </div>
            ))}
          </div>

          <button type="button" className="mt-8 flex w-fit items-center gap-3 rounded-full bg-[#e86673] px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#e86673]/25 transition hover:-translate-y-0.5 hover:bg-[#d95866]">
            <span>{copy.begin}</span>
            <span className="font-thai text-xs font-normal text-white/80">{copy.beginThai}</span>
            <span aria-hidden="true">→</span>
          </button>
        </section>

        <footer className="flex items-center justify-between border-t border-[#eededb]/80 pt-5 text-[11px] text-[#b08d93]">
          <span>Made with patience &amp; curiosity</span>
          <span className="font-thai">รัก · rak · love</span>
        </footer>
        </div>
      </main>
    </LearnerGate>
  );
}
