// Збирає HTML сторінки з конфігу. Викликається на збірці з vite.config.ts, тож контент є в HTML без JS.
import {
  site, categories, services, whyUs, steps, faq, gallery, visiblePhones,
  type CategoryId, type Service,
} from './config/site.ts';
import { icon } from './config/icons.ts';
import { viberHref } from './lib/phone.ts';

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

export const meta = {
  title: `Сантехнік і електрик Черкаси — виклик майстра | ${site.name}`,
  description:
    'Сантехнік і електрик у Черкасах: заміна труб і змішувачів, монтаж бойлерів і радіаторів, підключення пральних машин, заміна проводки, електрощити. Виклик майстра додому — зателефонуйте.',
};

const phones = visiblePhones();
const main = phones[0];

const logo = `<svg class="logo" width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="11" fill="#063B69"/><path d="M22 7 12 22h7l-1.500 11L28 18h-7z" fill="#FFD600"/></svg>`;

const callBtn = (cls = 'btn btn-yellow') =>
  `<a class="${cls}" href="tel:${main.e164}">${icon('phone', 20)}<span>Зателефонувати</span></a>`;

const priceBtn = (cls = 'btn btn-outline') => `<a class="${cls}" href="#price">Дізнатися ціну</a>`;

const phoneLinks = (cls: string) =>
  phones
    .map(
      (p) =>
        `<a class="${cls}" href="tel:${p.e164}"><span class="phone-name">${esc(p.name)}</span><span class="phone-num">${esc(p.display)}</span></a>`,
    )
    .join('');

/** Постійні кнопки месенджерів. Формат Viber для Android підміняє main.ts за data-viber. */
const messengerLinks = (cls: string) =>
  [
    `<a class="${cls}" data-viber href="${viberHref(site.viber, false)}">Viber</a>`,
    site.telegram ? `<a class="${cls}" href="https://t.me/${esc(site.telegram)}" target="_blank" rel="noopener noreferrer">Telegram</a>` : '',
  ].join('');

const nav = [
  ['home', 'Головна'],
  ['services', 'Послуги'],
  ['how', 'Як замовити'],
  ['price', 'Вартість'],
  ['faq', 'Питання'],
  ['contacts', 'Контакти'],
];

function header(): string {
  return `
<a class="skip" href="#main">Перейти до змісту</a>
<header class="site-header">
  <div class="wrap bar">
    <a class="brand" href="#home" aria-label="${esc(site.name)}, на початок">${logo}<span class="brand-name">${esc(site.name)}</span></a>
    <nav id="nav" class="nav" aria-label="Основна навігація">
      ${nav.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}
    </nav>
    <div class="header-cta">${callBtn('btn btn-yellow btn-sm')}${priceBtn('btn btn-outline btn-sm')}</div>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" aria-label="Відкрити меню">
      <span class="menu-open">${icon('menu')}</span><span class="menu-close">${icon('close')}</span>
    </button>
  </div>
</header>`;
}

function hero(): string {
  return `
<section class="hero" id="home" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <h1 id="hero-title"><span class="trade trade-water">Сантехнік</span>, <span class="trade trade-bolt">електрик</span> та <span class="trade trade-sun">сонячні панелі</span> в Черкасах</h1>
      <p class="lead">Виклик сантехніка й електрика додому: монтаж, ремонт і заміна для квартир і будинків у Черкасах. Зателефонуйте — обговоримо завдання та вартість.</p>
      <div class="cta-row">${callBtn('btn btn-yellow btn-lg')}<a class="btn btn-outline btn-lg" href="#price">Дізнатися вартість</a></div>
      <div class="phone-list" aria-label="Телефони">${phoneLinks('phone-link')}</div>
      <div class="cta-row msgr" aria-label="Месенджери">${messengerLinks('btn btn-navy')}</div>
    </div>
    <figure class="hero-art">
      <img src="img/hero.svg" width="600" height="520" fetchpriority="high" decoding="async"
        alt="Ілюстрація: розріз будинку з водяною трубою, електропроводкою та сонячними панелями на даху">
      <figcaption>Ілюстрація</figcaption>
    </figure>
  </div>
</section>`;
}

function serviceCard(s: Service): string {
  return `
<li class="card">
  <span class="card-icon">${icon(s.icon, 26)}</span>
  <h4>${esc(s.title)}</h4>
  <p>${esc(s.description)}</p>
  <a class="card-link" href="#price" data-category="${s.category}" data-service="${s.id}">Дізнатися ціну<span class="sr-only"> — ${esc(s.title)}</span></a>
</li>`;
}

function neutralSolarCard(): string {
  // solarConfirmed=false: без переліку послуг, обладнання, потужностей та обіцянок.
  return `
<li class="card card-wide">
  <span class="card-icon">${icon('sun', 26)}</span>
  <h4>Сонячні панелі</h4>
  <p>Зателефонуйте, щоб обговорити завдання.</p>
  <div class="card-actions">${callBtn('btn btn-yellow btn-sm')}<a class="card-link" href="#price" data-category="solar" data-service="">Дізнатися ціну<span class="sr-only"> — сонячні панелі</span></a></div>
</li>`;
}

