// @ai-native-solutions/fallestate-sdk
// Programmatic access to the FallEstate tool catalogue.
// Zero dependencies. ESM + browser + Node.
// MIT · AI-Native Solutions

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load the embedded catalogue. Works in Node; browser callers should import tools.json directly.
let TOOLS = [];
try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  TOOLS = JSON.parse(fs.readFileSync(path.join(__dirname, 'tools.json'), 'utf8'));
} catch {
  // In browser or bundler contexts, callers can call setCatalogue().
  TOOLS = [];
}

const LAYER_NAMES = {
  0: 'Substrate',
  1: 'Insight',
  2: 'Signal',
  3: 'Island Stack',
  4: 'Mobile / Mesh',
  5: 'AI Substrate',
  6: 'SMB Verticals',
  7: 'SDK / MCP',
  8: 'Specialised'
};

/**
 * Replace the in-memory catalogue (useful in browsers where fs isn't available).
 * @param {Array} tools
 */
export function setCatalogue(tools) {
  if (!Array.isArray(tools)) throw new TypeError('setCatalogue expects an array');
  TOOLS = tools;
}

/**
 * Return the full catalogue (defensive copy).
 * @returns {Array}
 */
export function listTools() {
  return TOOLS.slice();
}

/**
 * Return one tool by exact name (case-insensitive), or null.
 * @param {string} name
 */
export function getTool(name) {
  if (!name) return null;
  const needle = String(name).toLowerCase();
  return TOOLS.find(t => t.name.toLowerCase() === needle) || null;
}

/**
 * Return every tool in the given layer (0-8).
 * @param {number} layer
 */
export function byLayer(layer) {
  const n = Number(layer);
  if (!Number.isFinite(n)) return [];
  return TOOLS.filter(t => t.layer === n);
}

/**
 * Full-text search across name, tag, does, kills, saves, helps.
 * Case-insensitive substring match. Returns ranked by field priority.
 * @param {string} query
 * @param {{ limit?: number }} [opts]
 */
export function search(query, opts = {}) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];
  const limit = opts.limit || 50;
  const scored = [];
  for (const t of TOOLS) {
    let score = 0;
    if (t.name.toLowerCase().includes(q)) score += 10;
    if ((t.tag || '').toLowerCase().includes(q)) score += 5;
    if ((t.does || '').toLowerCase().includes(q)) score += 3;
    if ((t.kills || '').toLowerCase().includes(q)) score += 2;
    if ((t.saves || '').toLowerCase().includes(q)) score += 2;
    if ((t.helps || '').toLowerCase().includes(q)) score += 2;
    if (score > 0) scored.push({ tool: t, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.tool);
}

/**
 * Aggregate catalogue statistics.
 */
export function stats() {
  const byLayerCount = {};
  const withGithub = TOOLS.filter(t => t.github).length;
  for (let l = 0; l <= 8; l++) {
    byLayerCount[l] = { name: LAYER_NAMES[l], count: TOOLS.filter(t => t.layer === l).length };
  }
  return {
    total: TOOLS.length,
    layers: byLayerCount,
    withGithub,
    withoutGithub: TOOLS.length - withGithub
  };
}

/**
 * Return the canonical layer map { 0: 'Substrate', ... }.
 */
export function layers() {
  return { ...LAYER_NAMES };
}

/**
 * Render a single tool as a Markdown block (does/kills/saves/helps).
 * @param {object|string} toolOrName
 */
export function toMarkdown(toolOrName) {
  const t = typeof toolOrName === 'string' ? getTool(toolOrName) : toolOrName;
  if (!t) return '';
  const lines = [];
  lines.push(`## ${t.name}`);
  lines.push(`_${LAYER_NAMES[t.layer]} · Layer ${t.layer}_`);
  if (t.tag) lines.push(`\n> ${t.tag}\n`);
  if (t.does)  lines.push(`- **Does:** ${t.does}`);
  if (t.kills) lines.push(`- **Kills:** ${t.kills}`);
  if (t.saves) lines.push(`- **Saves:** ${t.saves}`);
  if (t.helps) lines.push(`- **Helps:** ${t.helps}`);
  if (t.github) lines.push(`\n[Repository](${t.github})`);
  return lines.join('\n');
}

/**
 * Return every tool that ships with a public GitHub repo.
 */
export function withGithub() {
  return TOOLS.filter(t => !!t.github);
}

// CLI smoke-test when run directly: `node src/index.js`
if (import.meta.url.startsWith('file:') && process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const s = stats();
  console.log(`FallEstate SDK · ${s.total} tools across ${Object.keys(s.layers).length} layers`);
  console.log('Layers:');
  for (const [n, l] of Object.entries(s.layers)) {
    console.log(`  ${n}. ${l.name.padEnd(15)} ${l.count}`);
  }
  console.log(`\nSample: getTool('FallEnterprise') →`);
  const sample = getTool('FallEnterprise');
  if (sample) console.log(`  ${sample.tag}`);
}

export default {
  listTools,
  getTool,
  byLayer,
  search,
  stats,
  layers,
  toMarkdown,
  withGithub,
  setCatalogue
};
