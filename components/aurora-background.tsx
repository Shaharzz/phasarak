import Aurora from "@/components/Aurora";

export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="reactbits-aurora absolute inset-x-0 top-0 h-[46vh] opacity-30">
        <Aurora
          colorStops={["#e86673", "#f4bd78", "#e8a1b1"]}
          amplitude={0.75}
          blend={0.6}
          speed={0.5}
          lightMode
        />
      </div>
      <div className="aurora aurora-one motion-safe:block motion-reduce:hidden" />
      <div className="aurora aurora-two motion-safe:block motion-reduce:hidden" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,#fffaf7_72%)] dark:bg-[radial-gradient(circle_at_50%_0%,transparent_0%,#1b1118_72%)]" />
    </div>
  );
}
