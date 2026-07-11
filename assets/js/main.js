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
if (year) year.textContent = new Date().getFullYear();

const saleTotal = 35;
let tendered = 0;
let paymentComplete = false;
const tenderedEl = document.querySelector('#demoTendered');
const changeEl = document.querySelector('#demoChange');
const statusEl = document.querySelector('#paymentStatus');
const cashButtons = document.querySelectorAll('[data-cash]');
const payButton = document.querySelector('.demo-pay');
const resetButton = document.querySelector('.demo-reset');

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function updateDemo() {
  if (!tenderedEl || !changeEl) return;
  tenderedEl.textContent = formatCurrency(tendered);
  changeEl.textContent = formatCurrency(Math.max(0, tendered - saleTotal));
  if (payButton) payButton.disabled = tendered < saleTotal || paymentComplete;
  if (statusEl && !paymentComplete) {
    statusEl.textContent = tendered >= saleTotal
      ? 'Tender received. Ready to complete payment.'
      : `Add ${formatCurrency(saleTotal - tendered)} more to complete the sale.`;
    statusEl.className = 'payment-status';
  }
}

cashButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (paymentComplete) return;
    tendered += Number(button.dataset.cash || 0);
    updateDemo();
  });
});

if (payButton) {
  payButton.addEventListener('click', () => {
    if (tendered < saleTotal || paymentComplete) return;
    payButton.disabled = true;
    payButton.textContent = 'Processing…';
    if (statusEl) {
      statusEl.textContent = 'Recording payment…';
      statusEl.className = 'payment-status processing';
    }
    window.setTimeout(() => {
      paymentComplete = true;
      payButton.textContent = 'Payment accepted';
      if (statusEl) {
        statusEl.textContent = `Payment accepted. Return ${formatCurrency(tendered - saleTotal)} change.`;
        statusEl.className = 'payment-status approved';
      }
    }, 900);
  });
}

if (resetButton) {
  resetButton.addEventListener('click', () => {
    tendered = 0;
    paymentComplete = false;
    if (payButton) payButton.textContent = 'Complete payment';
    updateDemo();
  });
}

updateDemo();
