'use strict';

const { execSync } = require('node:child_process');
const os = require('node:os');
const path = require('node:path');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const fse = require('fs-extra');
const pc = require('picocolors');
const tar = require('tar');

const { CONFIG_FILE, applyTemplate } = require('./config');

/** GitHub repo and ref the template tarball is fetched from when not running locally. */
const TEMPLATE_REPO = process.env.SKOSH_TEMPLATE_REPO || 'kodaraj/skosh';
const TEMPLATE_REF = process.env.SKOSH_TEMPLATE_REF || 'main';

const PACKAGE_MANAGERS = ['npm', 'yarn', 'pnpm', 'bun'];

/** Top-level entries never copied into a new project. */
const EXCLUDES = new Set(['node_modules', '.git', '.expo', 'packages', 'dist', '.DS_Store']);

/**
 * Finds the template files: a local checkout when available (SKOSH_TEMPLATE_DIR
 * or running from inside the repo), otherwise the GitHub tarball.
 */
async function resolveTemplateDir() {
  const envDir = process.env.SKOSH_TEMPLATE_DIR;
  if (envDir) return path.resolve(envDir);

  const localRepo = path.resolve(__dirname, '..', '..', '..');
  if (await fse.pathExists(path.join(localRepo, CONFIG_FILE))) return localRepo;

  const tmp = await fse.mkdtemp(path.join(os.tmpdir(), 'skosh-template-'));
  const url = `https://codeload.github.com/${TEMPLATE_REPO}/tar.gz/refs/heads/${TEMPLATE_REF}`;
  console.log(`Downloading template from ${TEMPLATE_REPO}...`);
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Could not download the template (HTTP ${response.status}) from ${url}`);
  }
  await pipeline(Readable.fromWeb(response.body), tar.x({ cwd: tmp, strip: 1 }));
  return tmp;
}

/** Rewrites app identity and template config inside the freshly copied project. */
async function personalize(dest, { name, template }) {
  const pkgPath = path.join(dest, 'package.json');
  const pkg = await fse.readJson(pkgPath);
  pkg.name = name;
  pkg.version = '0.1.0';
  await fse.writeJson(pkgPath, pkg, { spaces: 2 });

  const appJsonPath = path.join(dest, 'app.json');
  const appJson = await fse.readJson(appJsonPath);
  appJson.expo.name = name;
  appJson.expo.slug = name;
  appJson.expo.scheme = name.replace(/[^a-z0-9]/g, '') || 'skosh';
  await fse.writeJson(appJsonPath, appJson, { spaces: 2 });

  await applyTemplate(dest, template);
}

async function scaffold({ name, template, packageManager, install, git }) {
  const dest = path.resolve(process.cwd(), name);
  if (await fse.pathExists(dest)) {
    throw new Error(`The directory ${name} already exists. Choose another name or remove it.`);
  }

  const source = await resolveTemplateDir();
  console.log(`\nCreating ${pc.bold(name)} with the ${pc.bold(template)} template...`);
  await fse.copy(source, dest, {
    filter: (src) => !EXCLUDES.has(path.basename(src)),
  });
  await personalize(dest, { name, template });

  if (git) {
    try {
      execSync('git init', { cwd: dest, stdio: 'ignore' });
      execSync('git add -A', { cwd: dest, stdio: 'ignore' });
      execSync('git commit -m "Initial commit from skosh"', { cwd: dest, stdio: 'ignore' });
      console.log('Initialized a git repository.');
    } catch {
      console.log(pc.yellow('Skipped git setup (is git installed and configured?).'));
    }
  }

  if (install) {
    console.log(`Installing dependencies with ${packageManager}...\n`);
    execSync(`${packageManager} install`, { cwd: dest, stdio: 'inherit' });
  }

  console.log(`\n${pc.green('Done.')} Next steps:\n`);
  console.log(`  cd ${name}`);
  if (!install) console.log(`  ${packageManager} install`);
  console.log('  npx expo start\n');
  console.log('The app runs on bundled mock data out of the box.');
  console.log('To connect Supabase or your own API, see the README.\n');
}

module.exports = { PACKAGE_MANAGERS, scaffold };
