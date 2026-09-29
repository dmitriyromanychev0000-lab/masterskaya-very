const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

const setMenuState = (open, { focusMenu = false, restoreFocus = false } = {}) => {
  if (!menuButton || !mobileMenu) return;

  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  mobileMenu.hidden = !open;
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
  setMenuState(open);
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    setMenuState(false, { restoreFocus: true });
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

const RESIDENT_MEDIA = {
  'nutcracker': { group: 1, pos: 0 },
  'mari': { group: 1, pos: 1 },
  'mouse-queen': { group: 1, pos: 2 },
  'mouse-king': { group: 1, pos: 3 },
  'forest-dragon': { group: 2, pos: 0 },
  'mushrooms': { group: 2, pos: 1 },
  'azimondias': { group: 2, pos: 2 },
  'baby-dragon': { group: 2, pos: 3 },
  'soul-regan': { group: 3, pos: 0 },
  'gorynych-2': { group: 3, pos: 1 },
  'gorynych': { group: 3, pos: 2 },
  'sirin': { group: 3, pos: 3 },
  'mermaid': { group: 4, pos: 0 },
  'humpbacked-horse': { group: 4, pos: 1 },
  'hen': { group: 4, pos: 2 },
  'rocking-horse': { group: 4, pos: 3 },
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
    residents: [
      { name: 'Лесной дракон', status: 'available', price: '13100 ₽', chronicle: 'forest-dragon' },
      { name: 'Лесные грибы (набор)', status: 'available', price: '1500 ₽ за штуку', chronicle: 'mushrooms' }
    ]
  },
  dragons: {
    title: 'Древние существа',
    description: 'Чешуя, крылья и память о временах, которых не застал никто. Мир тех, кто старше сказок.',
    tone: 'paper',
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
    residents: [
      { name: 'Змей Горыныч II', status: 'available', price: '6500 ₽', chronicle: 'gorynych-2' },
      { name: 'Змей Горыныч', status: 'progress', chronicle: 'gorynych' },
      { name: 'Птица Сирин', status: 'available', price: '3500 ₽', chronicle: 'sirin' },
      { name: 'Русалка', status: 'progress', price: '3500 ₽', stock: 'предзаказ', chronicle: 'mermaid' },
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

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

const residentsWord = (count) => {
  const mod100 = count % 100;
  const mod10 = count % 10;
  if (mod100 >= 11 && mod100 <= 14) return 'Жителей';
  if (mod10 === 1) return 'Житель';
  if (mod10 >= 2 && mod10 <= 4) return 'Жителя';
  return 'Жителей';
};

const renderResidentCard = (resident, index) => {
  const status = COLLECTION_STATUS[resident.status] || COLLECTION_STATUS.progress;
  const isArchive = resident.status === 'archive';
  const price = resident.price || 'Цена по запросу';
  const stock = resident.stock ? `<span class="resident-stock">${escapeHtml(resident.stock)}</span>` : '';
  const contactButton = status.button
    ? `<a class="button button-${status.button} button-small" href="contact.html">Написать Вере</a>`
    : '';

  return `
        <article class="resident-card${isArchive ? ' resident-card-archive' : ''}">
          <div class="resident-media">
            ${residentPhotoMarkup(resident.chronicle, resident.name)}
            ${isArchive ? '<span class="resident-archive-tag">В Хрониках</span>' : ''}
          </div>
          <div class="resident-copy">
            <span class="resident-status ${status.modifier}">${status.label}</span>
            <h3>${escapeHtml(resident.name)}</h3>
            <p class="resident-meta"><span class="resident-price">${escapeHtml(price)}</span>${stock}</p>
            <div class="resident-actions">
              <a class="text-link" href="chronicle.html?resident=${escapeHtml(resident.chronicle)}">Открыть Хронику</a>
              ${contactButton}
            </div>
          </div>
        </article>`;
};

const renderCollectionCta = () => `
    <section class="keeper-cta collection-cta">
      <h2>Понравился кто-то из этого Мира?</h2>
      <p>Напишите Вере — она расскажет о размере, сроках и стоимости.</p>
      <div class="collection-cta-actions">
        <a class="button button-primary" href="contact.html">Написать Вере</a>
        <a class="button button-outline" href="residents.html">Смотреть всех Жителей</a>
      </div>
    </section>`;

const renderCollectionNotFound = () => `
    <section class="collection-intro collection-intro--paper collection-notfound">
      <a class="collection-back" href="residents.html"><span aria-hidden="true">←</span> Все Жители</a>
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
    document.title = 'Мир не найден — Мастерская Веры';
    root.innerHTML = renderCollectionNotFound();
    return;
  }

  const countLabel = `${world.residents.length} ${residentsWord(world.residents.length)}`;
  document.title = `${world.title} — Мастерская Веры`;
  root.innerHTML = `
    <section class="collection-intro collection-intro--${world.tone}">
      <a class="collection-back" href="residents.html"><span aria-hidden="true">←</span> Все Жители</a>
      <div class="collection-head">
        <div class="collection-eyebrow">
          <p class="eyebrow">Мир мастерской</p>
          <span class="collection-count">${countLabel}</span>
        </div>
        <h1>${escapeHtml(world.title)}</h1>
        <p class="collection-lead">${escapeHtml(world.description)}</p>
      </div>
    </section>

    <section class="res-world res-world--${world.tone} collection-residents">
      <div class="resident-grid">
${world.residents.map(renderResidentCard).join('')}
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
    story: 'Первый Житель, который уехал к своему Хранителю. Повторить его нельзя — то, что уже нашло дом, не лепится заново.'
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
    price: '3500 ₽',
    stock: 'предзаказ',
    story: 'Русалка из русских сказок — ждёт своего часа, чтобы показаться во всей красе.'
  },
  'humpbacked-horse': {
    name: 'Конёк-Горбунок',
    world: 'russian',
    status: 'available',
    price: '4000 ₽',
    stock: 'готово: 2',
    story: 'Верный спутник из старой сказки — маленький, горбатый и по-настоящему сказочный.'
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
  const price = resident.price || 'Цена по запросу';
  const stock = resident.stock ? `<span class="resident-stock">${escapeHtml(resident.stock)}</span>` : '';
  const isArchive = resident.status === 'archive';

  const action = isArchive
    ? '<p class="chronicle-archive-note">Нашёл своего Хранителя — повторить нельзя</p>'
    : `<div class="chronicle-actions" data-chronicle-action>
          <a class="button button-${status.button || 'primary'}" href="contact.html">Написать Вере</a>
        </div>`;

  return `
    <section class="collection-intro collection-intro--night chronicle-hero">
      ${residentPhotoMarkup(slug, resident.name, 'chronicle-hero-bg', true)}
      <div class="chronicle-hero-scrim" aria-hidden="true"></div>
      <div class="chronicle-hero-inner">
        <a class="collection-back" href="residents.html"><span aria-hidden="true">←</span> Все Жители</a>
        <div class="collection-eyebrow">
          <p class="eyebrow">Хроника Жителя</p>
          <a class="collection-count chronicle-world" href="collection.html?world=${escapeHtml(resident.world)}">${escapeHtml(worldTitle)}</a>
        </div>
        <h1>${escapeHtml(resident.name)}</h1>
        <div class="chronicle-badges">
          <span class="resident-status ${status.modifier}">${status.label}</span>
          <span class="chronicle-price">${escapeHtml(price)}${stock}</span>
        </div>
        ${action}
      </div>
    </section>`;
};

const renderChronicleNext = (resident) => {
  if (resident.status === 'archive') {
    return `
    <section class="keeper-cta chronicle-next">
      <h2>Что дальше</h2>
      <p>Этот Житель уже нашёл дом. Может, среди свободных есть тот, кто ждёт вас</p>
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
      <div class="chronicle-next-actions">
        <a class="button button-primary" href="contact.html">Написать Вере</a>
        <a class="button button-outline" href="residents.html">Все Жители</a>
      </div>
    </section>`;
};

const renderChronicleNotFound = () => `
    <section class="collection-intro collection-intro--paper collection-notfound">
      <a class="collection-back" href="residents.html"><span aria-hidden="true">←</span> Все Жители</a>
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
          <span class="chronicle-sticky-price">${escapeHtml(resident.price || 'Цена по запросу')}</span>
        </div>
        <a class="button button-primary button-small" href="contact.html">Написать Вере</a>
      </div>
    </div>`;

  return `
    ${renderChronicleHero(resident, slug, worldTitle)}

    <section class="chronicle-section chronicle-story">
      <div class="chronicle-story-grid">
        <div class="chronicle-story-copy">
          <p class="eyebrow">Хроника</p>
          <p class="chronicle-text">${escapeHtml(resident.story)}</p>
        </div>
        <figure class="chronicle-figure">
          <div class="chronicle-frame">
            ${residentPhotoMarkup(slug, resident.name, 'chronicle-photo')}
          </div>
        </figure>
      </div>
    </section>

    ${renderChronicleNext(resident)}
    ${sticky}`;
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
    document.title = 'Житель не найден — Мастерская Веры';
    root.innerHTML = renderChronicleNotFound();
    return;
  }

  document.title = `${resident.name} — Мастерская Веры`;
  root.innerHTML = renderChronicle(slug, resident);
  initChronicleSticky();
};

initChronicle();

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
    if (!slug) return;

    media.querySelectorAll('img, .resident-photo').forEach((node) => node.remove());
    media.insertAdjacentHTML('afterbegin', residentPhotoMarkup(slug, name));
  });
};

