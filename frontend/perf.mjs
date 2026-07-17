import { chromium } from 'playwright'
const b = await chromium.launch()
const p = await b.newPage()
const reqs = []
p.on('requestfinished', r => reqs.push(r.url()))
const t0 = Date.now()
let status = 0
try {
  const nav = await p.goto('http://127.0.0.1:8000/', { waitUntil: 'domcontentloaded', timeout: 30000 })
  status = nav.status()
} catch (e) { console.log('goto err', e.message) }
const domT = Date.now() - t0
await p.waitForFunction(() => { const r = document.querySelector('#root'); return r && r.children.length > 0 }, { timeout: 20000 }).catch(() => {})
const mountT = Date.now() - t0
const jsReqs = reqs.filter(u => u.endsWith('.js')).length
const totalBytes = await p.evaluate(() => performance.getEntriesByType('resource').reduce((s, e) => s + (e.transferSize || 0), 0))
console.log(JSON.stringify({ domMs: domT, mountMs: mountT, status, jsFiles: jsReqs, totalKB: Math.round(totalBytes / 1024) }))
await b.close()
