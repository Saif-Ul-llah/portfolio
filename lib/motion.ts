"use client";

import { useEffect, useState } from "react";

// A site-wide "pause animations" switch (WCAG 2.2.2), stored per visitor.
// The head script in app/layout.tsx applies the class before first paint.
const CLASS = "motion-off";
const EVENT = "motionchange";

export function isMotionOff() {
  return document.documentElement.classList.contains(CLASS);
}

export function setMotionOff(off: boolean) {
  document.documentElement.classList.toggle(CLASS, off);
  try {
    localStorage.setItem("motion", off ? "off" : "on");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function toggleMotion() {
  setMotionOff(!isMotionOff());
}

/** True when animation may run: the OS setting allows it and the visitor hasn't paused it. */
export function useMotionAllowed() {
  const [allowed, setAllowed] = useState(true);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowed(!mq.matches && !isMotionOff());
    update();
    mq.addEventListener("change", update);
    window.addEventListener(EVENT, update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener(EVENT, update);
    };
  }, []);
  return allowed;
}

/** Subscribe outside React (used by the canvas engine). */
export function onMotionChange(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
