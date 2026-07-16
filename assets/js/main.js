const isSubpage = location.pathname !== '/' && !location.pathname.endsWith('/StamPOS-Website/');
const depth = location.pathname.split('/').filter(Boolean).length;
const root = depth >= 2 && location.pathname.includes('/docs/') ? '../../' : (isSubpage ? '../' : '');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navLinks) {
  const pagePath = location.pathname.replace(/\/index\.html$/, '/');
  const navItems = [
    ['Product', isSubpage ? `${root}#product` : '#product', pagePath === '/' ? 'product' : ''],
    ['Payments', isSubpage ? `${root}#payments` : '#payments', pagePath === '/' ? 'payments' : ''],
    ['Demo', isSubpage ? `${root}#demo` : '#demo', pagePath === '/' ? 'demo' : ''],
    ['Documentation', `${root}docs/`, '/docs/'],
    ['Support', `${root}support/`, '/support/'],
    ['Contact', `${root}contact/`, '/contact/', 'nav-cta']
  ];

  navLinks.innerHTML = navItems.map(([label, href, match, className]) => {
    const isCurrent = match && pagePath.endsWith(match);
    const classAttr = className ? ` class="${className}"` : '';
    const currentAttr = isCurrent ? ' aria-current="page"' : '';
    return `<li><a${classAttr} href="${href}"${currentAttr}>${label}</a></li>`;
  }).join('');
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
      <p>Practical point of sale software for events, counters and small businesses.</p>
      <a href="mailto:stampos@outlook.com">stampos@outlook.com</a>
      <a class="footer-maker" href="https://langsystems.com.au/">Made by Lang Systems</a>
    </div>
    <div class="footer-column"><strong>Product</strong><a href="${root}hardware/">Hardware</a><a href="${root}payments/">Payments</a><a href="${root}docs/support-matrix/">System requirements</a><a href="${root}downloads/">Get StamPOS</a></div>
    <div class="footer-column"><strong>Resources</strong><a href="${root}docs/">Documentation</a><a href="${root}docs/getting-started/">Getting started</a><a href="${root}docs/cloud-pairing/">Linkly pairing</a><a href="${root}support/">Support</a></div>
    <div class="footer-column"><strong>Company</strong><a href="${root}contact/">Contact</a><a href="${root}privacy/">Privacy</a><a href="${root}terms/">Terms</a><a href="${root}legal/">Copyright & legal</a></div>
    <div class="footer-bottom"><span>&copy; <span id="year"></span> StamPOS. All rights reserved.</span><span>Version 1.0.0</span></div>`;
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
    statusEl.textContent = tendered >= saleTotal ? 'Tender received. Ready to complete the demonstration.' : `Add ${formatCurrency(saleTotal - tendered)} more.`;
    statusEl.className = 'payment-status';
  }
}
cashButtons.forEach((button) => button.addEventListener('click', () => { if (!paymentComplete) { tendered += Number(button.dataset.cash || 0); updateDemo(); } }));
if (payButton) payButton.addEventListener('click', () => {
  if (tendered < saleTotal || paymentComplete) return;
  payButton.disabled = true;
  payButton.textContent = 'Completing...';
  if (statusEl) { statusEl.textContent = 'Completing the website demonstration.'; statusEl.className = 'payment-status processing'; }
  window.setTimeout(() => {
    paymentComplete = true;
    payButton.textContent = 'Demo complete';
    if (statusEl) { statusEl.textContent = `Sale complete. Change due: ${formatCurrency(tendered - saleTotal)}.`; statusEl.className = 'payment-status approved'; }
  }, 900);
});
if (resetButton) resetButton.addEventListener('click', () => {
  tendered = 0;
  paymentComplete = false;
  if (payButton) payButton.textContent = 'Complete demo';
  updateDemo();
});
updateDemo();