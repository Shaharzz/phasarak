export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#fffaf7] px-6 text-center text-[#321c26]">
      <div>
        <p className="font-thai text-sm text-[#ad737d]">ไม่พบหน้านี้</p>
        <h1 className="mt-2 text-3xl font-semibold">This page wandered off.</h1>
        <a className="mt-6 inline-block text-sm text-[#d95866] underline" href="/">
          Return home · กลับหน้าหลัก
        </a>
      </div>
    </main>
  );
}
