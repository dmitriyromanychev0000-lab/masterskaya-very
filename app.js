const loadWorkshopFonts = () => {
  if (document.querySelector('link[data-workshop-fonts]')) return;

  const addPreconnect = (href, crossOrigin = false) => {
    if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    if (crossOrigin) link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  };

  addPreconnect('https://fonts.googleapis.com');
  addPreconnect('https://fonts.gstatic.com', true);

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap';
  stylesheet.media = 'print';
  stylesheet.dataset.workshopFonts = 'true';
  stylesheet.addEventListener('load', () => {
    stylesheet.media = 'all';
  }, { once: true });
  document.head.appendChild(stylesheet);
};

loadWorkshopFonts();

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

const setMenuState = (open, { focusMenu = false, restoreFocus = false } = {}) => {
  if (!menuButton || !mobileMenu) return;

  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  mobileMenu.hidden = !open;
  document.documentElement.classList.toggle('menu-open', open);
  document.body.classList.toggle('menu-open', open);

  if (open && focusMenu) {
    mobileMenu.querySelector('a')?.focus();
  }

  if (!open && restoreFocus) {
    menuButton.focus();
  }
};

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  setMenuState(open, { focusMenu: open });
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

mobileMenu?.addEventListener('click', (event) => {
  if (event.target === mobileMenu) {
    setMenuState(false, { restoreFocus: true });
  }
});

document.addEventListener('keydown', (event) => {
  const menuOpen = menuButton?.getAttribute('aria-expanded') === 'true';
  if (!menuOpen) return;

  if (event.key === 'Escape') {
    setMenuState(false, { restoreFocus: true });
    return;
  }

  if (event.key !== 'Tab' || !mobileMenu || !menuButton) return;

  const focusable = [
    menuButton,
    ...mobileMenu.querySelectorAll('a[href], button:not([disabled])')
  ].filter((node) => !node.hidden);

  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980 && menuButton?.getAttribute('aria-expanded') === 'true') {
    setMenuState(false);
  }
});

const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

const SITE_BASE_URL = 'https://dmitriyromanychev0000-lab.github.io/masterskaya-very/';

const setMetaValue = (selector, attribute, value, createTag = 'meta') => {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement(createTag);
    if (createTag === 'meta') {
      if (selector.includes('property=')) {
        node.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
      } else if (selector.includes('name=')) {
        node.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
      }
    } else if (createTag === 'link' && selector.includes('rel=')) {
      node.setAttribute('rel', selector.match(/rel="([^"]+)"/)?.[1] || '');
    }
    document.head.appendChild(node);
  }
  node.setAttribute(attribute, value);
};

const setDynamicPageMeta = ({ title, description, url, indexable = true }) => {
  document.title = title;
  setMetaValue('meta[name="description"]', 'content', description);
  setMetaValue('meta[name="robots"]', 'content', indexable ? 'index,follow' : 'noindex,follow');
  setMetaValue('meta[property="og:title"]', 'content', title);
  setMetaValue('meta[property="og:description"]', 'content', description);
  setMetaValue('meta[property="og:url"]', 'content', url);
  setMetaValue('meta[name="twitter:title"]', 'content', title);
  setMetaValue('meta[name="twitter:description"]', 'content', description);
  setMetaValue('link[rel="canonical"]', 'href', url, 'link');
  const canonical = document.head.querySelector('link[rel="canonical"]');
  canonical?.setAttribute('rel', 'canonical');
};

const RESIDENT_MEDIA = {
  'nutcracker': { direct: 'assets/residents/peaceful/nutcracker.webp' },
  'mari': { direct: 'assets/residents/peaceful/mari.webp' },
  'mouse-queen': { direct: 'assets/residents/peaceful/mouse-queen.webp' },
  'mouse-king': { direct: 'assets/residents/peaceful/mouse-king.webp' },
  'forest-dragon': { direct: 'assets/residents/peaceful/forest-dragon.webp' },
  'mushrooms': { direct: 'assets/residents/peaceful/mushrooms.webp' },
  'azimondias': { direct: 'assets/residents/peaceful/azimondias.webp' },
  'baby-dragon': { direct: 'assets/residents/peaceful/baby-dragon.webp' },
  'soul-regan': { direct: 'assets/residents/peaceful/soul-regan.webp' },
  'gorynych-2': { direct: 'assets/residents/peaceful/gorynych-2.webp' },
  'gorynych': { direct: 'assets/residents/peaceful/gorynych.webp' },
  'sirin': { direct: 'assets/residents/peaceful/sirin.webp' },
  'mermaid': { direct: 'assets/residents/peaceful/mermaid.webp' },
  'humpbacked-horse': { direct: 'assets/residents/peaceful/humpbacked-horse.webp' },
  'hen': { direct: 'assets/residents/peaceful/hen.webp' },
  'rocking-horse': { direct: 'assets/residents/peaceful/rocking-horse.webp' },
  'puss-in-boots': { direct: 'assets/process/05-compare-side.jpg' }
};

const residentPhotoMarkup = (slug, name, extraClass = '', decorative = false) => {
  const media = RESIDENT_MEDIA[slug];
  if (!media) return '';
  const classes = media.direct
    ? `resident-photo resident-photo-direct ${extraClass}`
    : `resident-photo resident-photo-g${media.group} resident-photo-p${media.pos} ${extraClass}`;
  const style = media.direct ? ` style="background-image:url('${media.direct}')"` : '';
  const accessibility = decorative
    ? 'aria-hidden="true"'
    : `role="img" aria-label="${escapeHtml(name)} — фигурка ручной работы"`;
  return `<span class="${classes.trim()}" ${accessibility}${style}></span>`;
};

