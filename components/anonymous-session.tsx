"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export function AnonymousSession({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    async function ensureSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        const { error } = await supabase.auth.signInAnonymously();
        if (error) {
          if (active) {
            setError(error.message);
          }
          return;
        }
      }

      if (active) {
        setReady(true);
      }
    }

    void ensureSession();

    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fffaf7] text-sm text-[#a17a82] dark:bg-[#1b1118]">
        {error ? (
          <p className="max-w-sm px-6 text-center text-red-700 dark:text-red-300">
            We couldn&apos;t start your session. Enable Anonymous Sign-Ins in Supabase.
            <br />
            <span className="font-thai">เปิด Anonymous Sign-Ins ใน Supabase</span>
          </p>
        ) : (
          <p>Preparing your space · กำลังเตรียมพื้นที่ของคุณ...</p>
        )}
      </main>
    );
  }

  return children;
}
