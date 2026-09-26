const puppeteer = require('puppeteer-core');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const baseUrl = 'http://127.0.0.1:5173';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runTests() {
  console.log('Launching headless Microsoft Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const results = {};

  try {
    // 1. Public homepage
    console.log('Test 1: Public homepage...');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await sleep(600);
    const heroH1 = await page.$eval('h1', el => el.textContent);
    results['1. Public Homepage'] = heroH1.includes('One place to manage hostel rooms, meals and maintenance') ? 'PASS' : 'FAIL';

    // 2. Desktop navbar
    console.log('Test 2: Desktop navbar...');
    const desktopNavVisible = await page.$eval('.desktop-nav', el => {
      return window.getComputedStyle(el).display !== 'none';
    });
    const hamburgerHiddenOnDesktop = await page.$eval('.mobile-menu-toggle', el => {
      return window.getComputedStyle(el).display === 'none';
    });
    results['2. Desktop Navbar'] = (desktopNavVisible && hamburgerHiddenOnDesktop) ? 'PASS' : 'FAIL';

    // 3. Mobile navbar
    console.log('Test 3: Mobile navbar at 375px...');
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

    // 9. /dashboard while logged out
    console.log('Test 9: /dashboard while logged out...');
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'domcontentloaded' });
    await sleep(1000);
    results['9. /dashboard while logged out'] = page.url().includes('/login') ? 'PASS' : 'FAIL';

    // 10. /admin/dashboard while logged out
    console.log('Test 10: /admin/dashboard while logged out...');
    await page.goto(`${baseUrl}/admin/dashboard`, { waitUntil: 'domcontentloaded' });
    await sleep(1000);
    results['10. /admin/dashboard while logged out'] = page.url().includes('/login') ? 'PASS' : 'FAIL';

    // 6. Demo Resident login (Real Firebase Auth)
    console.log('Test 6: Demo Resident Login (Real Firebase Auth)...');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#demo-resident-btn');
    await page.click('#demo-resident-btn');
    await page.waitForFunction(() => window.location.pathname === '/dashboard', { timeout: 15000 });
    await page.waitForSelector('h1', { timeout: 5000 });
    await sleep(600);
    const residentUrl = page.url();
    const residentH1 = await page.$eval('h1', el => el.textContent);
    console.log('  Resident URL:', residentUrl, 'Greeting:', residentH1);
    results['6. Demo Resident'] = (residentUrl.includes('/dashboard') && residentH1.includes('Welcome')) ? 'PASS' : 'FAIL';

    // 15. Resident Dashboard structure
    console.log('Test 15: Resident Dashboard verification...');
    const bodyText = await page.$eval('body', el => el.innerText);
    const hasHostel = bodyText.includes('Hostel Accommodation');
    const hasMess = bodyText.includes('Smart Mess & Dining Timetable');
    const hasMaint = bodyText.includes('Maintenance & Service Requests');
    results['15. Resident Dashboard'] = (hasHostel && hasMess && hasMaint) ? 'PASS' : 'FAIL';

    // 11. Resident attempting /admin/dashboard
    console.log('Test 11: Resident attempting /admin/dashboard...');
    await page.goto(`${baseUrl}/admin/dashboard`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.location.pathname === '/dashboard', { timeout: 15000 });
    await sleep(800);
    const redirectedUrl = page.url();
    const redirectedBody = await page.$eval('body', el => el.innerText);
    console.log('  URL after attempt:', redirectedUrl);
    console.log('  Has restricted notice:', redirectedBody.includes('Warden access is not enabled'));
    results['11. Resident -> /admin/dashboard'] = (redirectedUrl.includes('/dashboard') && redirectedBody.includes('Warden access is not enabled')) ? 'PASS' : 'FAIL';

    // 13. Hero dashboard CTA for Resident
    console.log('Test 13: Hero dashboard CTA for Resident...');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('a[href="/dashboard"]') !== null, { timeout: 10000 });
    const heroBtnHref = await page.$eval('a[href="/dashboard"]', el => el.getAttribute('href'));
    console.log('  Hero CTA href:', heroBtnHref);
    results['13. Hero Dashboard CTA'] = heroBtnHref === '/dashboard' ? 'PASS' : 'FAIL';

    // 8. Logout
    console.log('Test 8: Logout...');
    const logoutBtn = await page.waitForSelector('button[title="Log out"]');
    await logoutBtn.click();
    await page.waitForFunction(() => window.location.pathname === '/', { timeout: 10000 });
    results['8. Logout'] = page.url() === `${baseUrl}/` ? 'PASS' : 'FAIL';

    // 7. Demo Warden login (Real Firebase Auth)
    console.log('Test 7: Demo Warden Login (Real Firebase Auth)...');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#demo-warden-btn');
    await page.click('#demo-warden-btn');
    await page.waitForFunction(() => window.location.pathname === '/admin/dashboard', { timeout: 15000 });
    await page.waitForSelector('h1', { timeout: 5000 });
    await sleep(600);
    const wardenUrl = page.url();
    const wardenH1 = await page.$eval('h1', el => el.textContent);
    console.log('  Warden URL:', wardenUrl, 'Greeting:', wardenH1);
    results['7. Demo Warden'] = (wardenUrl.includes('/admin/dashboard') && wardenH1.includes('Operations Desk')) ? 'PASS' : 'FAIL';

    // 14. Warden Dashboard structure
    console.log('Test 14: Warden Dashboard verification...');
    const wardenBodyText = await page.$eval('body', el => el.innerText);
    const hasWardenHostel = wardenBodyText.includes('Hostel Operations');
    const hasWardenMess = wardenBodyText.includes('Smart Mess Operations');
    const hasWardenMaint = wardenBodyText.includes('Maintenance Operations');
    results['14. Warden Dashboard'] = (hasWardenHostel && hasWardenMess && hasWardenMaint) ? 'PASS' : 'FAIL';

    // 12. Warden visiting /dashboard
    console.log('Test 12: Warden visiting /dashboard...');
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'domcontentloaded' });
    await sleep(2000);
    const wardenRedirect = page.url();
    console.log('  URL after /dashboard attempt as Warden:', wardenRedirect);
    results['12. Warden -> /dashboard'] = wardenRedirect.includes('/admin/dashboard') ? 'PASS' : 'FAIL';

    // Logout Warden
    console.log('Logging out Warden...');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await sleep(600);
    const logoutBtn2 = await page.waitForSelector('button[title="Log out"]');
    await logoutBtn2.click();
    await sleep(1500);

    // 4. Manual Resident Login with typed credentials
    console.log('Test 4: Manual Resident Login...');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
    await sleep(600);
    await page.type('input[type="email"]', 'demo-resident@hostel.edu');
    await page.type('input[type="password"]', 'Hostel@2026Demo');
    await page.click('button[type="submit"]');
    await sleep(4000);
    console.log('  Manual Resident URL:', page.url());
    results['4. Resident Login'] = page.url().includes('/dashboard') ? 'PASS' : 'FAIL';

    // Logout
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await sleep(600);
    const logoutBtn3 = await page.waitForSelector('button[title="Log out"]');
    await logoutBtn3.click();
    await sleep(1500);

    // 5. Manual Warden Login with typed credentials
    console.log('Test 5: Manual Warden Login...');
    await page.goto(`${baseUrl}/login?role=warden`, { waitUntil: 'domcontentloaded' });
    await sleep(600);
    await page.type('input[type="email"]', 'demo-warden@hostel.edu');
    await page.type('input[type="password"]', 'Hostel@2026Demo');
    await page.click('button[type="submit"]');
    await sleep(4000);
    console.log('  Manual Warden URL:', page.url());
    results['5. Warden Login'] = page.url().includes('/admin/dashboard') ? 'PASS' : 'FAIL';

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
  }

  console.log('\n=========================================');
  console.log('FINAL BROWSER AUTOMATION AUDIT RESULTS');
  console.log('=========================================');
  for (const [test, result] of Object.entries(results)) {
    console.log(`${result === 'PASS' ? '✅' : '❌'} ${test}: ${result}`);
  }
}

runTests();
