const puppeteer = require('puppeteer-core');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const baseUrl = 'http://127.0.0.1:5173';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runTests() {
  console.log('Launching headless Microsoft Edge browser for Phase 1 verification...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('Firebase') || msg.text().includes('Auth')) {
      console.log('BROWSER LOG:', msg.text());
    }
  });
  const results = {};

  try {
    // 1. Public homepage
    console.log('Testing Public homepage...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await sleep(600);
    const heroH1 = await page.$eval('h1', el => el.textContent);
    results['1. Public Homepage'] = heroH1.includes('One place to manage hostel rooms, meals and maintenance') ? 'PASS' : 'FAIL';

    // 2. Desktop navbar
    console.log('Testing Desktop navbar...');
    const desktopNavVisible = await page.$eval('.desktop-nav', el => {
      return window.getComputedStyle(el).display !== 'none';
    });
    const hamburgerHiddenOnDesktop = await page.$eval('.mobile-menu-toggle', el => {
      return window.getComputedStyle(el).display === 'none';
    });
    results['2. Desktop Navbar'] = (desktopNavVisible && hamburgerHiddenOnDesktop) ? 'PASS' : 'FAIL';

    // 3. Mobile navbar
    console.log('Testing Mobile navbar at 375px...');
    await page.setViewport({ width: 375, height: 812 });
    await sleep(300);
    const desktopNavHiddenOnMobile = await page.$eval('.desktop-nav', el => {
      return window.getComputedStyle(el).display === 'none';
    });
    const hamburgerVisibleOnMobile = await page.$eval('.mobile-menu-toggle', el => {
      return window.getComputedStyle(el).display !== 'none';
    });
    results['3. Mobile Navbar'] = (desktopNavHiddenOnMobile && hamburgerVisibleOnMobile) ? 'PASS' : 'FAIL';

    // Reset viewport to desktop
    await page.setViewport({ width: 1440, height: 900 });

    // 4. Unauthenticated redirects
    console.log('Testing /dashboard while logged out...');
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'domcontentloaded' });
    await sleep(800);
    results['4. /dashboard while logged out'] = page.url().includes('/login') ? 'PASS' : 'FAIL';

    console.log('Testing /admin/dashboard while logged out...');
    await page.goto(`${baseUrl}/admin/dashboard`, { waitUntil: 'domcontentloaded' });
    await sleep(800);
    results['5. /admin/dashboard while logged out'] = page.url().includes('/login') ? 'PASS' : 'FAIL';

    // 5. Demo Resident Login (Real Firebase Auth)
    console.log('Testing Demo Resident Login (Real Firebase Auth)...');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#demo-resident-btn');
    await sleep(600);
    await page.click('#demo-resident-btn');
    await page.waitForFunction(() => window.location.pathname === '/dashboard', { timeout: 20000 });
    await page.waitForSelector('h1', { timeout: 5000 });
    await sleep(600);
    const residentUrl = page.url();
    const residentH1 = await page.$eval('h1', el => el.textContent);
    results['6. Demo Resident Auth'] = (residentUrl.includes('/dashboard') && residentH1.includes('Welcome')) ? 'PASS' : 'FAIL';

    // 6. Resident Modular Routes Testing
    console.log('Testing Resident dedicated module routes...');
    const residentRoutes = [
      { path: '/resident/room', expectedText: 'My Room' },
      { path: '/resident/allocation', expectedText: 'Allotment' },
      { path: '/resident/mess/today', expectedText: "Today's Menu" },
      { path: '/resident/mess/weekly', expectedText: 'Weekly' },
      { path: '/resident/announcements', expectedText: 'Announcements' },
      { path: '/resident/maintenance/report', expectedText: 'Maintenance' },
      { path: '/resident/maintenance/tickets', expectedText: 'Maintenance' },
      { path: '/resident/profile', expectedText: 'Profile' }
    ];

    let residentRoutesPass = true;
    for (const r of residentRoutes) {
      // Use client navigation within authenticated session
      await page.evaluate(p => {
        window.history.pushState({}, '', p);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, r.path);
      await sleep(300);
      const text = await page.$eval('body', el => el.innerText);
      if (!text.includes(r.expectedText)) {
        console.warn(`  Failed checking ${r.path} for text "${r.expectedText}"`);
        residentRoutesPass = false;
      }
    }
    results['7. Resident Modular Workspaces (8 Pages)'] = residentRoutesPass ? 'PASS' : 'FAIL';

    // 7. Security: Resident attempting /admin/dashboard -> blocked with notice
    console.log('Testing Resident authorization: blocked from /admin/dashboard...');
    await page.evaluate(() => {
      window.history.pushState({}, '', '/admin/dashboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await sleep(400);
    const blockedBody = await page.$eval('body', el => el.innerText);
    results['8. Resident -> /admin/dashboard Blocked'] = blockedBody.includes('Warden access is not enabled') ? 'PASS' : 'FAIL';

    // 8. Sign out resident
    console.log('Signing out resident...');
    await page.waitForSelector('#portal-sign-out-btn');
    await page.click('#portal-sign-out-btn');
    await page.waitForFunction(() => window.location.pathname === '/login', { timeout: 10000 });

    // 9. Demo Warden Login (Real Firebase Auth)
    console.log('Testing Demo Warden Login (Real Firebase Auth)...');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#demo-warden-btn');
    await page.click('#demo-warden-btn');
    await page.waitForFunction(() => window.location.pathname === '/admin/dashboard', { timeout: 15000 });
    await page.waitForSelector('h1', { timeout: 5000 });
    await sleep(600);
    const wardenUrl = page.url();
    const wardenH1 = await page.$eval('h1', el => el.textContent);
    results['9. Demo Warden Auth'] = (wardenUrl.includes('/admin/dashboard') && wardenH1.includes('Operations')) ? 'PASS' : 'FAIL';

    // 10. Warden Modular Workspaces Testing
    console.log('Testing Warden dedicated module routes...');
    const wardenRoutes = [
      { path: '/admin/hostel', expectedText: 'Hostel' },
      { path: '/admin/hostel/rooms', expectedText: 'Rooms' },
      { path: '/admin/hostel/allocation', expectedText: 'Allocation' },
      { path: '/admin/hostel/residents', expectedText: 'Residents' },
      { path: '/admin/hostel/blocks', expectedText: 'Blocks' },
      { path: '/admin/mess', expectedText: 'Mess' },
      { path: '/admin/mess/today', expectedText: "Today's Menu" },
      { path: '/admin/mess/weekly', expectedText: 'Weekly' },
      { path: '/admin/mess/schedule', expectedText: 'Schedule' },
      { path: '/admin/mess/announcements', expectedText: 'Announcements' },
      { path: '/admin/maintenance', expectedText: 'Maintenance' },
      { path: '/admin/maintenance/tickets', expectedText: 'Tickets' },
      { path: '/admin/maintenance/resolution', expectedText: 'Resolution' },
      { path: '/admin/maintenance/categories', expectedText: 'Categories' }
    ];

    let wardenRoutesPass = true;
    for (const r of wardenRoutes) {
      await page.evaluate(p => {
        window.history.pushState({}, '', p);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, r.path);
      await sleep(300);
      const text = await page.$eval('body', el => el.innerText);
      if (!text.includes(r.expectedText)) {
        console.warn(`  Failed checking ${r.path} for text "${r.expectedText}"`);
        wardenRoutesPass = false;
      }
    }
    results['10. Warden Dedicated Workspaces (14 Pages)'] = wardenRoutesPass ? 'PASS' : 'FAIL';

    // 11. Responsive Breakpoints Verification
    console.log('Testing responsive breakpoints for overflow...');
    const viewports = [320, 375, 390, 414, 768, 1024, 1280, 1440];
    let responsivePass = true;

    for (const w of viewports) {
      await page.setViewport({ width: w, height: 800 });
      await sleep(150);
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 5;
      });
      if (hasHorizontalScroll) {
        console.warn(`  Warning: horizontal overflow detected at width ${w}px`);
        responsivePass = false;
      }
    }
    results['11. Responsive Design (320px - 1440px)'] = responsivePass ? 'PASS' : 'FAIL';

  } catch (err) {
    console.error('Test execution error:', err);
    results['Execution Error'] = err.message;
  } finally {
    await browser.close();
  }

  console.log('\n==================================================');
  console.log('PHASE 1 BROWSER TEST RESULTS');
  console.log('==================================================');
  console.table(results);
  const anyFail = Object.values(results).some(v => v === 'FAIL');
  process.exit(anyFail ? 1 : 0);
}

runTests();