const COLLECTION_WORLDS = {
  winter: {
    title: 'Зимние легенды',
    description: 'Синий вечер, снег на еловых лапах и тёплый свет в окне. Мир, где ждут чуда и слышат музыку.',
    tone: 'night',
    cartouche: 'assets/worlds/cartouche-winter.webp',
    residents: [
      { name: 'Щелкунчик', status: 'available', price: '3000 ₽', stock: 'готово: 1', chronicle: 'nutcracker' },
      { name: 'Мари (девочка с Щелкунчиком)', status: 'progress', chronicle: 'mari' },
      { name: 'Мышиная Королева', status: 'progress', chronicle: 'mouse-queen' },
      { name: 'Мышиный Король', status: 'available', price: '4500 ₽', stock: 'готово: 4', chronicle: 'mouse-king' }
    ]
  },
  forest: {
    title: 'Тайны древнего леса',
    description: 'Сумрак между корнями, мох, папоротник и огоньки, которые зажигаются сами. Здесь говорят вполголоса.',
    tone: 'night',
    cartouche: 'assets/worlds/cartouche-forest.webp',
    residents: [
      { name: 'Лесной дракон', status: 'available', price: '13100 ₽', chronicle: 'forest-dragon' },
      { name: 'Лесные грибы (набор)', status: 'available', price: '1500 ₽ за штуку', chronicle: 'mushrooms' }
    ]
  },
  dragons: {
    title: 'Древние существа',
    description: 'Чешуя, крылья и память о временах, которых не застал никто. Мир тех, кто старше сказок.',
    tone: 'paper',
    cartouche: 'assets/worlds/cartouche-dragons.webp',
    residents: [
      { name: 'Азимондиас', status: 'archive', chronicle: 'azimondias' },
      { name: 'Малыш-дракон', status: 'progress', chronicle: 'baby-dragon' },
      { name: 'Соул Реган', status: 'progress', chronicle: 'soul-regan' }
    ]
  },
  russian: {
    title: 'Русские сказки',
    description: 'Резной терем, синие цветы по золоту и вязь до самого вечера. Мир, где сказку рассказывают на ночь.',
    tone: 'night',
    cartouche: 'assets/worlds/cartouche-russian.webp',
    residents: [
      { name: 'Змей Горыныч II', status: 'available', price: '6500 ₽', chronicle: 'gorynych-2' },
      { name: 'Змей Горыныч', status: 'progress', chronicle: 'gorynych' },
      { name: 'Птица Сирин', status: 'available', price: '3500 ₽', chronicle: 'sirin' },
      { name: 'Русалка', status: 'progress', chronicle: 'mermaid' },
      { name: 'Конёк-Горбунок', status: 'available', price: '4000 ₽', stock: 'готово: 2', chronicle: 'humpbacked-horse' }
    ]
  },
  home: {
    title: 'Домашние легенды',
    description: 'Солнце на деревянном полу, лён и тишина. Не каждая легенда должна рычать.',
    tone: 'paper',
    residents: [
      { name: 'Курочка', status: 'available', price: '2000 ₽', chronicle: 'hen' },
      { name: 'Солнечная лошадка-качалка', status: 'available', price: '3500 ₽', chronicle: 'rocking-horse' },
      { name: 'Кот в сапогах', status: 'available', price: '5500 ₽', chronicle: 'puss-in-boots' }
    ]
  }
};

const COLLECTION_STATUS = {
  available: { label: 'Можно приобрести', modifier: 'resident-status-available', button: 'primary' },
  progress: { label: 'В работе', modifier: 'resident-status-progress', button: 'outline' },
  archive: { label: 'Нашёл Хранителя', modifier: 'resident-status-archive', button: null }
};

const syncAboutStats = () => {
  const statNodes = document.querySelectorAll('[data-about-stat]');
  if (!statNodes.length) return;

  const worlds = Object.values(COLLECTION_WORLDS);
  const residents = worlds.flatMap((world) => world.residents);
  const values = {
    residents: residents.length,
    worlds: worlds.length,
    available: residents.filter((resident) => resident.status === 'available').length,
    archive: residents.filter((resident) => resident.status === 'archive').length
  };

  statNodes.forEach((node) => {
    const key = node.dataset.aboutStat;
    if (Object.hasOwn(values, key)) node.textContent = String(values[key]);
  });
};

syncAboutStats();

const syncResidentsAvailable = () => {
  const node = document.querySelector('[data-residents-available]');
  if (!node) return;

  const residents = Object.values(COLLECTION_WORLDS).flatMap((world) => world.residents);
  node.textContent = String(residents.filter((resident) => resident.status === 'available').length);
};

syncResidentsAvailable();

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

const formatPrice = (value = '') => escapeHtml(value).replace(/ (?=₽)/g, '&nbsp;');

const COLLECTION_RESIDENT_BY_SLUG = new Map(
  Object.values(COLLECTION_WORLDS)
    .flatMap((world) => world.residents)
    .map((resident) => [resident.chronicle, resident])
);

const parseSchemaPrice = (value = '') => {
  const match = String(value).replace(/\s/g, '').match(/\d+(?:[.,]\d+)?/);
  return match ? match[0].replace(',', '.') : null;
};

const setStructuredData = (key, payload) => {
  let node = document.head.querySelector(`script[data-schema="${key}"]`);
  if (!node) {
    node = document.createElement('script');
    node.type = 'application/ld+json';
    node.dataset.schema = key;
    document.head.appendChild(node);
  }
  node.textContent = JSON.stringify(payload);
};

const clearStructuredData = (key) => {
  document.head.querySelector(`script[data-schema="${key}"]`)?.remove();
};

const schemaImageForResident = (slug) => {
  const media = RESIDENT_MEDIA[slug];
  return media?.direct ? SITE_BASE_URL + media.direct : null;
};

const initResidentsStructuredData = () => {
  if (!document.querySelector('.residents-intro')) return;

  const residents = Object.values(COLLECTION_WORLDS).flatMap((world) => world.residents);
  setStructuredData('residents', {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Жители Мастерской Веры',
    numberOfItems: residents.length,
    itemListElement: residents.map((resident, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: resident.name,
      url: SITE_BASE_URL + `chronicle.html?resident=${encodeURIComponent(resident.chronicle)}`
    }))
  });
};

initResidentsStructuredData();

const residentsWord = (count) => {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'Жителей';
  if (mod10 === 1) return 'Житель';
  if (mod10 >= 2 && mod10 <= 4) return 'Жителя';
  return 'Жителей';
};

