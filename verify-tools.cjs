const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'http://localhost:1000';
const PROJECT_DIR = 'C:\\Users\\guntu\\OneDrive\\Desktop\\DevSpace\\devspace';
const TOOL_SLUGS = JSON.parse(fs.readFileSync(path.join(PROJECT_DIR, 'tool-slugs.json'), 'utf8'));
const FAILURE_DIR = path.join(PROJECT_DIR, 'tool-failures');
const REPORT_FILE = path.join(PROJECT_DIR, 'tool-verification-report.json');

// Create failure screenshots directory
if (!fs.existsSync(FAILURE_DIR)) {
  fs.mkdirSync(FAILURE_DIR, { recursive: true });
}

const results = {
  passed: [],
  failed: [],
  authRedirect: [],
  skipped: [],
  startTime: new Date().toISOString(),
  endTime: null
};

async function verifyTool(page, tool, index) {
  const { slug, requiresAuth } = tool;
  const url = `${TARGET_URL}/tools/${slug}`;
  
  console.log(`[${index + 1}/${TOOL_SLUGS.length}] Testing: ${slug}`);
  
  const consoleErrors = [];
  const pageErrors = [];
  
  // Listen for console errors
  const consoleHandler = msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  };
  page.on('console', consoleHandler);
  
  // Listen for page errors (uncaught exceptions)
  const pageErrorHandler = err => {
    pageErrors.push(err.message);
  };
  page.on('pageerror', pageErrorHandler);
  
  try {
    // Navigate to tool page
    const response = await page.goto(url, { 
      waitUntil: 'networkidle',
      timeout: 20000 
    });
    
    const statusCode = response?.status() || 0;
    
    // Check if redirected to login (for auth-required tools)
    if (requiresAuth && page.url().includes('/login')) {
      console.log(`  ✓ Auth redirect working (redirected to login)`);
      results.authRedirect.push({ slug, statusCode });
      return;
    }
    
    // Check if page loaded successfully
    if (statusCode >= 400) {
      throw new Error(`HTTP ${statusCode}`);
    }
    
    // Wait a bit for React to render
    await page.waitForTimeout(1000);
    
    // Check for common error indicators
    const hasErrorBoundary = await page.locator('text=Something went wrong').count() > 0;
    const hasNotFound = await page.locator('text=Tool not found').count() > 0;
    const hasComingSoon = await page.locator('text=Coming soon').count() > 0;
    const hasError = await page.locator('[class*="error"]').count() > 0;
    
    // Check if tool content is rendered (look for common tool elements)
    const hasContent = await page.locator('input, textarea, select, button, [contenteditable]').count() > 0;
    const hasToolLayout = await page.locator('.flex.flex-col.gap-5').count() > 0;
    
    if (hasErrorBoundary || hasNotFound) {
      throw new Error('Error boundary or not found state detected');
    }
    
    // Check for console/page errors
    // Filter out expected Firebase auth errors and Google Identity Services noise
    const realConsoleErrors = consoleErrors.filter(e => 
      !e.includes('Not signed in with the identity provider') &&
      !e.includes('Firebase') &&
      !e.includes('auth/') &&
      !e.includes('token') &&
      !e.includes('signInWith') &&
      !e.includes('Failed to load resource') &&
      !e.includes('GSI_LOGGER') &&
      !e.includes('given origin is not allowed')
    );
    
    if (pageErrors.length > 0) {
      throw new Error(`Page errors: ${pageErrors.join(', ')}`);
    }
    
    // Take screenshot on failure
    if (realConsoleErrors.length > 0 || !hasContent) {
      const screenshotPath = path.join(FAILURE_DIR, `${slug}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  ⚠ Screenshot saved: ${screenshotPath}`);
    }
    
    if (hasComingSoon) {
      console.log(`  ⚠ Coming soon placeholder`);
      results.failed.push({ 
        slug, 
        reason: 'Coming soon placeholder',
        consoleErrors: realConsoleErrors,
        pageErrors
      });
    } else if (realConsoleErrors.length > 0) {
      console.log(`  ✗ Console errors: ${realConsoleErrors[0]}`);
      results.failed.push({ 
        slug, 
        reason: `Console errors: ${realConsoleErrors[0]}`,
        consoleErrors: realConsoleErrors,
        pageErrors
      });
    } else {
      console.log(`  ✓ Passed`);
      results.passed.push({ slug, hasContent, hasToolLayout });
    }
    
  } catch (error) {
    console.log(`  ✗ Failed: ${error.message}`);
    
    // Take failure screenshot
    try {
      const screenshotPath = path.join(FAILURE_DIR, `${slug}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  Screenshot saved: ${screenshotPath}`);
    } catch (e) {
      // Ignore screenshot errors
    }
    
    results.failed.push({ 
      slug, 
      reason: error.message,
      consoleErrors,
      pageErrors
    });
  } finally {
    page.removeListener('console', consoleHandler);
    page.removeListener('pageerror', pageErrorHandler);
  }
}

