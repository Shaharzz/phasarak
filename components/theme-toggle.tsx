"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("phasarak-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", enabled);
    setDark(enabled);
  }, []);

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("phasarak-theme", next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-[#ead9d5] bg-white/70 px-3.5 py-2 text-xs font-medium text-[#805d67] backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-[#e9cbd0]"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span aria-hidden="true">{dark ? "☀" : "☾"}</span>{" "}
      <span className="hidden sm:inline">{dark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