function group(id: CategoryId): string {
  const c = categories[id];
  const neutral = id === 'solar' && !site.flags.solarConfirmed;
  const items = neutral
    ? neutralSolarCard()
    : services.filter((s) => s.category === id).map(serviceCard).join('');
  return `
<article class="group group-${id}" aria-labelledby="g-${id}">
  <header class="group-head">
    <span class="group-icon">${icon(c.icon, 28)}</span>
    <h3 id="g-${id}">${esc(c.title)}</h3>
    ${neutral ? '' : `<p>${esc(c.lead)}</p>`}
  </header>
  <ul class="cards">${items}</ul>
</article>`;
}

function servicesSection(): string {
  return `
<section class="section" id="services" aria-labelledby="services-title">
  <div class="wrap">
    <h2 id="services-title">Послуги</h2>
    <p class="section-lead">Три напрямки. Оберіть потрібний і дізнайтеся вартість.</p>
    ${(['plumbing', 'electrical', 'solar'] as CategoryId[]).map(group).join('')}
  </div>
</section>`;
}

function whySection(): string {
  return `
<section class="section section-tint" id="why" aria-labelledby="why-title">
  <div class="wrap">
    <h2 id="why-title">Чому звертаються до нас</h2>
    <ul class="why">
      ${whyUs.map((t) => `<li>${icon('check', 22)}<span>${esc(t)}</span></li>`).join('')}
    </ul>
  </div>
</section>`;
}

function howSection(): string {
  return `
<section class="section" id="how" aria-labelledby="how-title">
  <div class="wrap">
    <h2 id="how-title">Як замовити</h2>
    <ol class="steps">
      ${steps
        .map(
          (s, i) =>
            `<li><span class="step-n" aria-hidden="true">${i + 1}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`,
        )
        .join('')}
    </ol>
  </div>
</section>`;
}

function priceSection(): string {
  return `
<section class="section section-tint" id="price" aria-labelledby="price-title">
  <div class="wrap price-grid">
    <div class="price-copy">
      <h2 id="price-title">Вартість</h2>
      <p class="section-lead">Вартість залежить від обсягу, складності робіт і матеріалів. Точну суму можна назвати, лише знаючи завдання.</p>
      <p class="muted">Ця форма не надсилає заявку автоматично. Після заповнення ви зможете зателефонувати або написати у Viber.</p>
      <div class="phone-list">${phoneLinks('phone-link')}</div>
    </div>
    <form class="form" id="inquiry" novalidate>
      <div class="field">
        <label for="f-name">Ім’я <span class="opt">(необов’язково)</span></label>
        <input id="f-name" name="name" type="text" autocomplete="name">
      </div>
      <div class="field">
        <label for="f-phone">Телефон <span class="req" aria-hidden="true">*</span></label>
        <input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="098 000 00 00" aria-describedby="f-phone-hint f-phone-err">
        <p class="hint" id="f-phone-hint">Український номер, наприклад 098 936 61 51</p>
        <p class="err" id="f-phone-err" aria-live="polite"></p>
      </div>
      <div class="field">
        <label for="f-category">Напрямок</label>
        <select id="f-category" name="category">
          <option value="">Оберіть напрямок</option>
          <option value="plumbing">Сантехніка</option>
          <option value="electrical">Електрика</option>
          <option value="solar">Сонячні панелі</option>
          <option value="other">Інше</option>
        </select>
      </div>
      <div class="field">
        <label for="f-service">Послуга</label>
        <select id="f-service" name="service" disabled>
          <option value="">Спочатку оберіть напрямок</option>
        </select>
      </div>
      <div class="field">
        <label for="f-desc">Опис завдання <span class="opt">(необов’язково)</span></label>
        <textarea id="f-desc" name="description" rows="4"></textarea>
      </div>
      <button class="btn btn-navy btn-lg" type="submit">Підготувати звернення</button>
      <div class="result" id="form-result" tabindex="-1" aria-live="polite" hidden></div>
    </form>
  </div>
</section>`;
}

function gallerySection(): string {
  return `
<section class="section" id="gallery" aria-labelledby="gallery-title">
  <div class="wrap">
    <h2 id="gallery-title">Приклади робіт</h2>
    <p class="section-lead">Ілюстративні зображення, не фото виконаних робіт.</p>
    <ul class="gallery">
      ${gallery
        .map(
          (g) => `<li><figure><img src="img/${g.file}.svg" width="800" height="600" loading="lazy" decoding="async" alt="${esc(g.alt)}"><figcaption>${esc(g.caption)}</figcaption></figure></li>`,
        )
        .join('')}
    </ul>
  </div>
</section>`;
}