async function main() {
  console.log('=== Tool Verification Script ===');
  console.log(`Total tools to verify: ${TOOL_SLUGS.length}`);
  console.log(`Target: ${TARGET_URL}`);
  console.log('');
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // First, verify the main page loads
  console.log('Verifying main page...');
  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
  console.log('Main page loaded successfully');
  console.log('');
  
  // Verify tools page loads
  console.log('Verifying tools listing page...');
  await page.goto(`${TARGET_URL}/tools`, { waitUntil: 'networkidle', timeout: 30000 });
  console.log('Tools page loaded successfully');
  console.log('');
  
  // Verify each tool
  for (let i = 0; i < TOOL_SLUGS.length; i++) {
    await verifyTool(page, TOOL_SLUGS[i], i);
    
    // Small delay between tests to avoid overwhelming the server
    if (i % 10 === 9) {
      await page.waitForTimeout(500);
    }
  }
  
  await browser.close();
  
  results.endTime = new Date().toISOString();
  
  // Generate report
  console.log('');
  console.log('=== VERIFICATION COMPLETE ===');
  console.log(`Passed: ${results.passed.length}`);
  console.log(`Failed: ${results.failed.length}`);
  console.log(`Auth Redirects: ${results.authRedirect.length}`);
  console.log(`Skipped: ${results.skipped.length}`);
  console.log('');
  
  if (results.failed.length > 0) {
    console.log('Failed tools:');
    results.failed.forEach(f => {
      console.log(`  - ${f.slug}: ${f.reason}`);
    });
  }
  
  // Save report
  fs.writeFileSync(REPORT_FILE, JSON.stringify(results, null, 2));
  console.log('');
  console.log(`Full report saved to: ${REPORT_FILE}`);
  
  // Generate markdown summary
  const mdReport = `# Tool Verification Report

Generated: ${results.startTime}

## Summary
- **Total Tools**: ${TOOL_SLUGS.length}
- **Passed**: ${results.passed.length} ✓
- **Failed**: ${results.failed.length} ✗
- **Auth Redirects**: ${results.authRedirect.length} (expected for auth-required tools)

## Failed Tools
${results.failed.length > 0 ? results.failed.map(f => `### ${f.slug}
- **Reason**: ${f.reason}
- **Console Errors**: ${f.consoleErrors.length > 0 ? f.consoleErrors.join(', ') : 'None'}
- **Page Errors**: ${f.pageErrors.length > 0 ? f.pageErrors.join(', ') : 'None'}
`).join('\n') : 'No failures!'}

## Auth Redirect Tools (${results.authRedirect.length})
${results.authRedirect.map(a => `- ${a.slug}`).join('\n')}
`;
  
  fs.writeFileSync(path.join(__dirname, 'tool-verification-report.md'), mdReport);
  console.log('Markdown report saved to: tool-verification-report.md');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
