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
