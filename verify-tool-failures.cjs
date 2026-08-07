const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'http://localhost:1000';
const PROJECT_DIR = __dirname;
const FAILURE_DIR = path.join(PROJECT_DIR, 'tool-failures');
const REPORT_FILE = path.join(PROJECT_DIR, 'tool-failures-report.json');
const MD_REPORT_FILE = path.join(PROJECT_DIR, 'tool-failures-report.md');

// ---- 1. Build the slug list from the tool-failures folder ----
if (!fs.existsSync(FAILURE_DIR)) {
  console.error('tool-failures folder not found');
  process.exit(1);
}
const slugs = fs
  .readdirSync(FAILURE_DIR)
  .filter((f) => f.endsWith('.png'))
  .map((f) => f.replace(/\.png$/, ''))
  .sort();

console.log(`=== Tool-Failures Verification ===`);
console.log(`Slugs to verify (from tool-failures/): ${slugs.length}`);

// ---- 2. Auth flags from tool-slugs.json ----
const slugMeta = {};
try {
  const allSlugs = JSON.parse(fs.readFileSync(path.join(PROJECT_DIR, 'tool-slugs.json'), 'utf8'));
  for (const t of allSlugs) slugMeta[t.slug] = t;
} catch (e) {
  console.warn('Could not read tool-slugs.json, auth flags unavailable:', e.message);
}

const NOISE_PATTERNS = [
  'Not signed in with the identity provider',
  'Firebase',
  'auth/',
  'token',
  'signInWith',
  'Failed to load resource',
  'GSI_LOGGER',
  'given origin is not allowed',
  'favicon',
  'ERR_CONNECTION_REFUSED',
  'net::',
];

function isNoise(msg) {
  return NOISE_PATTERNS.some((p) => msg.includes(p));
}

const ACTION_BUTTON_RE = /(encode|decode|convert|generate|format|run|calculate|transform|encrypt|decrypt|hash|slug|preview|build|create|compress|optimize|translate|analyze|parse|validate|submit|count|sort|shuffle|reverse|compare|extract|minify|beautify|add|start|go|render|compile|execute|compute|lookup|check|test|split|merge|wrap|trim|upper|lower|capitalize)/i;
const NON_ACTION_RE = /(copy|clear|reset|download|export|close|cancel|delete|remove|back|share|theme|dark|light|menu|sidebar)/i;

function sampleValueFor(element, placeholder) {
  const type = element.getAttribute('type');
  if (type === 'number') return '2026';
  if (placeholder && /json|yaml|toml|url|email|domain|query|sql|css|html|markdown|base64|regex|color|hex/i.test(placeholder)) {
    if (/color|hex/i.test(placeholder)) return '#ff5722';
    if (/url|domain/i.test(placeholder)) return 'https://devspace.tools/tools/json-formatter';
    if (/email/i.test(placeholder)) return 'dev@devspace.tools';
    return '{"name":"DevSpace","year":2026}';
  }
  return 'Hello DevSpace 2026';
}

async function interact(page) {
  const editable = page.locator('textarea:visible, input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="color"]):not([type="range"]):not([type="file"]):visible');
  const editableCount = await editable.count();
  const filled = Math.min(editableCount, 3);
  for (let i = 0; i < filled; i++) {
    const el = editable.nth(i);
    try {
      const ph = (await el.getAttribute('placeholder')) || '';
      const val = sampleValueFor(await el.evaluate((n) => n), ph);
      await el.fill(val);
    } catch (e) {
      /* skip unfillable */
    }
  }

  // Pick an action button
  let clicked = false;
  const buttons = page.locator('button:not([disabled]):visible');
  const btnCount = await buttons.count();
  for (let i = 0; i < btnCount; i++) {
    const b = buttons.nth(i);
    const text = ((await b.innerText().catch(() => '')) || '').trim();
    if (!text || text.length > 40) continue;
    if (NON_ACTION_RE.test(text)) continue;
    if (!ACTION_BUTTON_RE.test(text)) continue;
    await b.click().catch(() => {});
    clicked = true;
    break;
  }
  if (!clicked && btnCount > 0) {
    // Fallback: first visible enabled button with short text that isn't a nav element
    for (let i = 0; i < btnCount; i++) {
      const b = buttons.nth(i);
      const text = ((await b.innerText().catch(() => '')) || '').trim();
      if (!text || text.length > 20) continue;
      if (NON_ACTION_RE.test(text)) continue;
      await b.click().catch(() => {});
      clicked = true;
      break;
    }
  }
  await page.waitForTimeout(900);
  return { filled, clicked };
}

