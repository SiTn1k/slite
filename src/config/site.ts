// Єдине джерело правди для сайту. Телефони, бренд, послуги й прапорці правляться тільки тут.

export type CategoryId = 'plumbing' | 'electrical' | 'solar';

export interface Phone {
  name: string;
  /** Показати в тексті, напр. "098 936 61 51" */
  display: string;
  /** Для tel: та sms:, міжнародний формат */
  e164: string;
}

export interface Service {
  id: string;
  category: CategoryId;
  title: string;
  description: string;
  icon: string;
}

export const site = {
  name: 'MAYA',
  instagram: 'https://www.instagram.com/santekhnik_cherkasy/',
  tagline: 'Сантехніка, електрика і сонячні панелі',
  area: 'Черкаси та Черкаська область',
  areaShort: 'по місту та області',

  /** Заповніть, коли буде домен, наприклад "https://example.com". Тоді з'являться canonical і og:url. */
  domain: 'https://santehnik-cherkasy.com',

  /** Номер, на якому відкривається чат Viber (може відрізнятися від номерів для дзвінків). */
  viber: '+380934680502',

  /** Порожньо = форма не надсилається нікуди, лише дзвінок або Viber. Див. README, розділ "Форма". */
  formEndpoint: '',

  flags: {
    // TO CONFIRM WITH OWNER: чи показувати номер Олеся (електрика).
    showOlesPhone: true,
    // TO CONFIRM WITH OWNER: чи підтверджені послуги із сонячних панелей.
    // false = показуємо лише коротку нейтральну картку без переліку послуг.
    solarConfirmed: false,
  },

  phones: {
    andriy: [
      { name: 'Андрій', display: '098 936 61 51', e164: '+380989366151' },
      { name: 'Андрій', display: '093 468 05 02', e164: '+380934680502' },
    ] satisfies Phone[],
    // TO CONFIRM WITH OWNER: номер Олеся не підтверджений, прихований прапорцем showOlesPhone.
    oles: { name: 'Диспетчер', display: '093 257 70 05', e164: '+380932577005' } satisfies Phone,
  },
};

export const categories: Record<CategoryId, { title: string; lead: string; icon: string }> = {
  plumbing: { title: 'Сантехніка', lead: 'Монтаж, заміна та підключення в квартирі й будинку.', icon: 'drop' },
  electrical: { title: 'Електрика', lead: 'Електромонтаж, проводка, щити, розетки й світло.', icon: 'bolt' },
  solar: { title: 'Сонячні панелі', lead: 'Зателефонуйте, щоб обговорити завдання.', icon: 'sun' },
};

export const services: Service[] = [
  // Сантехніка (з реклами власника)
  { id: 'heater', category: 'plumbing', title: 'Монтаж водонагрівачів', description: 'Будь-якої складності.', icon: 'heater' },
  { id: 'bath', category: 'plumbing', title: 'Унітази, ванни, мийки', description: 'Встановлення.', icon: 'bath' },
  { id: 'fixtures', category: 'plumbing', title: 'Сантехнічні прилади', description: 'Монтаж і демонтаж.', icon: 'sink' },
  { id: 'meters', category: 'plumbing', title: 'Лічильники води', description: 'Заміна та встановлення.', icon: 'meter' },
  { id: 'towel', category: 'plumbing', title: 'Сушки для рушників', description: 'Встановлення та заміна.', icon: 'towel' },
  { id: 'machines', category: 'plumbing', title: 'Посудомийні та пральні машини', description: 'Підключення.', icon: 'washer' },
  { id: 'radiators', category: 'plumbing', title: 'Радіатори опалення', description: 'Монтаж.', icon: 'radiator' },
  { id: 'pipes', category: 'plumbing', title: 'Труби', description: 'Заміна у квартирі та будинку.', icon: 'pipes' },
  { id: 'floor', category: 'plumbing', title: 'Тепла підлога', description: 'Монтаж.', icon: 'floor' },
  { id: 'mixers', category: 'plumbing', title: 'Змішувачі', description: 'Заміна та ремонт.', icon: 'mixer' },

  // Електрика (з реклами власника)
  { id: 'electro', category: 'electrical', title: 'Електромонтажні роботи', description: 'Для квартир і будинків.', icon: 'wiring' },
  { id: 'wiring', category: 'electrical', title: 'Заміна проводки', description: 'Заміна електропроводки.', icon: 'cable' },
  { id: 'panels', category: 'electrical', title: 'Електрощити', description: 'Встановлення.', icon: 'panel' },
  { id: 'fittings', category: 'electrical', title: 'Світильники, розетки, вимикачі', description: 'Встановлення.', icon: 'socket' },
  { id: 'repair', category: 'electrical', title: 'Дрібний ремонт електрики', description: 'Ремонт електрики.', icon: 'wrench' },

  // Сонячні панелі: ЦІ ПОСЛУГИ НЕ ПІДТВЕРДЖЕНІ ВЛАСНИКОМ (solarConfirmed=false).
  // TO CONFIRM WITH OWNER: підтвердити або виправити перелік перед вмиканням прапорця.
  { id: 'solar-mount', category: 'solar', title: 'Монтаж сонячних панелей', description: 'Монтаж сонячних панелей.', icon: 'solar' },
  { id: 'solar-grid', category: 'solar', title: 'Підключення до електромережі будинку', description: 'Підключення сонячних систем до електромережі будинку.', icon: 'plug' },
  { id: 'solar-consult', category: 'solar', title: 'Консультація щодо підбору рішення', description: 'Консультація щодо підбору рішення.', icon: 'sun' },
];

