// Luật validate tin nhắn forum — PHẢI giống client (parity, TASK_DECOMPOSITION §1.4).
export const AUTHOR_MAX = 50;
export const TEXT_MAX = 500;

export const MISSING_FIELDS = 'Missing required fields';

/**
 * @returns {{ error: string } | { value: { author: string, text: string } }}
 */
export function validateMessage(body) {
  const { author, text } = body ?? {};
  if (typeof author !== 'string' || typeof text !== 'string') return { error: MISSING_FIELDS };

  const a = author.trim();
  const t = text.trim();
  if (!a || !t) return { error: MISSING_FIELDS };
  if (a.length > AUTHOR_MAX) return { error: `author must be at most ${AUTHOR_MAX} characters` };
  if (t.length > TEXT_MAX) return { error: `text must be at most ${TEXT_MAX} characters` };

  return { value: { author: a, text: t } };
}
