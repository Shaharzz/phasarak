import { AnonymousSession } from "@/components/anonymous-session";
import { WordsLibrary } from "@/components/words-library";

export default function WordsPage() {
  return (
    <AnonymousSession>
      <main className="min-h-screen bg-[#fffaf7] text-[#321c26] dark:bg-[#1b1118] dark:text-[#fff5f0]">
        <WordsLibrary />
      </main>
    </AnonymousSession>
  );
}
