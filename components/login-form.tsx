"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      setMessage("Check your inbox · ตรวจสอบกล่องข้อความของคุณ");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <label htmlFor="email" className="block text-sm font-medium">
        Email · อีเมล
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        className="h-12 w-full rounded-2xl border border-[#ead9d5] bg-white/80 px-4 text-sm outline-none transition placeholder:text-[#c5a8ad] focus:border-[#e86673] focus:ring-4 focus:ring-[#e86673]/10 dark:border-white/10 dark:bg-white/5"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#e86673] text-sm font-semibold text-white shadow-lg shadow-[#e86673]/20 transition hover:bg-[#d95866] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send magic link · ส่งลิงก์เข้าสู่ระบบ"}
      </button>
      {message && (
        <p role="status" className="rounded-2xl bg-[#e86673]/10 p-3 text-center text-sm text-[#a84959]">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-2xl bg-red-50 p-3 text-center text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}
