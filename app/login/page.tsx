import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#fffaf7] px-5 text-[#321c26] dark:bg-[#1b1118] dark:text-[#fff5f0]">
      <div className="absolute -left-24 -top-24 size-72 rounded-full bg-[#ffd7c1]/50 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-[#f6c7d5]/50 blur-3xl" />
      <div className="relative w-full max-w-md rounded-[2rem] border border-white/80 bg-white/75 p-7 shadow-xl shadow-[#d99199]/10 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-10">
        <div className="mb-9 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-[#e86673] text-xl text-white shadow-lg shadow-[#e86673]/25">
            ♥
          </span>
          <div>
            <p className="font-semibold tracking-[-0.04em]">Phasa Rak</p>
            <p className="font-thai text-xs text-[#9f7881]">ภาษารัก</p>
          </div>
        </div>
        <p className="font-thai text-sm text-[#ad737d]">ยินดีต้อนรับ · welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em]">
          Sign in to your love story
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#87656d] dark:text-[#d0afb5]">
          We&apos;ll email you a magic link. No password to remember.
          <br />
          <span className="font-thai">ส่งลิงก์เข้าสู่ระบบให้คุณทางอีเมล</span>
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
