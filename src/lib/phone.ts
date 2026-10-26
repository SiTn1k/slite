/** Приводить український номер до +380XXXXXXXXX. Повертає null, якщо формат хибний. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s()\-.+]/g, '');
  if (!/^\d+$/.test(digits)) return null;
  if (/^380\d{9}$/.test(digits)) return `+${digits}`;
  if (/^0\d{9}$/.test(digits)) return `+38${digits}`;
  return null;
}

/** Десктоп та iOS: viber://add (viber://chat там не відкривається). "+" кодуємо як %2B: голий плюс у query стає пробілом і iOS Viber каже "контакт не знайдено". Android Chrome не розпізнає голу viber:// схему, тому intent:// з пакетом Viber і "%2B" замість "+". */
export function viberHref(to: string, android: boolean): string {
  return android
    ? `intent://add?number=${encodeURIComponent(to)}#Intent;scheme=viber;package=com.viber.voip;end`
    : `viber://add?number=${encodeURIComponent(to)}`;
}