const renderWorldResidentRow = (resident) => {
  const status = COLLECTION_STATUS[resident.status] || COLLECTION_STATUS.progress;
  const isArchive = resident.status === 'archive';
  const price = resident.price || 'Цена по запросу';
  const stock = resident.stock ? ` · ${escapeHtml(resident.stock)}` : '';
  const meta = isArchive
    ? escapeHtml(status.label)
    : `${escapeHtml(status.label)} · ${formatPrice(price)}${stock}`;

  return `
        <a class="world-resident-row" href="chronicle.html?resident=${escapeHtml(resident.chronicle)}">
          <span class="world-resident-thumb">
            ${residentPhotoMarkup(resident.chronicle, resident.name, 'world-resident-photo')}
          </span>
          <span class="world-resident-copy">
            <h3>${escapeHtml(resident.name)}</h3>
            <span class="world-resident-meta">${meta}</span>
          </span>
          <span class="world-resident-arrow" aria-hidden="true">→</span>
        </a>`;
};


const renderCollectionCta = () => `
    <section class="keeper-cta collection-cta">
      <h2>Понравился кто-то из этого Мира?</h2>
      <p>Напишите Вере — она расскажет о размере, сроках и стоимости.</p>
      <div class="collection-cta-actions">
        <a class="button button-primary" href="https://t.me/masterskayaver">Написать Вере</a>
        <a class="button button-outline" href="residents.html">Смотреть всех Жителей</a>
      </div>
    </section>`;

const renderCollectionNotFound = () => `
    <section class="collection-intro collection-intro--paper collection-notfound">
      <a class="collection-back" href="index.html#worlds"><span aria-hidden="true">←</span> К Мирам на главной</a>
      <div class="collection-head">
        <div class="collection-eyebrow">
          <p class="eyebrow">Мир не найден</p>
        </div>
        <h1>Такого Мира пока нет</h1>
        <p class="collection-lead">Возможно, ссылка устарела или Мир ещё не открыт. Загляните ко всем Жителям мастерской — там точно кто-то ждёт.</p>
        <p class="collection-actions"><a class="button button-primary" href="residents.html">Смотреть всех Жителей</a></p>
      </div>
    </section>`;

const initCollection = () => {
  const root = document.querySelector('[data-collection-root]');
  if (!root) return;

  const slug = new URLSearchParams(window.location.search).get('world');
  const world = slug ? COLLECTION_WORLDS[slug] : null;

  if (!world) {
    root.removeAttribute('data-world');
    setDynamicPageMeta({
      title: 'Мир не найден — Мастерская Веры',
      description: 'Такого Мира мастерской пока нет.',
      url: SITE_BASE_URL + 'collection.html',
      indexable: false
    });
    root.innerHTML = renderCollectionNotFound();
    return;
  }

  root.dataset.world = slug;
  const countLabel = `${world.residents.length} ${residentsWord(world.residents.length)}`;
  setDynamicPageMeta({
    title: `${world.title} — Мастерская Веры`,
    description: world.description,
    url: SITE_BASE_URL + `collection.html?world=${encodeURIComponent(slug)}`
  });
  const featured = world.residents[0];

  root.innerHTML = `
    <section class="collection-intro collection-intro--${world.tone}">
      <a class="collection-back" href="index.html#worlds"><span aria-hidden="true">←</span> К Мирам на главной</a>

      <div class="collection-hero-grid">
        <div class="collection-head">
          <div class="collection-eyebrow">
            <p class="eyebrow">Мир мастерской</p>
            <span class="collection-count">${countLabel}</span>
          </div>
          <h1>${escapeHtml(world.title)}</h1>
          <p class="collection-lead">${escapeHtml(world.description)}</p>
          ${world.cartouche ? `<img class="world-cartouche" src="${escapeHtml(world.cartouche)}" alt="" aria-hidden="true" width="1100" height="688" decoding="async">` : ''}
        </div>

        <a class="world-feature" href="chronicle.html?resident=${escapeHtml(featured.chronicle)}" aria-label="Открыть Хронику: ${escapeHtml(featured.name)}">
          ${residentPhotoMarkup(featured.chronicle, featured.name, 'world-feature-photo')}
          <span class="world-feature-caption">
            <span class="world-feature-kicker">Житель этого Мира</span>
            <strong>${escapeHtml(featured.name)}</strong>
          </span>
        </a>
      </div>

      <a class="world-jump" href="#world-residents">К Жителям Мира <span aria-hidden="true">↓</span></a>
    </section>

    <section class="collection-world-residents" id="world-residents">
      <div class="collection-world-residents-head">
        <p class="eyebrow">Все Жители этого Мира</p>
        <h2>${escapeHtml(world.title)}</h2>
      </div>
      <div class="world-resident-list">
${world.residents.map(renderWorldResidentRow).join('')}
      </div>
    </section>

${renderCollectionCta()}`;
};

initCollection();

