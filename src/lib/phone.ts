/** Приводить український номер до +380XXXXXXXXX. Повертає null, якщо формат хибний. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s()\-.+]/g, '');
  if (!/^\d+$/.test(digits)) return null;
  if (/^380\d{9}$/.test(digits)) return `+${digits}`;
  if (/^0\d{9}$/.test(digits)) return `+38${digits}`;
  return null;
}

/** Відкриває чат у Viber. Android хоче "%2B" у номері, iOS і десктоп працюють лише без "+". Готовий текст Viber не приймає. */
export function viberHref(to: string, android: boolean): string {
  return `viber://chat?number=${android ? encodeURIComponent(to) : to.replace(/^\+/, '')}`;
}
