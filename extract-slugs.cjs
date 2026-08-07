const fs = require('fs');
const content = fs.readFileSync('src/data/tools.ts', 'utf8');

// Extract slugs from explicit TOOLS entries (slug: "...")
const explicitSlugs = [];
const explicitRegex = /slug:\s*["']([^"']+)["']/g;
let match;
while ((match = explicitRegex.exec(content)) !== null) {
  explicitSlugs.push(match[1]);
}

// Extract ids from oldTools (id: "...")
const oldToolIds = [];
const oldToolRegex = /\{\s*id:\s*["']([^"']+)["']/g;
while ((match = oldToolRegex.exec(content)) !== null) {
  oldToolIds.push(match[1]);
}

// The TOOLS array includes oldTools mapped with slug: t.id
// So we need to combine both, but oldTools that are also in explicitSlugs are overridden
const explicitSet = new Set(explicitSlugs);
const oldToolsMapped = oldToolIds.filter(id => !explicitSet.has(id));

const allSlugs = [...new Set([...explicitSlugs, ...oldToolsMapped])];

// Extract requiresAuth info from explicit TOOLS entries
const authMap = {};
const authRegex = /slug:\s*["']([^"']+)["'][\s\S]*?requiresAuth:\s*(true|false)/g;
while ((match = authRegex.exec(content)) !== null) {
  authMap[match[1]] = match[2] === 'true';
}

console.log('Total unique slugs:', allSlugs.length);
console.log('Explicit slugs:', explicitSlugs.length);
console.log('Old tools mapped:', oldToolsMapped.length);
console.log('Auth-required tools:', Object.values(authMap).filter(v => v).length);

// Save to JSON for the Playwright script
const toolData = allSlugs.map(slug => ({
  slug,
  requiresAuth: authMap[slug] || false
}));
fs.writeFileSync('tool-slugs.json', JSON.stringify(toolData, null, 2));
console.log('Saved to tool-slugs.json');
