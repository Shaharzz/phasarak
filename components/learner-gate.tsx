"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

type Learner = {
  name: "Shahar" | "Athittaya";
  thaiName: string;
  learning: "th" | "en";
  learns: string;
};

const learners: Learner[] = [
  {
    name: "Shahar",
    thaiName: "ชาฮาร์",
    learning: "th",
    learns: "Learning Thai · เรียนภาษาไทย",
  },
  {
    name: "Athittaya",
    thaiName: "อธิตยา",
    learning: "en",
    learns: "Learning English · เรียนภาษาอังกฤษ",
  },
];

export function LearnerGate({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [status, setStatus] = useState<"loading" | "choosing" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function loadLearner() {
      let {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const result = await supabase.auth.signInAnonymously();
        if (result.error) {
          throw result.error;
        }
        session = result.data.session;
      }

      if (!session?.user) {
        throw new Error("No Supabase session was created.");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (active) {
        setStatus(profile?.display_name ? "ready" : "choosing");
      }
    }

    void loadLearner().catch((loadError: Error) => {
      if (active) {
        setError(loadError.message);
        setStatus("error");
      }
    });

    return () => {
      active = false;
    };
  }, []);

  async function chooseLearner(learner: Learner) {
    setStatus("loading");
    setError("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Your session expired. Refresh the page and try again.");
      setStatus("error");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        display_name: learner.name,
        learning: learner.learning,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      setError(profileError.message);
      setStatus("error");
      return;
    }

    setStatus("ready");
  }

  if (status === "ready") {
    return children;
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#fffaf7] px-5 text-[#321c26] dark:bg-[#1b1118] dark:text-[#fff5f0]">
      <div className="absolute -left-24 -top-24 size-72 rounded-full bg-[#ffd7c1]/50 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-[#f6c7d5]/50 blur-3xl" />
      <section className="relative w-full max-w-lg rounded-[2rem] border border-white/80 bg-white/75 p-7 text-center shadow-xl shadow-[#d99199]/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-10">
        {status === "loading" && (
          <p className="text-sm text-[#a17a82]">
            Preparing your space · กำลังเตรียมพื้นที่ของคุณ...
          </p>
        )}
        {status === "choosing" && (
          <>
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e86673] text-2xl text-white shadow-lg shadow-[#e86673]/25">
              ♥
            </div>
            <p className="mt-7 font-thai text-sm text-[#ad737d]">
              ใครกำลังเรียน?
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
              Who&apos;s learning?
            </h1>
            <p className="mt-3 text-sm text-[#87656d] dark:text-[#d0afb5]">
              Choose your name · เลือกชื่อของคุณ
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {learners.map((learner) => (
                <button
                  type="button"
                  key={learner.name}
                  onClick={() => void chooseLearner(learner)}
                  className="rounded-2xl border border-[#ead9d5] bg-white/80 p-5 text-left transition hover:-translate-y-0.5 hover:border-[#e86673] hover:shadow-lg hover:shadow-[#e86673]/10 dark:border-white/10 dark:bg-white/5"
                >
                  <span className="text-lg font-semibold">{learner.name}</span>
                  <span className="mt-1 block font-thai text-sm text-[#ad737d]">
                    {learner.thaiName}
                  </span>
                  <span className="mt-4 block text-xs text-[#a17a82]">
                    {learner.learns}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
        {status === "error" && (
          <p className="text-sm leading-6 text-red-700 dark:text-red-300">
            We couldn&apos;t prepare your learner profile.
            <br />
            <span className="text-xs">{error}</span>
          </p>
        )}
      </section>
    </main>
  );
}
