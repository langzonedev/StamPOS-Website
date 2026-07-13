const isSubpage = location.pathname !== '/' && !location.pathname.endsWith('/StamPOS-Website/');
const depth = location.pathname.split('/').filter(Boolean).length;
const root = depth >= 2 && location.pathname.includes('/docs/') ? '../../' : (isSubpage ? '../' : '');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

const header = document.querySelector('.site-header');
if (header && !document.querySelector('.beta-notice')) {
  const notice = document.createElement('div');
  notice.className = 'beta-notice';
  notice.innerHTML = `<div class="container"><strong>Private beta:</strong> StamPOS is under controlled testing and payment accreditation is still in progress. It is not yet available for general production use. <a href="${root}beta/">Read the release-status notice</a>.</div>`;
  header.insertAdjacentElement('afterend', notice);
}

if (navLinks) {
  const utilityLinks = [
    ['Private beta', `${root}beta/`],
    ['Hardware', `${root}hardware/`],
    ['Payments', `${root}payments/`],
    ['Downloads', `${root}downloads/`],
    ['Support', `${root}support/`],
    ['Contact', `${root}contact/`]
  ];
  utilityLinks.forEach(([label, href]) => {
    if (![...navLinks.querySelectorAll('a')].some((link) => link.textContent.trim() === label)) {
      const item = document.createElement('li');
      item.innerHTML = `<a href="${href}">${label}</a>`;
      const cta = navLinks.querySelector('.nav-cta')?.closest('li');
      cta ? navLinks.insertBefore(item, cta) : navLinks.appendChild(item);
    }
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    document.body.classList.toggle('nav-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

const footer = document.querySelector('.site-footer .container');
if (footer) {
  footer.className = 'container unified-footer';
  footer.innerHTML = `
    <div class="footer-brand-block">
      <a class="brand" href="${root}"><span class="brand-mark"><img src="${root}assets/icons/stampos-icon.svg" alt=""></span><span class="brand-word">Stam<span>POS</span></span></a>
      <p>Practical point of sale software for events, counters and small businesses. Currently in controlled private beta.</p>
      <a href="mailto:stampos@outlook.com">stampos@outlook.com</a>
      <span>ABN 91 191 123 951</span>
    </div>
    <div class="footer-column"><strong>Product</strong><a href="${root}beta/">Private beta</a><a href="${root}hardware/">Hardware</a><a href="${root}payments/">Payments</a><a href="${root}downloads/">Downloads</a><a href="${root}releases/">Release notes</a></div>
    <div class="footer-column"><strong>Resources</strong><a href="${root}docs/">Documentation</a><a href="${root}docs/beta-testing/">Beta testing documents</a><a href="${root}support/">Support</a><a href="${root}roadmap/">Roadmap</a><a href="${root}brand/">Brand</a></div>
    <div class="footer-column"><strong>Company</strong><a href="${root}contact/">Contact</a><a href="${root}privacy/">Privacy</a><a href="${root}terms/">Terms</a><a href="${root}legal/">Copyright & legal</a></div>
    <div class="footer-bottom"><span>&copy; <span id="year"></span> StamPOS. All rights reserved.</span><span>Private beta - not for general production use</span></div>`;
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

function formatCurrency(value) { return `$${value.toFixed(2)}`; }
function updateDemo() {
  if (!tenderedEl || !changeEl) return;
  tenderedEl.textContent = formatCurrency(tendered);
  changeEl.textContent = formatCurrency(Math.max(0, tendered - saleTotal));
  if (payButton) payButton.disabled = tendered < saleTotal || paymentComplete;
  if (statusEl && !paymentComplete) {
    statusEl.textContent = tendered >= saleTotal ? 'Demo tender received. Ready to simulate completion.' : `Add ${formatCurrency(saleTotal - tendered)} more to the website demonstration.`;
    statusEl.className = 'payment-status';
  }
}
cashButtons.forEach((button) => button.addEventListener('click', () => { if (!paymentComplete) { tendered += Number(button.dataset.cash || 0); updateDemo(); } }));
if (payButton) payButton.addEventListener('click', () => {
  if (tendered < saleTotal || paymentComplete) return;
  payButton.disabled = true;
  payButton.textContent = 'Simulating…';
  if (statusEl) { statusEl.textContent = 'Simulating payment recording - no transaction is processed.'; statusEl.className = 'payment-status processing'; }
  window.setTimeout(() => {
    paymentComplete = true;
    payButton.textContent = 'Demo complete';
    if (statusEl) { statusEl.textContent = `Website demonstration complete. Simulated change: ${formatCurrency(tendered - saleTotal)}.`; statusEl.className = 'payment-status approved'; }
  }, 900);
});
if (resetButton) resetButton.addEventListener('click', () => {
  tendered = 0;
  paymentComplete = false;
  if (payButton) payButton.textContent = 'Complete demo';
  updateDemo();
});
updateDemo();