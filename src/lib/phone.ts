/** Приводить український номер до +380XXXXXXXXX. Повертає null, якщо формат хибний. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s()\-.+]/g, '');
  if (!/^\d+$/.test(digits)) return null;
  if (/^380\d{9}$/.test(digits)) return `+${digits}`;
  if (/^0\d{9}$/.test(digits)) return `+38${digits}`;
  return null;
}

/** Посилання sms: із готовим текстом. "?&body=" працює і на iOS, і на Android. */
export function smsHref(to: string, body: string): string {
  return `sms:${to}?&body=${encodeURIComponent(body)}`;
}
