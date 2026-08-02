"use client";

export default function SectionBackground() {
  return (
    <>
      <div className="absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet-300/20 blur-[180px]" />
      <div className="absolute -left-40 bottom-0 h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[150px]" />
      <div className="absolute -right-32 top-20 h-[350px] w-[350px] rounded-full bg-purple-500/10 blur-[130px]" />
      <div
        className="absolute inset-0 opacity-20
        [background-image:radial-gradient(circle,rgba(255,255,255,.15)_1px,transparent_1px)]
        [background-size:28px_28px]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090513]/30 to-[#05030a]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,4,14,0.15)_55%,rgba(7,4,14,0.9)_100%)]" />
    </>
  );
}