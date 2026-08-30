/**
 * Notifications navigateur — déclenchées quand Druide pose une question.
 */

const QUESTION_REGEX = /[?？]\s*$|[?？]\s/;

export function extractQuestion(text) {
  if (!text) return null;
  const sentences = String(text).split(/(?<=[.!?])\s+/);
  const question = sentences.reverse().find((s) => /[?？]/.test(s));
  return question ? question.trim() : null;
}

export function hasQuestion(text) {
  return !!text && QUESTION_REGEX.test(String(text));
}

/** À appeler sur une action utilisateur (clic/envoi) pour obtenir la permission. */
export async function ensureNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission().catch(() => 'denied');
  return result === 'granted';
}

/** Affiche une notification navigateur si Druide pose une question. */
export function notifyDruideQuestion(responseText, { language = 'fr' } = {}) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  if (!document.hidden) return; // inutile si l'utilisateur regarde déjà la conversation
  if (!hasQuestion(responseText)) return;

  const body = extractQuestion(responseText) || responseText.slice(0, 140);
  const notification = new Notification(
    language === 'en' ? 'Druide asks you a question' : 'Druide vous pose une question',
    { body: body.slice(0, 180), tag: 'druide-question', icon: '/favicon.ico' }
  );
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}