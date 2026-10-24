/** Приводить український номер до +380XXXXXXXXX. Повертає null, якщо формат хибний. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s()\-.+]/g, '');
  if (!/^\d+$/.test(digits)) return null;
  if (/^380\d{9}$/.test(digits)) return `+${digits}`;
  if (/^0\d{9}$/.test(digits)) return `+38${digits}`;
  return null;
}

/** Відкриває чат у Viber. Viber не приймає готовий текст через посилання, тому текст копіюється окремо. */
export function viberHref(to: string): string {
  return `viber://chat?number=${encodeURIComponent(to)}`;
}
