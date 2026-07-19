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

/** GitHub repo the template tarball is fetched from when not running locally. */
const TEMPLATE_REPO = process.env.SKOSH_TEMPLATE_REPO || 'kodaraj/skosh';
/** Optional pinned ref; when unset the repo's default branch is discovered. */
const TEMPLATE_REF = process.env.SKOSH_TEMPLATE_REF || '';

const PACKAGE_MANAGERS = ['npm', 'yarn', 'pnpm', 'bun'];

/** Top-level entries never copied into a new project. */
const EXCLUDES = new Set(['node_modules', '.git', '.expo', 'packages', 'dist', '.DS_Store']);

/** Asks GitHub for the repo's default branch, or null if it cannot be reached. */
async function fetchDefaultBranch(repo) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return typeof data.default_branch === 'string' ? data.default_branch : null;
  } catch {
    return null;
  }
}

/**
 * Builds the ordered list of refs to try. An explicit SKOSH_TEMPLATE_REF wins;
 * otherwise the repo's default branch is tried first, then common fallbacks.
 */
async function resolveRefs(repo) {
  if (TEMPLATE_REF) return [TEMPLATE_REF];
  const seen = new Set();
  const refs = [await fetchDefaultBranch(repo), 'main', 'master'].filter((ref) => {
    if (!ref || seen.has(ref)) return false;
    seen.add(ref);
    return true;
  });
  return refs;
}

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
  const refs = await resolveRefs(TEMPLATE_REPO);
  console.log(`Downloading template from ${TEMPLATE_REPO}...`);

  let lastStatus = 0;
  for (const ref of refs) {
    const url = `https://codeload.github.com/${TEMPLATE_REPO}/tar.gz/refs/heads/${ref}`;
    const response = await fetch(url);
    if (response.ok && response.body) {
      await pipeline(Readable.fromWeb(response.body), tar.x({ cwd: tmp, strip: 1 }));
      return tmp;
    }
    lastStatus = response.status;
  }

  throw new Error(
    `Could not download the template from ${TEMPLATE_REPO} (last HTTP ${lastStatus}). ` +
      `Tried: ${refs.join(', ') || 'no refs'}. ` +
      'Set SKOSH_TEMPLATE_REF to a valid branch or tag.',
  );
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
