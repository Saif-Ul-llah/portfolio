"use client";

import { Pause, Play } from "lucide-react";
import { toggleMotion, useMotionAllowed } from "@/lib/motion";

export function MotionToggle({ className = "" }: { className?: string }) {
  const allowed = useMotionAllowed();
  return (
    <button
      type="button"
      onClick={toggleMotion}
      aria-pressed={!allowed}
      className={`inline-flex min-h-[32px] items-center gap-1.5 rounded-full px-2 transition-colors hover:text-ink ${className}`}
    >
      {allowed ? <Pause size={12} /> : <Play size={12} />}
      {allowed ? "Pause motion" : "Play motion"}
    </button>
  );
}
