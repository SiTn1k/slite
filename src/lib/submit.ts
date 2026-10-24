import { site, visiblePhones } from '../config/site.ts';
import { viberHref } from './phone.ts';

export interface Inquiry {
  name: string;
  /** Уже нормалізований, +380XXXXXXXXX */
  phone: string;
  category: string;
  service: string;
  description: string;
}

export type SubmitResult =
  | { kind: 'sent' }
  | { kind: 'fallback'; callHref: string; viberHref: string; telegramHref: string; message: string };

export function buildMessage(i: Inquiry): string {
  const lines = ['Доброго дня! Потрібна послуга.'];
  if (i.category) lines.push(`Напрямок: ${i.category}${i.service ? `, ${i.service}` : ''}.`);
  if (i.description) lines.push(`Завдання: ${i.description}`);
  lines.push(`Мій телефон: ${i.phone}${i.name ? `, ${i.name}` : ''}.`);
  return lines.join('\n');
}

/**
 * Єдина точка, де звернення залишає сторінку.
 * - formEndpoint порожній: нічого не надсилається, лише готуємо дзвінок і Viber.
 * - formEndpoint заданий: JSON POST на цей URL. Це передача персональних даних стороннім сервісом,
 *   тому вмикайте її свідомо (див. README).
 */
export async function submitInquiry(i: Inquiry): Promise<SubmitResult> {
  if (site.formEndpoint) {
    try {
      const res = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(i),
      });
      if (res.ok) return { kind: 'sent' };
    } catch {
      // Немає зв'язку або сервера: нижче даємо клієнту зв'язатися самостійно.
    }
  }
  const to = visiblePhones()[0];
  const message = buildMessage(i);
  const android = typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent);
  return {
    kind: 'fallback',
    callHref: `tel:${to.e164}`,
    viberHref: viberHref(site.viber, android),
    telegramHref: site.telegram ? `https://t.me/${site.telegram}` : '',
    message,
  };
}
