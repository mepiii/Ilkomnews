import { chromium } from 'playwright';
const base = 'http://localhost:5175';
const routes = ['/', '/news', '/koleksi', '/track', '/submit-project', '/ilkom-gallery'];
const browser = await chromium.launch();
const errors = [];
async function audit(path, w, h, label) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const e = [];
  page.on('console', m => { if (m.type()==='error') e.push(m.text()); });
  page.on('pageerror', err => e.push('PAGEERR: '+err.message));
  await page.goto(base+path, { waitUntil:'networkidle' }).catch(r=>e.push('NAV: '+r.message));
  await page.waitForTimeout(1200);
  // horizontal overflow
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.screenshot({ path:`/tmp/shot_${label}.png`, fullPage:false });
  errors.push({label, overflow, e});
  await page.close();
}
for (const r of routes) {
  await audit(r, 1440, 900, 'd_'+r.replace(/\//g,'_'));
  await audit(r, 390, 844, 'm_'+r.replace(/\//g,'_'));
}
console.log(JSON.stringify(errors, null, 2));
await browser.close();