const CHRONICLE_RESIDENTS = {
  'nutcracker': {
    name: 'Щелкунчик',
    world: 'winter',
    status: 'available',
    price: '3000 ₽',
    stock: 'готово: 1',
    story: 'Зимняя история с ровной осанкой, мундиром и очень серьёзной задачей — беречь чудо.'
  },
  'mouse-king': {
    name: 'Мышиный Король',
    world: 'winter',
    status: 'available',
    price: '4500 ₽',
    stock: 'готово: 4',
    story: 'Корона, мундир и трое внимательных голов — королевство в ладони.'
  },
  'mari': {
    name: 'Мари (девочка с Щелкунчиком)',
    world: 'winter',
    status: 'progress',
    story: 'Тихая зимняя сцена: девочка прижимает к себе Щелкунчика, будто уже знает, чем закончится сказка.'
  },
  'mouse-queen': {
    name: 'Мышиная Королева',
    world: 'winter',
    status: 'progress',
    story: 'Три взгляда, чёрно-фиолетовое платье и корона — всё в ней говорит без спешки.'
  },
  'forest-dragon': {
    name: 'Лесной дракон',
    world: 'forest',
    status: 'available',
    price: '13100 ₽',
    story: 'Зелёный дракон с природной палитрой и множеством деталей, которые открываются при близком взгляде.'
  },
  'mushrooms': {
    name: 'Лесные грибы (набор)',
    world: 'forest',
    status: 'available',
    price: '1500 ₽ за штуку',
    story: 'Мухоморы, лисички, белые и другие грибы — небольшие ручные миниатюры с живой фактурой.'
  },
  'azimondias': {
    name: 'Азимондиас',
    world: 'dragons',
    status: 'archive',
    story: 'Первый Житель, который уехал к своему Хранителю. Этот экземпляр уже дома и остаётся в Хрониках мастерской.'
  },
  'baby-dragon': {
    name: 'Малыш-дракон',
    world: 'dragons',
    status: 'progress',
    story: 'Маленький дракон только рождается — крылья ещё сложены, а характер уже виден.'
  },
  'soul-regan': {
    name: 'Соул Реган',
    world: 'dragons',
    status: 'progress',
    story: 'Древнее существо со своим именем и своей тишиной — то, что помнит больше, чем говорит.'
  },
  'gorynych-2': {
    name: 'Змей Горыныч II',
    world: 'russian',
    status: 'available',
    price: '6500 ₽',
    story: 'Второе воплощение старой сказки — та же легенда, новый характер.'
  },
  'gorynych': {
    name: 'Змей Горыныч',
    world: 'russian',
    status: 'progress',
    story: 'Трёхглавый герой русских сказок рождается заново — со своим нравом и своей историей.'
  },
  'sirin': {
    name: 'Птица Сирин',
    world: 'russian',
    status: 'available',
    price: '3500 ₽',
    story: 'Райская птица из старых сказаний — тихая, яркая, неспешная.'
  },
  'mermaid': {
    name: 'Русалка',
    world: 'russian',
    status: 'progress',
    story: 'Русалка из русских сказок — ждёт своего часа, чтобы показаться во всей красе.'
  },
  'humpbacked-horse': {
    name: 'Конёк-Горбунок',
    world: 'russian',
    status: 'available',
    price: '4000 ₽',
    stock: 'готово: 2',
    story: 'Верный спутник из старой сказки — маленький, горбатый и по-настоящему сказочный.',
    gallery: [
      { sprite: 'assets/residents/studio/humpbacked-horse.webp', position: '0% 0%', alt: 'Конёк-Горбунок — студийный ракурс 1' },
      { sprite: 'assets/residents/studio/humpbacked-horse.webp', position: '33.333% 0%', alt: 'Конёк-Горбунок — студийный ракурс 2' },
      { sprite: 'assets/residents/studio/humpbacked-horse.webp', position: '66.667% 0%', alt: 'Конёк-Горбунок — студийный ракурс 3' },
      { sprite: 'assets/residents/studio/humpbacked-horse.webp', position: '100% 0%', alt: 'Конёк-Горбунок — студийный ракурс 4' },
      { sprite: 'assets/residents/studio/humpbacked-horse.webp', position: '0% 100%', alt: 'Конёк-Горбунок — студийный ракурс 5' },
      { sprite: 'assets/residents/studio/humpbacked-horse.webp', position: '33.333% 100%', alt: 'Конёк-Горбунок — студийный ракурс 6' },
      { sprite: 'assets/residents/studio/humpbacked-horse.webp', position: '66.667% 100%', alt: 'Конёк-Горбунок — студийный ракурс 7' },
      { sprite: 'assets/residents/studio/humpbacked-horse.webp', position: '100% 100%', alt: 'Конёк-Горбунок — студийный ракурс 8' }
    ]
  },
  'hen': {
    name: 'Курочка',
    world: 'home',
    status: 'available',
    price: '2000 ₽',
    story: 'Не всякая легенда должна рычать: некоторые просто выходят на свет и смотрят прямо.'
  },
  'rocking-horse': {
    name: 'Солнечная лошадка-качалка',
    world: 'home',
    status: 'available',
    price: '3500 ₽',
    story: 'Белая лошадка с золотой гривой и яркой росписью — маленькая домашняя история о движении и детстве.'
  },
  'puss-in-boots': {
    name: 'Кот в сапогах',
    world: 'home',
    status: 'available',
    price: '5500 ₽',
    story: 'Рыжий, в плаще и сапогах, с воротником по моде своего века — тот самый кот, который выигрывает не силой, а хитростью.'
  }
};

const renderChronicleHero = (resident, slug, worldTitle) => {
  const status = COLLECTION_STATUS[resident.status] || COLLECTION_STATUS.progress;
  const isArchive = resident.status === 'archive';
  const price = isArchive ? '' : resident.price || 'Цена по запросу';
  const stock = !isArchive && resident.stock ? `<span class="resident-stock">${escapeHtml(resident.stock)}</span>` : '';
  const priceMarkup = price ? `<span class="chronicle-price">${formatPrice(price)}${stock}</span>` : '';

  const action = isArchive
    ? '<p class="chronicle-archive-note">Этот экземпляр уже нашёл своего Хранителя</p>'
    : `<div class="chronicle-actions" data-chronicle-action>
          <a class="button button-${status.button || 'primary'}" href="https://t.me/masterskayaver">Написать Вере</a>
        </div>`;

  return `
    <section class="collection-intro collection-intro--night chronicle-hero">
      <div class="chronicle-hero-shell">
        <div class="chronicle-hero-inner">
          <a class="collection-back" href="index.html#worlds"><span aria-hidden="true">←</span> К Мирам на главной</a>
          <div class="collection-eyebrow">
            <p class="eyebrow">Хроника Жителя</p>
            <a class="collection-count chronicle-world" href="collection.html?world=${escapeHtml(resident.world)}">${escapeHtml(worldTitle)}</a>
          </div>
          <h1>${escapeHtml(resident.name)}</h1>
          <div class="chronicle-badges">
            <span class="resident-status ${status.modifier}">${status.label}</span>
            ${priceMarkup}
          </div>
          ${action}
        </div>

        <div class="chronicle-hero-visual">
          ${residentPhotoMarkup(slug, resident.name, 'chronicle-hero-photo')}
        </div>
      </div>
    </section>`;
};

