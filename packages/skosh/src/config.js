'use strict';

const path = require('node:path');
const fse = require('fs-extra');

/** The file the CLI reads and rewrites inside a skosh project. */
const CONFIG_FILE = 'skosh.config.ts';

/** Per-template defaults written into skosh.config.ts. */
const TEMPLATES = {
  fashion: { label: 'Fashion (editorial, serif accents)', buckets: [5000, 10000, 20000] },
  grocery: { label: 'Grocery (fresh, quantity-first)', buckets: [300, 600, 1200] },
  electronics: {
    label: 'Electronics (technical, dark-friendly)',
    buckets: [10000, 50000, 100000],
  },
};

/** Reads the ACTIVE_TEMPLATE currently set in a project's config, or null. */
async function readActiveTemplate(projectDir) {
  const configPath = path.join(projectDir, CONFIG_FILE);
  if (!(await fse.pathExists(configPath))) return null;
  const config = await fse.readFile(configPath, 'utf8');
  const match = config.match(/ACTIVE_TEMPLATE: TemplateName = '([a-z]+)'/);
  return match ? match[1] : null;
}

/** Rewrites ACTIVE_TEMPLATE and the price buckets in a project's config. */
async function applyTemplate(projectDir, template) {
  const configPath = path.join(projectDir, CONFIG_FILE);
  let config = await fse.readFile(configPath, 'utf8');
  config = config.replace(
    /ACTIVE_TEMPLATE: TemplateName = '[a-z]+'/,
    `ACTIVE_TEMPLATE: TemplateName = '${template}'`,
  );
  config = config.replace(
    /PRICE_BUCKET_BOUNDS_MINOR: \[number, number, number\] = \[[^\]]*\]/,
    `PRICE_BUCKET_BOUNDS_MINOR: [number, number, number] = [${TEMPLATES[template].buckets.join(', ')}]`,
  );
  await fse.writeFile(configPath, config);
}

module.exports = { CONFIG_FILE, TEMPLATES, applyTemplate, readActiveTemplate };
