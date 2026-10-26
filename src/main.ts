import '@fontsource-variable/manrope/wght.css';
import './styles.css';
import { site, services, categories, works, type CategoryId } from './config/site.ts';
import { normalizePhone, viberHref } from './lib/phone.ts';
import { submitInquiry } from './lib/submit.ts';

const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel);

// --- мобільне меню ---
const header = $('.site-header');
const menuBtn = $<HTMLButtonElement>('.menu-btn');
const nav = $('#nav');

function setMenu(open: boolean) {
  header?.classList.toggle('nav-open', open);
  menuBtn?.setAttribute('aria-expanded', String(open));
  menuBtn?.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
}
menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
nav?.addEventListener('click', (e) => {
  if ((e.target as HTMLElement).closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuBtn.focus();
  }
});

// --- FAQ: кнопки + aria-expanded, стрілки/Home/End переміщують фокус ---
const faqButtons = [...document.querySelectorAll<HTMLButtonElement>('.faq-q')];
faqButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    document.getElementById(btn.getAttribute('aria-controls') ?? '')?.toggleAttribute('hidden', open);
  });
  btn.addEventListener('keydown', (e) => {
    const last = faqButtons.length - 1;
    const target = { ArrowDown: i === last ? 0 : i + 1, ArrowUp: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
    if (target === undefined) return;
    e.preventDefault();
    faqButtons[target].focus();
  });
});

// --- форма ---
const form = $<HTMLFormElement>('#inquiry');
const phoneInput = $<HTMLInputElement>('#f-phone');
const phoneErr = $('#f-phone-err');
const catSel = $<HTMLSelectElement>('#f-category');
const svcSel = $<HTMLSelectElement>('#f-service');
const result = $('#form-result');

function fillServices(cat: string) {
  if (!svcSel) return;
  const solarHidden = cat === 'solar' && !site.flags.solarConfirmed;
  const list = cat === 'plumbing' || cat === 'electrical' || (cat === 'solar' && !solarHidden)
    ? services.filter((s) => s.category === cat)
    : [];
  const hint = !cat ? 'Спочатку оберіть напрямок' : cat === 'other' ? 'Опишіть завдання нижче' : 'Обговоримо по телефону';
  svcSel.replaceChildren(new Option(list.length ? 'Оберіть послугу' : hint, ''));
  list.forEach((s) => svcSel.add(new Option(s.title, s.id)));
  svcSel.disabled = list.length === 0;
}

catSel?.addEventListener('change', () => fillServices(catSel.value));

// "Дізнатися ціну" на картці передзаповнює напрямок і послугу.
document.querySelectorAll<HTMLAnchorElement>('[data-category]').forEach((a) =>
  a.addEventListener('click', () => {
    if (!catSel || !svcSel) return;
    catSel.value = a.dataset.category ?? '';
    fillServices(catSel.value);
    svcSel.value = a.dataset.service ?? '';
  }),
);

function showResult(html: string) {
  if (!result) return;
  result.innerHTML = html;
  result.hidden = false;
  result.focus();
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!phoneInput || !phoneErr || !catSel || !svcSel || !result) return;
  const phone = normalizePhone(phoneInput.value);
  if (!phone) {
    phoneErr.textContent = phoneInput.value.trim()
      ? 'Номер не схожий на український. Приклад: 098 936 61 51.'
      : 'Вкажіть номер телефону.';
    phoneInput.setAttribute('aria-invalid', 'true');
    result.hidden = true;
    phoneInput.focus();
    return;
  }
  phoneErr.textContent = '';
  phoneInput.removeAttribute('aria-invalid');

  const cat = catSel.value;
  const label = cat === 'other' ? 'Інше' : cat ? categories[cat as CategoryId].title : '';
  const service = services.find((s) => s.id === svcSel.value)?.title ?? '';
  const data = new FormData(form);
  try {
    const r = await submitInquiry({
      name: String(data.get('name') ?? '').trim(),
      phone,
      category: label,
      service,
      description: String(data.get('description') ?? '').trim(),
    });
    if (r.kind === 'sent') {
      showResult('<h3>Звернення надіслано</h3><p>Ми зв’яжемося з вами за вказаним номером.</p>');
      return;
    }
    showResult(
      `<h3>Звернення підготовлено, але ще не надіслано</h3>
       <p>Ця форма не передає дані нікуди. Щоб ми отримали ваше завдання, зателефонуйте або напишіть у Viber.</p>
       <div class="cta-row">
         <a class="btn btn-yellow" href="${r.callHref}">Зателефонувати</a>
         <a class="btn btn-navy" href="${r.viberHref}" id="viber-btn">Написати у Viber</a>
         ${r.telegramHref ? `<a class="btn btn-navy" href="${r.telegramHref}" target="_blank" rel="noopener noreferrer">Написати в Telegram</a>` : ''}
       </div>
       <p class="muted">Текст звернення (копіюється при натисканні на Viber, вставте його в чат):</p><p class="sms-preview"></p>`,
    );
    const preview = result.querySelector('.sms-preview');
    if (preview) preview.textContent = r.message;
    result.querySelector('#viber-btn')?.addEventListener('click', () => {
      navigator.clipboard?.writeText(r.message).catch(() => {});
    });
  } catch {
    showResult('<h3>Не вдалося надіслати</h3><p>Зателефонуйте нам: звернення не збережено.</p>');
  }
});