const renderChronicleNeighbors = (slug, resident) => {
  const residents = COLLECTION_WORLDS[resident.world]?.residents || [];
  const index = residents.findIndex((item) => item.chronicle === slug);
  if (index < 0 || residents.length < 2) return '';

  const previous = residents[(index - 1 + residents.length) % residents.length];
  const next = residents[(index + 1) % residents.length];
  const links = previous.chronicle === next.chronicle
    ? [{ resident: next, direction: 'next', label: 'Следующий Житель' }]
    : [
        { resident: previous, direction: 'previous', label: 'Предыдущий Житель' },
        { resident: next, direction: 'next', label: 'Следующий Житель' }
      ];

  return `
    <nav class="chronicle-neighbors${links.length === 1 ? ' chronicle-neighbors--single' : ''}" aria-label="Другие Жители этого Мира">
      ${links.map(({ resident: item, direction, label }) => `
        <a class="chronicle-neighbor chronicle-neighbor--${direction}" href="chronicle.html?resident=${escapeHtml(item.chronicle)}">
          <span>${direction === 'previous' ? '← ' : ''}${label}${direction === 'next' ? ' →' : ''}</span>
          <strong>${escapeHtml(item.name)}</strong>
        </a>`).join('')}
    </nav>`;
};

const renderChronicleGallery = (resident) => {
  if (!resident.gallery?.length) return '';

  const items = resident.gallery.map((image, index) => {
    const visual = image.sprite
      ? `<span class="chronicle-gallery-sprite" role="img" aria-label="${escapeHtml(image.alt)}" style="--gallery-sprite:url('${escapeHtml(image.sprite)}');--gallery-position:${escapeHtml(image.position || '0% 0%')}"></span>`
      : `<img src="${image.src}" alt="${escapeHtml(image.alt)}" width="320" height="320" loading="lazy" decoding="async">`;

    return `
          <button class="chronicle-gallery-item" type="button" data-chronicle-gallery-item="${index}" aria-label="Открыть студийный ракурс: ${escapeHtml(resident.name)}">
            ${visual}
            <span class="chronicle-gallery-open-label">Открыть крупнее</span>
          </button>`;
  }).join('');

  return `
    <section class="chronicle-gallery" aria-labelledby="chronicle-gallery-title">
      <div class="chronicle-gallery-shell">
        <div class="chronicle-gallery-head">
          <p class="eyebrow">Без декораций</p>
          <h2 id="chronicle-gallery-title">Рассмотреть ближе</h2>
          <p>Студийные кадры показывают саму работу без постановочного Мира.</p>
        </div>
        <div class="chronicle-gallery-grid">${items}</div>
      </div>
      <dialog class="chronicle-lightbox" data-chronicle-lightbox aria-label="Увеличенный студийный ракурс">
        <button class="chronicle-lightbox-close" type="button" data-chronicle-lightbox-close aria-label="Закрыть изображение">×</button>
        <div class="chronicle-lightbox-image" data-chronicle-lightbox-image role="img"></div>
      </dialog>
    </section>`;
};

const renderChronicleNext = (slug, resident) => {
  const neighbors = renderChronicleNeighbors(slug, resident);

  if (resident.status === 'archive') {
    return `
    <section class="keeper-cta chronicle-next">
      <h2>Что дальше</h2>
      <p>Этот Житель уже нашёл дом. Может, среди свободных есть тот, кто ждёт вас</p>
      ${neighbors}
      <div class="chronicle-next-actions">
        <a class="button button-primary" href="residents.html">Смотреть свободных Жителей</a>
      </div>
    </section>`;
  }

  const text = resident.status === 'progress'
    ? 'Работа ещё идёт. Напишите Вере — она расскажет о сроках и поможет забронировать.'
    : 'Напишите Вере — она расскажет о размере, сроках и доставке.';

  return `
    <section class="keeper-cta chronicle-next">
      <h2>Что дальше</h2>
      <p>${text}</p>
      ${neighbors}
      <div class="chronicle-next-actions">
        <a class="button button-primary" href="https://t.me/masterskayaver">Написать Вере</a>
        <a class="button button-outline" href="residents.html">Все Жители</a>
      </div>
    </section>`;
};

const renderChronicleNotFound = () => `
    <section class="collection-intro collection-intro--paper collection-notfound">
      <a class="collection-back" href="index.html#worlds"><span aria-hidden="true">←</span> К Мирам на главной</a>
      <div class="collection-head">
        <div class="collection-eyebrow">
          <p class="eyebrow">Житель не найден</p>
        </div>
        <h1>Такого Жителя пока нет</h1>
        <p class="collection-lead">Возможно, ссылка устарела или Житель ещё не родился. Загляните ко всем Жителям мастерской — там точно кто-то ждёт.</p>
        <p class="collection-actions"><a class="button button-primary" href="residents.html">Смотреть всех Жителей</a></p>
      </div>
    </section>`;