function areaSection(): string {
  return `
<section class="section section-tint" id="area" aria-labelledby="area-title">
  <div class="wrap area">
    <div>
      <h2 id="area-title">Працюємо в Черкасах та області</h2>
      <p class="section-lead">Потрібен сантехнік у Черкасах, електрик у Черкасах чи встановлення сонячних панелей у Черкаській області? Зателефонуйте, щоб підтвердити, чи зможемо виконати роботу за вашою адресою.</p>
    </div>
    ${callBtn('btn btn-yellow btn-lg')}
  </div>
</section>`;
}

function faqSection(): string {
  return `
<section class="section" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq-wrap">
    <h2 id="faq-title">Питання та відповіді</h2>
    <div class="faq">
      ${faq
        .map(
          (f, i) => `
      <div class="faq-item">
        <h3><button class="faq-q" type="button" id="faq-b${i}" aria-expanded="false" aria-controls="faq-p${i}"><span>${esc(f.q)}</span>${icon('chevron', 22)}</button></h3>
        <div class="faq-a" id="faq-p${i}" role="region" aria-labelledby="faq-b${i}" hidden><p>${esc(f.a)}</p></div>
      </div>`,
        )
        .join('')}
    </div>
  </div>
</section>`;
}

function finalCta(): string {
  return `
<section class="final" id="contacts" aria-labelledby="final-title">
  <div class="wrap final-inner">
    <h2 id="final-title">Потрібен сантехнік, електрик чи сонячні панелі?</h2>
    <p>Зателефонуйте, опишіть завдання та дізнайтеся орієнтовну вартість робіт.</p>
    <div class="cta-row">
      ${phones
        .map(
          (p) => `<a class="btn btn-yellow btn-lg" href="tel:${p.e164}">${icon('phone', 20)}<span>${esc(p.name)}: ${esc(p.display)}</span></a>`,
        )
        .join('')}
      ${messengerLinks('btn btn-light btn-lg')}
      <a class="btn btn-light btn-lg" href="#price">Дізнатися ціну</a>
    </div>
  </div>
</section>`;
}

function footer(): string {
  return `
<footer class="site-footer">
  <div class="trasa" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap foot-grid">
    <div>
      <a class="brand brand-light" href="#home" aria-label="${esc(site.name)}, на початок">${logo}<span class="brand-name">${esc(site.name)}</span></a>
      <p>${esc(site.tagline)}</p>
      <p>${esc(site.area)}</p>
    </div>
    <div>
      <p class="foot-h">Телефони</p>
      <p>${phones.map((p) => `<a href="tel:${p.e164}">${esc(p.display)}</a> <span class="foot-name">${esc(p.name)}</span>`).join('<br>')}</p>
    </div>
    <div>
      <p class="foot-h">Соцмережі</p>
      <p><a href="${esc(site.instagram)}" target="_blank" rel="noopener noreferrer">Instagram</a>${site.telegram ? ` · <a href="https://t.me/${esc(site.telegram)}" target="_blank" rel="noopener noreferrer">Telegram</a>` : ''}</p>
    </div>
    <nav aria-label="Розділи сторінки">
      <p class="foot-h">Розділи</p>
      <ul>${nav.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join('')}</ul>
    </nav>
  </div>
  <p class="wrap copy">© <span id="year">${new Date().getFullYear()}</span> ${esc(site.name)}</p>
</footer>`;
}

function mobileBar(): string {
  return `
<div class="mobile-bar">
  ${callBtn('btn btn-yellow')}
  ${priceBtn('btn btn-navy')}
</div>`;
}

export function renderBody(): string {
  return `${header()}<main id="main">${hero()}${servicesSection()}${whySection()}${howSection()}${priceSection()}${gallerySection()}${areaSection()}${faqSection()}${finalCta()}</main>${footer()}${mobileBar()}`;
}

/** canonical, og:url та JSON-LD. Лише перевірені факти: назва, телефони, територія. Без адреси, графіка, рейтингів. */
export function headExtra(): string {
  const domain = site.domain.replace(/\/$/, '');
  const url = domain ? [`<link rel="canonical" href="${esc(domain)}/">`, `<meta property="og:url" content="${esc(domain)}/">`] : [];
  const ld = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Plumber', 'Electrician'],
    name: site.name,
    inLanguage: 'uk',
    address: { '@type': 'PostalAddress', addressLocality: 'Черкаси', addressRegion: 'Черкаська область', addressCountry: 'UA' },
    description: site.tagline,
    telephone: phones.map((p) => p.e164),
    areaServed: [
      { '@type': 'City', name: 'Черкаси' },
      { '@type': 'AdministrativeArea', name: 'Черкаська область' },
    ],
    sameAs: [site.instagram],
    makesOffer: services
      .filter((x) => x.category !== 'solar' || site.flags.solarConfirmed)
      .map((x) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: x.title, description: x.description } })),
    ...(domain ? { url: `${domain}/`, image: `${domain}/img/hero.svg` } : {}),
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  const script = (o: object) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
  const ga = site.gaId
    ? [
        `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(site.gaId)}"></script>`,
        `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${esc(site.gaId)}');</script>`,
      ]
    : [];
  return [...url, script(ld), script(faqLd), ...ga].join('\n');
}
