// Qualzo AI assistant. The widget script (loaded in app/layout.tsx) exposes
// window.Qualzo; if it hasn't loaded or is blocked, fall back to the hosted chat page.
export const CHAT_USER_ID = "cmryyxe8300vtjq36fg68s04m";
export const CHAT_SCRIPT = "https://qualzo.app/widget.js";
export const CHAT_URL = `https://qualzo.app/chat/${CHAT_USER_ID}`;

type QualzoApi = { open?: () => void; close?: () => void };

export function openChat() {
  const qualzo = (window as Window & { Qualzo?: QualzoApi }).Qualzo;
  if (qualzo?.open) qualzo.open();
  else window.open(CHAT_URL, "_blank", "noopener,noreferrer");
}
