/** Приводить український номер до +380XXXXXXXXX. Повертає null, якщо формат хибний. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s()\-.+]/g, '');
  if (!/^\d+$/.test(digits)) return null;
  if (/^380\d{9}$/.test(digits)) return `+${digits}`;
  if (/^0\d{9}$/.test(digits)) return `+38${digits}`;
  return null;
}

/** Посилання Viber через viber://add: у такому вигляді воно відкривається на ноутбуці, на відміну від viber://chat. Android потребує "%2B" замість "+". */
export function viberHref(to: string, android: boolean): string {
  return `viber://add?number=${android ? encodeURIComponent(to) : to}`;
}
