'use strict';

const path = require('node:path');
const fse = require('fs-extra');
const pc = require('picocolors');
const prompts = require('prompts');

const { HELP, parseArgs, validateName } = require('./args');
const { CONFIG_FILE, TEMPLATES, applyTemplate, readActiveTemplate } = require('./config');
const { PACKAGE_MANAGERS, scaffold } = require('./scaffold');

const onCancel = () => {
  console.log(pc.yellow('Cancelled.'));
  process.exit(1);
};

/** Name must be valid and not collide with an existing directory. */
function validateNewProjectName(name) {
  const base = validateName(name);
  if (base !== true) return base;
  if (fse.pathExistsSync(path.resolve(process.cwd(), name))) {
    return `The directory ${name} already exists. Choose another name or remove it.`;
  }
  return true;
}

function templateChoices(current) {
  return Object.entries(TEMPLATES).map(([value, meta]) => ({
    title: value === current ? `${meta.label} (current)` : meta.label,
    value,
  }));
}

/** The `skosh create` flow: prompt for whatever flags did not provide. */
async function runCreate(args) {
  if (args.name) {
    const nameCheck = validateNewProjectName(args.name);
    if (nameCheck !== true) throw new Error(nameCheck);
  }

  const answers = await prompts(
    [
      {
        type: args.name ? null : 'text',
        name: 'name',
        message: 'What is your store called?',
        initial: 'my-store',
        validate: validateNewProjectName,
      },
      {
        type: args.template ? null : 'select',
        name: 'template',
        message: 'Which template?',
        choices: templateChoices(),
      },
      {
        type: args.packageManager ? null : 'select',
        name: 'packageManager',
        message: 'Which package manager?',
        choices: PACKAGE_MANAGERS.map((pm) => ({ title: pm, value: pm })),
      },
    ],
    { onCancel },
  );

  await scaffold({
    name: args.name ?? answers.name,
    template: args.template ?? answers.template,
    packageManager: args.packageManager ?? answers.packageManager,
    install: args.install,
    git: args.git,
  });
}

/** The `skosh template` flow: rewrite the current project's config. */
async function runTemplate(args) {
  const projectDir = process.cwd();
  const current = await readActiveTemplate(projectDir);
  if (current === null) {
    throw new Error(
      `No ${CONFIG_FILE} found here. Run this command from the root of a skosh project.`,
    );
  }

  let template = args.template ?? args.name;
  if (!template) {
    const answer = await prompts(
      {
        type: 'select',
        name: 'template',
        message: 'Switch to which template?',
        choices: templateChoices(current),
        initial: Math.max(0, Object.keys(TEMPLATES).indexOf(current)),
      },
      { onCancel },
    );
    template = answer.template;
  }
  if (!TEMPLATES[template]) {
    throw new Error(`Unknown template "${template}". Use: ${Object.keys(TEMPLATES).join(', ')}`);
  }

  await applyTemplate(projectDir, template);
  console.log(`\n${pc.green('Done.')} ${CONFIG_FILE} now uses the ${pc.bold(template)} template.`);
  console.log('Restart the dev server to see the change.\n');
}

/** Entry point: dispatch a subcommand, or show the interactive menu. */
async function run() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(pc.red(error.message));
    console.log(HELP);
    process.exit(1);
  }

  if (args.help) {
    console.log(HELP);
    return;
  }

  console.log(pc.bold('\nskosh'));

  let command = args.command;
  if (!command) {
    const inProject = (await readActiveTemplate(process.cwd())) !== null;
    const answer = await prompts(
      {
        type: 'select',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { title: 'Create a new app', value: 'create' },
          {
            title: inProject ? "Change this app's template" : "Change an app's template",
            value: 'template',
          },
          { title: 'Exit', value: 'exit' },
        ],
      },
      { onCancel },
    );
    if (answer.action === 'exit') return;
    command = answer.action;
  }

  if (command === 'create') await runCreate(args);
  else await runTemplate(args);
}

module.exports = { run };
