import { useEffect, useRef, useState } from "react";

const TYPES = {
  success: {
    svg: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="8" fill="currentColor" opacity=".15" />
        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5.5 9.3l2.3 2.3 4.2-4.6" stroke="currentColor" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    wrap:   "bg-[#f0fdf9] dark:bg-[#0d1f18] border-emerald-200 dark:border-[#1a4a35]",
    accent: "text-emerald-600 dark:text-emerald-400",
    stripe: "bg-emerald-500 dark:bg-emerald-400",
    bar:    "bg-emerald-500 dark:bg-emerald-400",
    label:  "Success",
  },
  error: {
    svg: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="8" fill="currentColor" opacity=".15" />
        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 6l6 6M12 6l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
    wrap:   "bg-[#fff1f2] dark:bg-[#1f0d11] border-rose-200 dark:border-[#4a1525]",
    accent: "text-rose-500 dark:text-rose-400",
    stripe: "bg-rose-500 dark:bg-rose-400",
    bar:    "bg-rose-500 dark:bg-rose-400",
    label:  "Error",
  },
  info: {
    svg: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="8" fill="currentColor" opacity=".15" />
        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9 8v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="9" cy="5.8" r=".9" fill="currentColor" />
      </svg>
    ),
    wrap:   "bg-[#eff6ff] dark:bg-[#0d1625] border-blue-200 dark:border-[#1e3a5f]",
    accent: "text-blue-500 dark:text-blue-400",
    stripe: "bg-blue-500 dark:bg-blue-400",
    bar:    "bg-blue-500 dark:bg-blue-400",
    label:  "Info",
  },
  warning: {
    svg: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 1.5L16.8 15H1.2L9 1.5z" fill="currentColor" opacity=".15" />
        <path d="M9 1.5L16.8 15H1.2L9 1.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M9 7v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="9" cy="13" r=".9" fill="currentColor" />
      </svg>
    ),
    wrap:   "bg-[#fffbeb] dark:bg-[#1a1200] border-amber-300 dark:border-[#4a3200]",
    accent: "text-amber-500 dark:text-amber-400",
    stripe: "bg-amber-500 dark:bg-amber-400",
    bar:    "bg-amber-500 dark:bg-amber-400",
    label:  "Warning",
  },
};

export default function Toast({ message, type = "info", onRemove }) {
  const [phase, setPhase] = useState("in"); // in → show → out
  const barRef = useRef(null);
  const cfg    = TYPES[type] ?? TYPES.info;

  /* lifecycle */
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 16);
    const t2 = setTimeout(() => setPhase("out"),  3800);
    const t3 = setTimeout(onRemove, 4250);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onRemove]);

  /* shrink progress bar once visible */
  useEffect(() => {
    if (phase !== "show" || !barRef.current) return;
    barRef.current.style.transition = "transform 3700ms linear";
    barRef.current.style.transform  = "scaleX(0)";
  }, [phase]);

  const visible = phase === "show";
  const gone    = phase === "out";

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        /* layout */
        "relative flex items-center gap-2.5 pl-5 pr-3.5 py-3",
        "min-w-65 max-w-105 rounded-2xl border overflow-hidden",
        /* theme */
        cfg.wrap,
        "shadow-[0_4px_20px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.05)]",
        "dark:shadow-[0_4px_20px_rgba(0,0,0,0.5),0_1px_4px_rgba(0,0,0,0.35)]",
        /* animation */
        "transition-all will-change-[opacity,transform]",
        visible
          ? "opacity-100 translate-y-0 scale-100 duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          : gone
          ? "opacity-0 -translate-y-1 scale-[0.97] duration-350 ease-in-out"
          : "opacity-0 -translate-y-2 scale-95 duration-0",
      ].join(" ")}
    >
      {/* left stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3.5px] rounded-l-2xl ${cfg.stripe}`} />

      {/* icon */}
      <div className={`flex-shrink-0 flex items-center justify-center ${cfg.accent}`}>
        {cfg.svg}
      </div>

      {/* label + message */}
      <div className="flex-1 min-w-0">
        <p className={`text-[11px] font-bold tracking-[0.07em] uppercase mb-0.5 leading-none ${cfg.accent}`}>
          {cfg.label}
        </p>
        <p className="m-0 text-[13px] font-medium text-slate-800 dark:text-slate-200 leading-[1.45] break-words">
          {message}
        </p>
      </div>

      {/* close button */}
      <button
        onClick={() => { setPhase("out"); setTimeout(onRemove, 350); }}
        aria-label="Dismiss"
        className="flex-shrink-0 w-[22px] h-[22px] flex items-center justify-center rounded-md
                   bg-transparent border-0 text-slate-400 dark:text-slate-500 text-xs
                   cursor-pointer transition-colors duration-150
                   hover:bg-black/7 dark:hover:bg-white/10
                   hover:text-slate-700 dark:hover:text-slate-200"
      >
        ✕
      </button>

      {/* progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black/5 dark:bg-white/5 rounded-b-2xl overflow-hidden">
        <div
          ref={barRef}
          className={`h-full w-full origin-left ${cfg.bar}`}
          style={{ transform: "scaleX(1)" }}
        />
      </div>
    </div>
  );
}