export const whyUs = [
  'Зрозуміле обговорення вартості до початку робіт',
  'Увага до деталей монтажу',
  'Рішення під конкретне завдання',
  'Зручний зв’язок телефоном',
  'Робота у квартирах і будинках',
];

export const steps = [
  { title: 'Зателефонуйте й опишіть завдання', text: 'Розкажіть, що потрібно встановити, замінити чи підключити.' },
  { title: 'Уточніть обсяг і орієнтовну вартість', text: 'Вартість залежить від обсягу, складності робіт і матеріалів.' },
  { title: 'Узгодьте деталі виконання', text: 'Домовтеся про деталі робіт перед початком.' },
];

export const faq = [
  {
    q: 'Як дізнатися вартість робіт?',
    a: 'Вартість залежить від обсягу, складності робіт і матеріалів. Зателефонуйте й опишіть завдання: уточнимо обсяг та назвемо орієнтовну вартість.',
  },
  {
    q: 'Чи працюєте ви в моєму районі?',
    a: 'Ми працюємо в Черкасах та області. Зателефонуйте, щоб підтвердити, чи зможемо виконати роботу за вашою адресою.',
  },
  {
    q: 'Що розповісти, якщо потрібен сантехнік?',
    a: 'Коротко опишіть завдання: що потрібно встановити, замінити чи підключити, і де саме, у квартирі чи будинку.',
  },
  {
    q: 'Які електромонтажні роботи ви виконуєте?',
    a: 'Електромонтажні роботи, заміну проводки, встановлення електрощитів, світильників, розеток і вимикачів, а також дрібний ремонт електрики.',
  },
  {
    q: 'Чи можна обговорити встановлення сонячних панелей?',
    a: 'Так. Зателефонуйте й опишіть завдання, і ми обговоримо, що саме потрібно зробити.',
  },
  {
    q: 'Що підготувати перед дзвінком?',
    a: 'Зазвичай достатньо коротко описати завдання та сказати, де потрібна робота, у квартирі чи будинку. Інші деталі уточнимо під час розмови.',
  },
];

export const gallery = [
  { file: 'illustration-plumbing', alt: 'Ілюстрація: водонагрівач і труби на стіні', caption: 'Водонагрівач і труби' },
  { file: 'illustration-electrical', alt: 'Ілюстрація: електрощит із проводами', caption: 'Електрощит і проводка' },
  { file: 'illustration-solar', alt: 'Ілюстрація: сонячні панелі на даху будинку', caption: 'Сонячні панелі на даху' },
];

/** Телефони для показу: порядок = порядок кнопок. */
export function visiblePhones(): Phone[] {
  const list: Phone[] = [...site.phones.andriy];
  if (site.flags.showOlesPhone) list.push(site.phones.oles);
  return list;
}