const renderChronicle = (slug, resident) => {
  const world = COLLECTION_WORLDS[resident.world];
  const worldTitle = world ? world.title : 'Мир мастерской';
  const isArchive = resident.status === 'archive';

  const sticky = isArchive ? '' : `
    <div class="chronicle-sticky" data-chronicle-sticky>
      <div class="chronicle-sticky-inner">
        <div class="chronicle-sticky-copy">
          <span class="chronicle-sticky-name">${escapeHtml(resident.name)}</span>
          <span class="chronicle-sticky-price">${formatPrice(resident.price || 'Цена по запросу')}</span>
        </div>
        <a class="button button-primary button-small" href="https://t.me/masterskayaver">Написать Вере</a>
      </div>
    </div>`;

  const status = COLLECTION_STATUS[resident.status] || COLLECTION_STATUS.progress;

  return `
    ${renderChronicleHero(resident, slug, worldTitle)}

    <section class="chronicle-section chronicle-story">
      <div class="chronicle-story-layout">
        <div class="chronicle-story-copy">
          <h2 class="eyebrow">Хроника</h2>
          <p class="chronicle-text">${escapeHtml(resident.story)}</p>
        </div>

        <dl class="chronicle-facts">
          <div>
            <dt>Мир</dt>
            <dd><a href="collection.html?world=${escapeHtml(resident.world)}">${escapeHtml(worldTitle)}</a></dd>
          </div>
          <div>
            <dt>Статус</dt>
            <dd>${escapeHtml(status.label)}</dd>
          </div>
          <div>
            <dt>Материалы</dt>
            <dd>Полимерная глина, акриловая роспись</dd>
          </div>
          <div>
            <dt>Работа</dt>
            <dd>Ручная лепка и роспись</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="chronicle-archive-chapters" aria-label="Из Хроник мастерской">
      <div class="chronicle-archive-chapters-grid">
        <article class="chronicle-archive-card">
          <p class="eyebrow">Из процесса</p>
          <h2>Когда работа берёт власть в свои лапы</h2>
          <p>Иногда Житель рождается не по плану: пока Вера прорабатывает мелочи, форма сама меняет направление.</p>
          <a class="chronicle-archive-link" href="process.html">Как это было <span aria-hidden="true">↗</span></a>
        </article>
        <article class="chronicle-archive-card">
          <p class="eyebrow">Встреча</p>
          <h2>Житель приезжает как маленькая церемония встречи</h2>
          <p>Коробка, наполнитель, открытка и Свиток Жителя делают встречу частью истории, а не просто доставкой.</p>
          <a class="chronicle-archive-link" href="about.html#faq-delivery">О доставке <span aria-hidden="true">↗</span></a>
        </article>
      </div>
      ${isArchive ? `
      <p class="chronicle-archive-memory">Каждого Жителя, который уехал к своему Хранителю, Мастерская запоминает: точной копии не будет, но история остаётся здесь.</p>
      ` : ''}
    </section>

    ${renderChronicleGallery(resident)}
    ${renderChronicleNext(slug, resident)}
    ${sticky}`;
};

const initChronicleGallery = (resident) => {
  if (!resident.gallery?.length) return;

  const dialog = document.querySelector('[data-chronicle-lightbox]');
  const image = dialog?.querySelector('[data-chronicle-lightbox-image]');
  const closeButton = dialog?.querySelector('[data-chronicle-lightbox-close]');
  const buttons = [...document.querySelectorAll('[data-chronicle-gallery-item]')];
  if (!dialog || !image || !closeButton || !buttons.length) return;

  let trigger = null;

  const close = () => {
    if (dialog.open) dialog.close();
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.chronicleGalleryItem);
      const item = resident.gallery[index];
      if (!item) return;

      trigger = button;
      image.style.backgroundImage = `url("${item.sprite || item.src}")`;
      image.style.backgroundSize = item.sprite ? '400% 200%' : 'contain';
      image.style.backgroundPosition = item.sprite ? (item.position || '0% 0%') : 'center';
      image.style.backgroundRepeat = 'no-repeat';
      image.setAttribute('aria-label', item.alt || resident.name);
      dialog.showModal();
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener('close', () => {
    image.style.backgroundImage = '';
    image.style.backgroundSize = '';
    image.style.backgroundPosition = '';
    image.removeAttribute('aria-label');
    trigger?.focus();
    trigger = null;
  });
};


const initChronicleSticky = () => {
  const heroAction = document.querySelector('[data-chronicle-action]');
  const sticky = document.querySelector('[data-chronicle-sticky]');
  const nextAction = document.querySelector('.chronicle-next');
  if (!heroAction || !sticky) return;

  let heroActionOutOfView = false;
  let nextActionInView = false;

  const sync = () => {
    sticky.classList.toggle('is-visible', heroActionOutOfView && !nextActionInView);
  };

  const heroObserver = new IntersectionObserver(([entry]) => {
    heroActionOutOfView = !entry.isIntersecting;
    sync();
  }, { threshold: 0 });

  heroObserver.observe(heroAction);

  if (nextAction) {
    const nextObserver = new IntersectionObserver(([entry]) => {
      nextActionInView = entry.isIntersecting;
      sync();
    }, { threshold: 0 });

    nextObserver.observe(nextAction);
  }
};

const initChronicle = () => {
  const root = document.querySelector('[data-chronicle-root]');
  if (!root) return;

  const slug = new URLSearchParams(window.location.search).get('resident');
  const resident = slug ? CHRONICLE_RESIDENTS[slug] : null;

  if (!resident) {
    root.removeAttribute('data-world');
    clearStructuredData('product');
    setDynamicPageMeta({
      title: 'Житель не найден — Мастерская Веры',
      description: 'Такого Жителя в Хрониках мастерской пока нет.',
      url: SITE_BASE_URL + 'chronicle.html',
      indexable: false
    });
    root.innerHTML = renderChronicleNotFound();
    return;
  }

  root.dataset.world = resident.world;

  setDynamicPageMeta({
    title: `${resident.name} — Мастерская Веры`,
    description: resident.story,
    url: SITE_BASE_URL + `chronicle.html?resident=${encodeURIComponent(slug)}`
  });

  const world = COLLECTION_WORLDS[resident.world];
  const productUrl = SITE_BASE_URL + `chronicle.html?resident=${encodeURIComponent(slug)}`;
  const product = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: resident.name,
    description: resident.story,
    url: productUrl,
    category: world?.title || 'Жители Мастерской Веры',
    brand: { '@type': 'Brand', name: 'Мастерская Веры' },
    manufacturer: {
      '@type': 'Organization',
      name: 'Мастерская Веры',
      url: SITE_BASE_URL
    }
  };

  const productImage = schemaImageForResident(slug);
  if (productImage) product.image = productImage;

  if (resident.status === 'available' && resident.price) {
    const numericPrice = parseSchemaPrice(resident.price);
    if (numericPrice) {
      product.offers = {
        '@type': 'Offer',
        url: productUrl,
        priceCurrency: 'RUB',
        price: numericPrice,
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Мастерская Веры',
          url: SITE_BASE_URL
        }
      };
    }
  }

  setStructuredData('product', product);
  root.innerHTML = renderChronicle(slug, resident);
  initChronicleGallery(resident);
  initChronicleSticky();
};

