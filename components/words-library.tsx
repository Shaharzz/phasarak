"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import SpotlightCard from "@/components/SpotlightCard";
import { ThemeToggle } from "@/components/theme-toggle";

type Word = {
  id: number;
  th: string;
  romanization: string | null;
  en: string;
  category: string | null;
  position: number | null;
  example_th?: string | null;
  example_en?: string | null;
};

export function WordsLibrary() {
  const [words, setWords] = useState<Word[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadWords() {
      const { data, error: queryError } = await createClient()
        .from("words")
        .select("id, th, romanization, en, category, position, example_th, example_en")
        .order("position", { ascending: true });

      if (!active) return;
      if (queryError) {
        setError(queryError.message);
      } else {
        setWords((data ?? []) as Word[]);
      }
      setLoading(false);
    }

    void loadWords();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(words.map((word) => word.category ?? "Everyday"))).sort(),
    [words],
  );

  const filteredWords = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return words.filter((word) => {
      const matchesCategory =
        category === "all" || (word.category ?? "Everyday") === category;
      const searchable = [
        word.th,
        word.romanization ?? "",
        word.en,
        word.category ?? "",
      ]
        .join(" ")
        .toLocaleLowerCase();
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, query, words]);

  const groupedWords = useMemo(
    () =>
      filteredWords.reduce<Record<string, Word[]>>((groups, word) => {
        const group = word.category ?? "Everyday";
        (groups[group] ??= []).push(word);
        return groups;
      }, {}),
    [filteredWords],
  );

  return (
    <div className="mx-auto min-h-screen w-full max-w-6xl px-5 pb-10 pt-6 sm:px-8">
      <header className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-2xl bg-[#e86673] text-xl text-white shadow-lg shadow-[#e86673]/25">
            ♥
          </span>
          <span>
            <span className="block font-semibold tracking-[-0.04em]">Phasa Rak</span>
            <span className="block font-thai text-[11px] text-[#9f7881]">ภาษารัก</span>
          </span>
        </a>
        <ThemeToggle />
      </header>

      <div className="mt-12 flex flex-col justify-between gap-5 sm:mt-16 sm:flex-row sm:items-end">
        <div>
          <p className="font-thai text-sm text-[#ad737d]">คำศัพท์ทั้งหมด · your word garden</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl">
            All words
          </h1>
          <p className="mt-4 text-sm text-[#87656d] dark:text-[#d0afb5]">
            Browse every word by category · ค้นหาคำศัพท์ตามหมวดหมู่
          </p>
        </div>
        <a href="/" className="w-fit rounded-full border border-[#ead9d5] bg-white/70 px-4 py-2 text-xs font-medium text-[#8d6870] transition hover:border-[#e86673] dark:border-white/10 dark:bg-white/5">
          Today · วันนี้
        </a>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search words</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Thai, romanization, or English · ค้นหา"
            className="h-12 w-full rounded-2xl border border-[#ead9d5] bg-white/75 px-4 text-sm outline-none transition placeholder:text-[#c5a8ad] focus:border-[#e86673] focus:ring-4 focus:ring-[#e86673]/10 dark:border-white/10 dark:bg-white/5"
          />
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-12 rounded-2xl border border-[#ead9d5] bg-white/75 px-4 text-sm capitalize outline-none dark:border-white/10 dark:bg-white/5"
        >
          <option value="all">All categories · ทุกหมวด</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>

      <p className="mt-5 text-xs text-[#a17a82]">
        {loading ? "Loading words · กำลังโหลด..." : `${filteredWords.length} words · ${categories.length} categories`}
      </p>

      {error && <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}

      <div className="mt-8 space-y-10">
        {Object.entries(groupedWords).map(([group, groupWords]) => (
          <section key={group}>
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-lg font-semibold capitalize">{group}</h2>
              <span className="rounded-full bg-[#e86673]/10 px-2.5 py-1 text-[11px] text-[#b05260]">{groupWords.length}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {groupWords.map((word) => (
                <SpotlightCard key={word.id} theme="light" spotlightColor="#e86673" intensity={0.1} borderGlow={0.35} className="border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                  <p className="text-2xl font-semibold">{word.th}</p>
                  <p className="mt-1 font-thai text-sm text-[#ad737d]">{word.romanization ?? "Romanization coming soon"}</p>
                  <p className="mt-3 text-sm text-[#76535e] dark:text-[#e4c8cc]">{word.en}</p>
                  {word.example_en && <p className="mt-4 border-t border-[#eededb] pt-3 text-xs italic text-[#a17a82] dark:border-white/10">“{word.example_en}”</p>}
                </SpotlightCard>
              ))}
            </div>
          </section>
        ))}
      </div>

      {!loading && !filteredWords.length && (
        <div className="mt-12 rounded-3xl border border-dashed border-[#e4c9c9] p-10 text-center text-sm text-[#a17a82]">
          No words found · ไม่พบคำศัพท์
        </div>
      )}
    </div>
  );
}