// --- галерея робіт: фільтр і лайтбокс (відео вантажиться лише при відкритті) ---
const filterBtns = document.querySelectorAll<HTMLButtonElement>('.chip[data-filter]');
const workItems = document.querySelectorAll<HTMLLIElement>('.gallery li');
filterBtns.forEach((b) =>
  b.addEventListener('click', () => {
    filterBtns.forEach((x) => {
      x.classList.toggle('is-active', x === b);
      x.setAttribute('aria-pressed', String(x === b));
    });
    workItems.forEach((li) => (li.hidden = b.dataset.filter !== 'all' && li.dataset.stage !== b.dataset.filter));
  }),
);

const lb = $<HTMLDialogElement>('#lightbox');
if (lb) {
  const stage = lb.querySelector('.lb-stage')!;
  const cap = lb.querySelector('.lb-cap')!;
  let cur = 0;
  const visible = () => [...workItems].filter((li) => !li.hidden).map((li) => li.querySelector<HTMLButtonElement>('.work')!);
  const show = (btn: HTMLButtonElement) => {
    cur = visible().indexOf(btn);
    const w = works[Number(btn.dataset.i)];
    stage.replaceChildren();
    if (w.kind === 'video') {
      const v = document.createElement('video');
      v.src = `work/${w.file}.mp4`;
      v.poster = `work/${w.file}.jpg`;
      v.controls = v.autoplay = v.playsInline = true;
      v.setAttribute('playsinline', '');
      stage.append(v);
    } else {
      const img = document.createElement('img');
      img.src = `work/${w.file}.jpg`;
      img.alt = w.title;
      stage.append(img);
    }
    cap.textContent = `${w.title}. ${w.text}`;
  };
  const step = (d: number) => {
    const list = visible();
    show(list[(cur + d + list.length) % list.length]);
  };
  document.querySelectorAll<HTMLButtonElement>('.work').forEach((b) =>
    b.addEventListener('click', () => {
      show(b);
      lb.showModal();
    }),
  );
  lb.querySelector('.lb-close')?.addEventListener('click', () => lb.close());
  lb.querySelector('.lb-prev')?.addEventListener('click', () => step(-1));
  lb.querySelector('.lb-next')?.addEventListener('click', () => step(1));
  lb.addEventListener('click', (e) => e.target === lb && lb.close());
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });
  lb.addEventListener('close', () => stage.replaceChildren());
}

// Android потребує інший запис номера у viber://, ніж десктоп та iOS.
if (/android/i.test(navigator.userAgent)) {
  document.querySelectorAll<HTMLAnchorElement>('a[data-viber]').forEach((a) => {
    a.href = viberHref(site.viber, true);
  });
}

// Події в GA4: дзвінки та месенджери. gtag відсутній, якщо аналітика вимкнена або заблокована.
type Gtag = (cmd: 'event', name: string, params?: object) => void;
const track = (name: string, params?: object) => (window as unknown as { gtag?: Gtag }).gtag?.('event', name, params);
document.addEventListener('click', (e) => {
  const href = (e.target as Element).closest('a')?.getAttribute('href') ?? '';
  if (href.startsWith('tel:')) track('click_call', { phone: href.slice(4) });
  else if ((href.startsWith('viber:') || href.includes('scheme=viber'))) track('click_viber');
  else if (href.includes('t.me/')) track('click_telegram');
});

const year = $('#year');
if (year) year.textContent = String(new Date().getFullYear());
