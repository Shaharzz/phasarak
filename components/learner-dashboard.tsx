"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { ThemeToggle } from "@/components/theme-toggle";
import CountUp from "@/components/CountUp";
import SpotlightCard from "@/components/SpotlightCard";

type LearnerId = "shahar" | "athittaya";
type Word = {
  id: number;
  th: string;
  romanization: string | null;
  en: string;
  category: string | null;
};

const learnerDetails: Record<LearnerId, { name: string; thai: string; target: string }> = {
  shahar: { name: "Shahar", thai: "ชาฮาร์", target: "Thai · ภาษาไทย" },
  athittaya: { name: "Athittaya", thai: "อธิตยา", target: "English · ภาษาอังกฤษ" },
};

export function LearnerDashboard() {
  const [learner, setLearner] = useState<LearnerId>("shahar");
  const [words, setWords] = useState<Word[]>([]);
  const [learned, setLearned] = useState<Set<number>>(new Set());
  const [partnerLearned, setPartnerLearned] = useState<Set<number>>(new Set());
  const [view, setView] = useState<"today" | "together" | "words">("today");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("phasarak-learner");
    if (saved === "shahar" || saved === "athittaya") {
      setLearner(saved);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Your session expired. Refresh the page to continue.");
        setLoading(false);
        return;
      }

      const partnerLearner = learner === "shahar" ? "athittaya" : "shahar";
      const [{ data: wordRows, error: wordsError }, { data: progressRows, error: progressError }, { data: partnerRows, error: partnerError }] =
        await Promise.all([
          supabase.from("words").select("id, th, romanization, en, category").order("position").limit(150),
          supabase.from("progress").select("word_id").eq("user_id", user.id).eq("learner", learner),
          supabase.from("progress").select("word_id").eq("user_id", user.id).eq("learner", partnerLearner),
        ]);

      if (wordsError || progressError || partnerError) {
        setError(wordsError?.message ?? progressError?.message ?? partnerError?.message ?? "Unable to load learning data.");
      } else if (active) {
        setWords((wordRows ?? []) as Word[]);
        setLearned(new Set((progressRows ?? []).map((row) => row.word_id)));
        setPartnerLearned(new Set((partnerRows ?? []).map((row) => row.word_id)));
      }
      if (active) setLoading(false);
    }
    void load();
    return () => {
      active = false;
    };
  }, [learner]);

  const todayWords = useMemo(
    () => words.filter((word) => !learned.has(word.id)).slice(0, 2),
    [words, learned],
  );

  function switchLearner(next: LearnerId) {
    setLearner(next);
    window.localStorage.setItem("phasarak-learner", next);
  }

  async function markLearned(word: Word) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { error: insertError } = await supabase.from("progress").upsert({
      user_id: user.id,
      learner,
      word_id: word.id,
      learned_on: new Date().toISOString().slice(0, 10),
    });
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setLearned((current) => new Set(current).add(word.id));
  }

  const details = learnerDetails[learner];
  const learnedWords = words.filter((word) => learned.has(word.id));
  const categories = ["all", ...Array.from(new Set(words.map((word) => word.category).filter(Boolean) as string[]))];
  const filteredLearnedWords = category === "all"
    ? learnedWords
    : learnedWords.filter((word) => word.category === category);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-8 pt-6 sm:px-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-2xl bg-[#e86673] text-xl text-white shadow-lg shadow-[#e86673]/25">♥</span>
          <div>
            <p className="font-semibold tracking-[-0.04em]">Phasa Rak</p>
            <p className="font-thai text-[11px] text-[#9f7881]">ภาษารัก</p>
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs text-[#8d6870]">
          <span className="hidden sm:inline">Switch learner · เปลี่ยนผู้เรียน</span>
          <select value={learner} onChange={(event) => switchLearner(event.target.value as LearnerId)} className="rounded-full border border-[#ead9d5] bg-white/70 px-3 py-2 font-medium outline-none dark:border-white/10 dark:bg-white/5">
            <option value="shahar">Shahar · ชาฮาร์</option>
            <option value="athittaya">Athittaya · อธิตยา</option>
          </select>
          <ThemeToggle />
        </label>
      </header>

      <nav className="mt-10 flex gap-5 text-xs font-medium text-[#a17a82] sm:mt-16">
        {([
          ["today", "Today · วันนี้"],
          ["together", "Together · ด้วยกัน"],
          ["words", "Words · คำศัพท์"],
        ] as const).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setView(key)} className={view === key ? "border-b-2 border-[#e86673] pb-2 text-[#6e3c49] dark:text-[#ffd6d4]" : "pb-2"}>
            {label}
          </button>
        ))}
      </nav>

      <section className="flex-1 py-12 motion-safe:animate-[fade-in-up_.55s_ease-out] sm:py-16">
        <p className="font-thai text-sm text-[#ad737d]">{details.thai} · {details.target}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
          {view === "today" ? "A little more, today." : view === "together" ? "Learning together." : "Your word garden."}
        </h1>
        <div className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Learned · เรียนแล้ว" value={learned.size} />
          <Stat label="To go · เหลืออีก" value={Math.max(words.length - learned.size, 0)} />
          <Stat label="Together · ด้วยกัน" value={partnerLearned.size} />
        </div>
        {error && <p className="mt-5 rounded-2xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
        {loading ? <p className="mt-10 text-sm text-[#a17a82]">Loading words · กำลังโหลดคำศัพท์...</p> : (
          <>
            {view === "today" && (
              <>
                <p className="mt-5 max-w-md text-sm leading-7 text-[#87656d] dark:text-[#d0afb5]">Two new words for {details.name}. Mark them learned as you practice together.</p>
                <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
                  {todayWords.map((word) => <WordCard key={word.id} word={word} onLearn={() => void markLearned(word)} />)}
                  {!todayWords.length && <p className="text-sm text-[#a17a82]">You learned every available word · เรียนครบทุกคำแล้ว</p>}
                </div>
              </>
            )}
            {view === "words" && (
              <>
                <div className="mt-8 flex max-w-4xl gap-2 overflow-x-auto pb-2">
                  {categories.map((item) => (
                    <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-3 py-2 text-xs capitalize transition ${category === item ? "bg-[#e86673] text-white" : "bg-white/70 text-[#8d6870] dark:bg-white/10 dark:text-[#e9cbd0]"}`}>
                      {item === "all" ? "All · ทั้งหมด" : item}
                    </button>
                  ))}
                </div>
                <div className="grid max-w-3xl gap-3 sm:grid-cols-2">
                  {filteredLearnedWords.map((word) => <WordCard key={word.id} word={word} learned />)}
                  {!filteredLearnedWords.length && <p className="text-sm text-[#a17a82]">No words in this category · ยังไม่มีคำในหมวดนี้</p>}
                </div>
              </>
            )}
            {view === "together" && <TogetherView words={words} learner={learner} partnerLearned={partnerLearned} />}
          </>
        )}
      </section>
      <footer className="flex items-center justify-between border-t border-[#eededb]/80 pt-5 text-[11px] text-[#b08d93]">
        <span>{learned.size} words learned · เรียนแล้ว {learned.size} คำ</span>
        <span className="font-thai">รัก · rak · love</span>
      </footer>
    </div>
  );
}

function WordCard({ word, learned = false, onLearn }: { word: Word; learned?: boolean; onLearn?: () => void }) {
  return (
    <SpotlightCard
      theme="light"
      spotlightColor="#e86673"
      intensity={0.12}
      borderGlow={0.45}
      className="border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5"
    >
      <p className="text-xs uppercase tracking-[0.16em] text-[#b28b91]">{word.category ?? "Everyday"}</p>
      <p className="mt-5 text-3xl font-semibold">{word.th}</p>
      <p className="mt-1 font-thai text-sm text-[#ad737d]">{word.romanization ?? "Romanization coming soon"}</p>
      <p className="mt-4 text-base text-[#76535e] dark:text-[#e4c8cc]">{word.en}</p>
      {!learned && onLearn && <button type="button" onClick={onLearn} className="mt-6 rounded-full bg-[#e86673] px-4 py-2 text-xs font-semibold text-white">Mark learned · เรียนแล้ว</button>}
    </SpotlightCard>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/60 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-white/5">
      <p className="text-2xl font-semibold text-[#e86673]"><CountUp to={value} duration={0.7} /></p>
      <p className="mt-1 text-[11px] text-[#a17a82]">{label}</p>
    </div>
  );
}

function TogetherView({ words, learner, partnerLearned }: { words: Word[]; learner: LearnerId; partnerLearned: Set<number> }) {
  const other = learner === "shahar" ? "Athittaya" : "Shahar";
  const partnerWords = words.filter((word) => partnerLearned.has(word.id));
  return (
    <div className="mt-8 max-w-3xl rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
      <p className="font-semibold">{other}&apos;s words · คำศัพท์ของ{other}</p>
      <p className="mt-3 text-sm leading-6 text-[#87656d] dark:text-[#d0afb5]">{partnerLearned.size} words learned · เรียนแล้ว {partnerLearned.size} คำ</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {partnerWords.map((word) => <span key={word.id} className="rounded-full bg-[#e86673]/10 px-3 py-2 text-sm">{word.th} · {word.en}</span>)}
      </div>
      <p className="mt-6 text-xs text-[#a17a82]">{words.length} shared starter words available · มีคำศัพท์เริ่มต้น {words.length} คำ</p>
    </div>
  );
}
