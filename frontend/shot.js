const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const errors = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })

  // Home - light
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' }).catch(()=>{})
  await page.waitForTimeout(1500)
  await page.screenshot({ path: '/tmp/shot-home-light.png' })

  // Home - dark
  await page.evaluate(() => { document.documentElement.classList.add('dark') })
  await page.waitForTimeout(600)
  await page.screenshot({ path: '/tmp/shot-home-dark.png' })

  // Track page - dark
  await page.goto('http://localhost:5173/track', { waitUntil: 'networkidle' }).catch(()=>{})
  await page.waitForTimeout(1500)
  await page.screenshot({ path: '/tmp/shot-track-dark.png' })

  // Track page - light
  await page.evaluate(() => { document.documentElement.classList.remove('dark') })
  await page.waitForTimeout(600)
  await page.screenshot({ path: '/tmp/shot-track-light.png' })

  // Inspect Lacak title lines
  const lacak = await page.evaluate(() => {
    const h1 = document.querySelector('h1')
    if (!h1) return 'NO H1'
    const spans = Array.from(h1.querySelectorAll('span.block'))
    return spans.map(s => s.textContent)
  })
  console.log('LACAK_LINES:', JSON.stringify(lacak))

  // Check for visible white borders in dark mode on navbar
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' }).catch(()=>{})
  await page.evaluate(() => { document.documentElement.classList.add('dark') })
  await page.waitForTimeout(800)
  const borderInfo = await page.evaluate(() => {
    const nav = document.querySelector('nav')
    const out = []
    if (nav) {
      const els = nav.querySelectorAll('*')
      els.forEach(el => {
        const cs = getComputedStyle(el)
        if (cs.borderTopWidth !== '0px' || cs.borderBottomWidth !== '0px' || cs.borderLeftWidth !== '0px' || cs.borderRightWidth !== '0px') {
          const bc = cs.borderTopColor
          // detect light-ish border
          if (bc !== 'rgba(0, 0, 0, 0)' && bc !== 'transparent' && bc !== 'rgb(0, 0, 0)') {
            out.push(el.className + ' => ' + bc)
          }
        }
      })
    }
    return out.slice(0, 20)
  })
  console.log('NAVBAR_BORDERS:', JSON.stringify(borderInfo))
  console.log('ERRORS:', JSON.stringify(errors.filter(e=>!/ECONNREFUSED|proxy error/.test(e)).slice(0,10)))

  await browser.close()
})()