async function verifyTool(page, slug, index) {
  const url = `${TARGET_URL}/tools/${slug}`;
  console.log(`[${index + 1}/${slugs.length}] ${slug}`);

  const consoleErrors = [];
  const pageErrors = [];
  const onConsole = (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); };
  const onPageError = (e) => pageErrors.push(e.message);
  page.on('console', onConsole);
  page.on('pageerror', onPageError);

  const result = {
    slug,
    status: 'unknown',
    httpStatus: null,
    reason: null,
    realConsoleErrors: [],
    pageErrors: [],
    noiseCount: 0,
    interaction: { filled: 0, clicked: false },
    authRedirect: false,
  };

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    result.httpStatus = response?.status() || 0;

    // Auth-gated tool redirected to login
    if (page.url().includes('/login')) {
      result.status = 'auth-gated';
      result.authRedirect = true;
      return result;
    }

    if (result.httpStatus >= 400) {
      result.status = 'broken';
      result.reason = `HTTP ${result.httpStatus}`;
      return result;
    }

    await page.waitForTimeout(1200);

    // Error / placeholder states
    if ((await page.locator('text=Something went wrong').count()) > 0) {
      result.status = 'broken';
      result.reason = 'Error boundary ("Something went wrong")';
      return result;
    }
    if ((await page.locator('text=Tool not found').count()) > 0) {
      result.status = 'broken';
      result.reason = 'Tool not found';
      return result;
    }
    if ((await page.locator('text=Coming soon').count()) > 0) {
      result.status = 'broken';
      result.reason = 'Coming soon placeholder';
      return result;
    }

    // Functional interaction
    result.interaction = await interact(page);

    // Classify
    const real = consoleErrors.filter((e) => !isNoise(e));
    result.noiseCount = consoleErrors.length - real.length;
    result.realConsoleErrors = real.slice(0, 5);
    result.pageErrors = pageErrors.slice(0, 5);

    if (pageErrors.length > 0) {
      result.status = 'broken';
      result.reason = `Page error: ${pageErrors[0]}`;
    } else if (real.length > 0) {
      result.status = 'broken';
      result.reason = `Console error: ${real[0]}`;
    } else {
      result.status = 'working';
    }
  } catch (error) {
    result.status = 'broken';
    result.reason = error.message;
    result.pageErrors = pageErrors.slice(0, 5);
  } finally {
    page.removeListener('console', onConsole);
    page.removeListener('pageerror', onPageError);
  }

  return result;
}

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // Warm up
  console.log('Verifying main page loads...');
  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
  console.log('Main page OK\n');

  const results = [];
  for (let i = 0; i < slugs.length; i++) {
    const r = await verifyTool(page, slugs[i], i);
    results.push(r);
    if (r.status === 'working') console.log(`  ✓ working`);
    else console.log(`  ✗ ${r.status}: ${r.reason}`);
  }

  await browser.close();

  const working = results.filter((r) => r.status === 'working');
  const broken = results.filter((r) => r.status === 'broken');
  const authGated = results.filter((r) => r.status === 'auth-gated');

  const report = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    working: working.length,
    broken: broken.length,
    authGated: authGated.length,
    results,
  };
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  // ---- 3. Clean up tool-failures: keep only broken ----
  const brokenSet = new Set(broken.map((r) => r.slug));
  let deleted = 0;
  for (const f of fs.readdirSync(FAILURE_DIR)) {
    if (!f.endsWith('.png')) continue;
    const slug = f.replace(/\.png$/, '');
    if (!brokenSet.has(slug)) {
      fs.rmSync(path.join(FAILURE_DIR, f), { force: true });
      deleted++;
    }
  }
  // Save fresh screenshots for broken tools
  const bctx = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const bpage = await bctx.newPage({ viewport: { width: 1280, height: 900 } });
  for (const b of broken) {
    try {
      await bpage.goto(`${TARGET_URL}/tools/${b.slug}`, { waitUntil: 'networkidle', timeout: 30000 });
      await bpage.waitForTimeout(800);
      await bpage.screenshot({ path: path.join(FAILURE_DIR, `${b.slug}.png`), fullPage: true });
    } catch (e) { /* ignore */ }
  }
  await bctx.close();

  // ---- 4. Markdown report ----
  const md = [
    `# Tool-Failures Verification Report`,
    ``,
    `Generated: ${report.generatedAt}`,
    ``,
    `## Summary`,
    `- **Total checked**: ${results.length}`,
    `- **Working**: ${working.length} ✓`,
    `- **Broken**: ${broken.length} ✗`,
    `- **Auth-gated**: ${authGated.length} ⚠️`,
    `- **Screenshots removed (stale)**: ${deleted}`,
    ``,
  ];

  if (broken.length > 0) {
    md.push(`## Broken (${broken.length})`, ``);
    for (const b of broken) {
      md.push(`### ${b.slug}`);
      md.push(`- **Reason**: ${b.reason}`);
      if (b.realConsoleErrors.length) md.push(`- **Console errors**: ${b.realConsoleErrors.join(' | ')}`);
      if (b.pageErrors.length) md.push(`- **Page errors**: ${b.pageErrors.join(' | ')}`);
      md.push(``);
    }
  } else {
    md.push(`## Broken`, `None — all tools pass. 🎉`, ``);
  }

  if (authGated.length > 0) {
    md.push(`## Auth-gated (redirect to login, not functionally tested) (${authGated.length})`, ``);
    md.push(authGated.map((a) => `- ${a.slug}`).join('\n'), ``);
  }

  fs.writeFileSync(MD_REPORT_FILE, md.join('\n'));

  console.log('');
  console.log('=== DONE ===');
  console.log(`Working: ${working.length} | Broken: ${broken.length} | Auth-gated: ${authGated.length}`);
  console.log(`Stale screenshots removed: ${deleted}`);
  if (broken.length > 0) {
    console.log('Broken:');
    broken.forEach((b) => console.log(`  - ${b.slug}: ${b.reason}`));
  }
  console.log(`\nReport: ${REPORT_FILE}`);
  console.log(`Markdown: ${MD_REPORT_FILE}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