initChronicle();

const initContactMessageForm = () => {
  const form = document.querySelector('[data-contact-message-form]');
  if (!form) return;

  const status = form.querySelector('[data-contact-form-status]');

  const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const reply = String(data.get('reply') || '').trim();
    const message = String(data.get('message') || '').trim();
    const text = [
      'Здравствуйте! Пишу с сайта Мастерской Веры.',
      '',
      `Меня зовут: ${name}`,
      `Как ответить: ${reply}`,
      '',
      message
    ].join('\n');

    const telegramWindow = window.open('https://t.me/masterskayaver', '_blank', 'noopener');

    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        copied = true;
      } else {
        copied = fallbackCopy(text);
      }
    } catch {
      copied = fallbackCopy(text);
    }

    if (status) {
      status.textContent = copied
        ? 'Текст скопирован. Вставьте его в открывшийся Telegram.'
        : 'Telegram открыт. Скопируйте текст из полей формы вручную.';
    }

    if (!telegramWindow && status) {
      status.textContent += ' Если вкладка не открылась, используйте кнопку Telegram слева.';
    }
  });
};

initContactMessageForm();



const RESIDENT_SLUG_BY_NAME = Object.fromEntries(
  Object.entries(CHRONICLE_RESIDENTS).map(([slug, resident]) => [resident.name, slug])
);

const hydrateStaticResidentMedia = () => {
  document.querySelectorAll('.resident-card, .keeper-card').forEach((card) => {
    const heading = card.querySelector('h3, h4');
    const media = card.querySelector('.resident-media, .keeper-media');
    if (!heading || !media) return;

    const name = heading.textContent.trim();
    const slug = RESIDENT_SLUG_BY_NAME[name];
    if (!slug || media.querySelector('.resident-photo')) return;

    media.querySelectorAll('img').forEach((node) => node.remove());
    media.insertAdjacentHTML('afterbegin', residentPhotoMarkup(slug, name));
  });
};

hydrateStaticResidentMedia();

const syncStaticResidentCards = () => {
  const cards = [...document.querySelectorAll('.resident-card')];
  if (!cards.length) return;

  cards.forEach((card) => {
    const chronicleLink = card.querySelector('.resident-actions .text-link[href*="chronicle.html?resident="]');
    if (!chronicleLink) return;

    const slug = new URL(chronicleLink.href, window.location.href).searchParams.get('resident');
    const resident = slug ? COLLECTION_RESIDENT_BY_SLUG.get(slug) : null;
    if (!resident) return;

    const status = COLLECTION_STATUS[resident.status] || COLLECTION_STATUS.progress;
    const statusNode = card.querySelector('.resident-status');
    if (statusNode) {
      statusNode.className = `resident-status ${status.modifier}`;
      statusNode.textContent = status.label;
    }

    const isArchive = resident.status === 'archive';
    card.classList.toggle('resident-card-archive', isArchive);

    let meta = card.querySelector('.resident-meta');
    if (isArchive) {
      meta?.remove();
    } else {
      if (!meta) {
        meta = document.createElement('p');
        meta.className = 'resident-meta';
        card.querySelector('.resident-actions')?.before(meta);
      }
      if (meta) {
        meta.innerHTML = `<span class="resident-price">${formatPrice(resident.price || 'Цена по запросу')}</span>${resident.stock ? `<span class="resident-stock">${escapeHtml(resident.stock)}</span>` : ''}`;
      }
    }

    const actions = card.querySelector('.resident-actions');
    if (!actions) return;

    let orderButton = actions.querySelector('.button');
    if (isArchive) {
      orderButton?.remove();
      return;
    }

    if (!orderButton) {
      orderButton = document.createElement('a');
      orderButton.href = 'https://t.me/masterskayaver';
      orderButton.textContent = 'Написать Вере';
      actions.appendChild(orderButton);
    }
    orderButton.className = `button button-${status.button || 'primary'} button-small`;
  });
};

syncStaticResidentCards();

const syncKeeperCardsFromData = () => {
  document.querySelectorAll('.keeper-card').forEach((card) => {
    const link = card.querySelector('.keeper-card-link[href*="chronicle.html?resident="]');
    const value = card.querySelector('.keeper-summary p');
    if (!link || !value) return;

    const slug = new URL(link.href, window.location.href).searchParams.get('resident');
    const resident = slug ? COLLECTION_RESIDENT_BY_SLUG.get(slug) : null;
    if (!resident) return;

    const status = COLLECTION_STATUS[resident.status] || COLLECTION_STATUS.progress;
    value.textContent = resident.status === 'available' && resident.price
      ? resident.price
      : status.label;
  });
};

syncKeeperCardsFromData();

const RESIDENT_FILTER_CLASS = {
  'Все': null,
  'Можно приобрести': 'resident-status-available',
  'В работе': 'resident-status-progress',
  'Нашёл Хранителя': 'resident-status-archive'
};

const initResidentFilters = () => {
  const filterRoot = document.querySelector('.residents-filter-row');
  if (!filterRoot) return;

  const worldButtons = [...filterRoot.querySelectorAll('[data-filter-world]')];
  const statusButtons = [...filterRoot.querySelectorAll('[data-filter-status]')];
  const worlds = [...document.querySelectorAll('.res-world[data-world]')];

  let activeWorld = '';
  let activeStatus = '';

  const setPressed = (buttons, activeButton) => {
    buttons.forEach((button) => {
      const active = button === activeButton;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  const applyFilters = () => {
    worlds.forEach((world) => {
      const worldMatches = !activeWorld || world.dataset.world === activeWorld;
      const cards = [...world.querySelectorAll('.resident-card')];
      let visibleCount = 0;

      cards.forEach((card) => {
        const status = card.querySelector('.resident-status');
        const statusMatches = !activeStatus || status?.classList.contains(activeStatus);
        const visible = worldMatches && statusMatches;
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      world.hidden = !worldMatches || visibleCount === 0;

      const count = world.querySelector('.res-world-head .eyebrow');
      if (count) {
        const shown = worldMatches ? visibleCount : 0;
        count.textContent = `${shown} ${residentsWord(shown)}`;
      }
    });
  };

  worldButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeWorld = button.dataset.filterWorld || '';
      setPressed(worldButtons, button);
      applyFilters();
    });
  });

  statusButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeStatus = button.dataset.filterStatus || '';
      setPressed(statusButtons, button);
      applyFilters();
    });
  });

  applyFilters();
};

