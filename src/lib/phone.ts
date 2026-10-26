/** Приводить український номер до +380XXXXXXXXX. Повертає null, якщо формат хибний. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s()\-.+]/g, '');
  if (!/^\d+$/.test(digits)) return null;
  if (/^380\d{9}$/.test(digits)) return `+${digits}`;
  if (/^0\d{9}$/.test(digits)) return `+38${digits}`;
  return null;
}

/** Номер без "+" ("+" і "%2B" дають "контакт не знайдено"). Android Chrome не розпізнає голу viber://, тому intent:// з пакетом Viber і "%2B". Десктоп Viber на viber://add відповідає "Запит недоступний", тому там viber://chat; iOS: viber://add. */
export function viberHref(to: string, android: boolean, desktop = false): string {
  if (android) return `intent://add?number=${encodeURIComponent(to)}#Intent;scheme=viber;package=com.viber.voip;end`;
  return `viber://${desktop ? 'chat' : 'add'}?number=${to.replace(/^\+/, '')}`;
}

/** Не Android, не iOS (iPadOS видає себе за Mac, тому перевіряємо дотик). */
export function isDesktop(ua: string, touchPoints: number): boolean {
  return !/android|iphone|ipad|ipod/i.test(ua) && !(/macintosh/i.test(ua) && touchPoints > 1);
}
