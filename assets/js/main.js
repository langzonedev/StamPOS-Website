const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    document.body.classList.toggle('nav-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.querySelector('#year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const saleTotal = 35;
let tendered = 0;
const tenderedEl = document.querySelector('#demoTendered');
const changeEl = document.querySelector('#demoChange');
const cashButtons = document.querySelectorAll('[data-cash]');
const resetButton = document.querySelector('.demo-reset');

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function updateDemo() {
  if (!tenderedEl || !changeEl) return;
  tenderedEl.textContent = formatCurrency(tendered);
  changeEl.textContent = formatCurrency(Math.max(0, tendered - saleTotal));
}

cashButtons.forEach((button) => {
  button.addEventListener('click', () => {
    tendered += Number(button.dataset.cash || 0);
    updateDemo();
  });
});

if (resetButton) {
  resetButton.addEventListener('click', () => {
    tendered = 0;
    updateDemo();
  });
}

updateDemo();