initResidentFilters();


const WORLD_EFFECT_BY_SLUG = {
  winter: 'snow',
  forest: 'fireflies'
};

const initWorldAtmosphere = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const fixedWorldRoot = document.querySelector('[data-collection-root][data-world], [data-chronicle-root][data-world]');
  const residentWorlds = [...document.querySelectorAll('.res-world[data-world]')];
  if (!fixedWorldRoot && !residentWorlds.length) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'world-atmosphere';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.dataset.effect = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    canvas.remove();
    return;
  }

  let width = 0;
  let height = 0;
  let dpr = 1;
  let effect = null;
  let particles = [];
  let frame = 0;
  const frameInterval = 1000 / 36;
  let lastTime = performance.now();

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = Math.max(1, window.innerHeight - document.querySelector('.site-header')?.offsetHeight || window.innerHeight);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const makeParticle = (type, initial = false) => {
    const base = {
      x: Math.random() * width,
      y: initial ? Math.random() * height : -12,
      phase: Math.random() * Math.PI * 2,
      alpha: .22 + Math.random() * .5
    };

    if (type === 'snow') {
      return {
        ...base,
        r: .8 + Math.random() * 1.8,
        vx: -.18 + Math.random() * .36,
        vy: .28 + Math.random() * .62
      };
    }

    if (type === 'fireflies') {
      return {
        ...base,
        y: Math.random() * height,
        r: 1 + Math.random() * 1.9,
        vx: -.10 + Math.random() * .20,
        vy: -.06 + Math.random() * .12,
        speed: .0008 + Math.random() * .0018
      };
    }

    if (type === 'embers') {
      return {
        ...base,
        y: initial ? Math.random() * height : height + 12,
        r: .8 + Math.random() * 1.6,
        vx: -.16 + Math.random() * .32,
        vy: -.35 - Math.random() * .75
      };
    }

    return {
      ...base,
      y: Math.random() * height,
      r: .45 + Math.random() * 1.1,
      vx: -.05 + Math.random() * .10,
      vy: -.03 + Math.random() * .06
    };
  };

  const rebuild = () => {
    if (!effect) {
      particles = [];
      ctx.clearRect(0, 0, width, height);
      return;
    }

    const area = width * height;
    const density = effect === 'snow' ? 36000 : effect === 'fireflies' ? 62000 : 52000;
    const min = effect === 'snow' ? 28 : 16;
    const max = effect === 'snow' ? 72 : 44;
    const count = Math.max(min, Math.min(max, Math.round(area / density)));
    particles = Array.from({ length: count }, () => makeParticle(effect, true));
  };

  const setWorld = (world) => {
    const next = WORLD_EFFECT_BY_SLUG[world] || null;
    if (next === effect) {
      canvas.hidden = !next;
      return;
    }
    effect = next;
    canvas.dataset.effect = next || 'none';
    canvas.hidden = !next;
    rebuild();
    if (next && !frame && !document.hidden) {
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };

  const drawSnow = (particle, dt) => {
    particle.phase += dt * .0012;
    particle.x += (particle.vx + Math.sin(particle.phase) * .08) * dt;
    particle.y += particle.vy * dt;
    if (particle.y > height + 12 || particle.x < -16 || particle.x > width + 16) {
      Object.assign(particle, makeParticle('snow', false));
    }
    ctx.fillStyle = `rgba(244,248,255,${particle.alpha})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawFirefly = (particle, dt, now) => {
    particle.phase += dt * particle.speed;
    particle.x += (particle.vx + Math.sin(particle.phase) * .055) * dt;
    particle.y += (particle.vy + Math.cos(particle.phase * .7) * .03) * dt;
    if (particle.x < -18) particle.x = width + 18;
    if (particle.x > width + 18) particle.x = -18;
    if (particle.y < -18) particle.y = height + 18;
    if (particle.y > height + 18) particle.y = -18;
    const pulse = .42 + .58 * Math.sin(now * .0018 + particle.phase) ** 2;
    ctx.shadowBlur = 9;
    ctx.shadowColor = 'rgba(233,181,74,.55)';
    ctx.fillStyle = `rgba(240,196,92,${particle.alpha * pulse})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  function tick(now) {
    frame = 0;
    if (!effect || document.hidden) return;

    const elapsed = now - lastTime;
    if (elapsed < frameInterval) {
      frame = requestAnimationFrame(tick);
      return;
    }

    const dt = Math.min(36, Math.max(frameInterval, elapsed));
    lastTime = now;
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      if (effect === 'snow') drawSnow(particle, dt);
      else if (effect === 'fireflies') drawFirefly(particle, dt, now);
    });

    frame = requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener('resize', () => {
    resize();
    rebuild();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      return;
    }
    if (effect && !frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    }
  });

  if (fixedWorldRoot) {
    setWorld(fixedWorldRoot.dataset.world);
    return;
  }

  const ratios = new Map(residentWorlds.map((section) => [section, 0]));
  const syncVisibleWorld = () => {
    const visible = [...ratios.entries()]
      .filter(([section]) => !section.hidden)
      .sort((a, b) => b[1] - a[1])[0];
    setWorld(visible && visible[1] > 0 ? visible[0].dataset.world : null);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => ratios.set(entry.target, entry.intersectionRatio));
    syncVisibleWorld();
  }, { threshold: [0, .12, .25, .5, .75], rootMargin: '-12% 0px -38% 0px' });

  residentWorlds.forEach((section) => observer.observe(section));
};

initWorldAtmosphere();