hydrateStaticResidentMedia();

const RESIDENT_FILTER_CLASS = {
  'Все': null,
  'Можно приобрести': 'resident-status-available',
  'В работе': 'resident-status-progress',
  'Нашёл Хранителя': 'resident-status-archive'
};

const initResidentFilters = () => {
  const filters = document.querySelector('.filters');
  if (!filters) return;

  const buttons = [...filters.querySelectorAll('.chip')];
  const worlds = [...document.querySelectorAll('.res-world')];

  const applyFilter = (statusClass) => {
    worlds.forEach((world) => {
      const cards = [...world.querySelectorAll('.resident-card')];
      let visibleCount = 0;

      cards.forEach((card) => {
        const status = card.querySelector('.resident-status');
        const visible = !statusClass || status?.classList.contains(statusClass);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      world.hidden = visibleCount === 0;

      const count = world.querySelector('.res-world-head .eyebrow');
      if (count) {
        const shown = statusClass ? visibleCount : cards.length;
        count.textContent = `${shown} ${residentsWord(shown)}`;
      }
    });
  };

  buttons.forEach((button, index) => {
    button.setAttribute('aria-pressed', String(index === 0));

    button.addEventListener('click', () => {
      const label = button.textContent.trim();
      const statusClass = RESIDENT_FILTER_CLASS[label] ?? null;

      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });

      applyFilter(statusClass);
    });
  });
};

initResidentFilters();
