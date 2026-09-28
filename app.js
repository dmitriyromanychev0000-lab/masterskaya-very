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

const COLLECTION_IMAGES = [
  'assets/collections/winter-nutcracker.webp',
  'assets/residents/green-dragon.webp',
  'assets/home/workshop-hero.webp'
];

const COLLECTION_WORLDS = {
  winter: {
    title: 'Зимние легенды',
    description: 'Синий вечер, снег на еловых лапах и тёплый свет в окне. Мир, где ждут чуда и слышат музыку.',
    tone: 'night',
    residents: [
      { name: 'Щелкунчик', status: 'available', price: '3000 ₽', stock: 'готово: 1', chronicle: 'nutcracker' },
      { name: 'Мышиный Король', status: 'available', price: '4500 ₽', stock: 'готово: 4', chronicle: 'mouse-king' },
      { name: 'Мари (девочка с Щелкунчиком)', status: 'progress', chronicle: 'mari' },
      { name: 'Мышиная Королева', status: 'progress', chronicle: 'mouse-queen' }
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
      { name: 'Малыш-дракон', status: 'progress', chronicle: 'baby-dragon' },
      { name: 'Соул Реган', status: 'progress', chronicle: 'soul-regan' },
      { name: 'Азимондиас', status: 'archive', chronicle: 'azimondias' }
    ]
  },
  russian: {
    title: 'Русские сказки',
    description: 'Резной терем, синие цветы по золоту и вязь до самого вечера. Мир, где сказку рассказывают на ночь.',
    tone: 'night',
    residents: [
      { name: 'Змей Горыныч II', status: 'available', price: '6500 ₽', chronicle: 'gorynych-2' },
      { name: 'Птица Сирин', status: 'available', price: '3500 ₽', chronicle: 'sirin' },
      { name: 'Конёк-Горбунок', status: 'available', price: '4000 ₽', stock: 'готово: 2', chronicle: 'humpbacked-horse' },
      { name: 'Змей Горыныч', status: 'progress', chronicle: 'gorynych' },
      { name: 'Русалка', status: 'progress', price: '3500 ₽', stock: 'предзаказ', chronicle: 'mermaid' }
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
  const image = COLLECTION_IMAGES[index % COLLECTION_IMAGES.length];
  const isArchive = resident.status === 'archive';
  const price = resident.price || 'Цена по запросу';
  const stock = resident.stock ? `<span class="resident-stock">${escapeHtml(resident.stock)}</span>` : '';
  const contactButton = status.button
    ? `<a class="button button-${status.button} button-small" href="contact.html">Написать Вере</a>`
    : '';

  return `
        <article class="resident-card${isArchive ? ' resident-card-archive' : ''}">
          <div class="resident-media">
            <img src="${image}" alt="${escapeHtml(resident.name)} — фигурка ручной работы" loading="lazy">
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
