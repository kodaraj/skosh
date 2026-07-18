'use strict';

const COMMANDS = ['create', 'template'];

const HELP = `
Usage:
  skosh                          Interactive menu
  skosh create <project-name>    Create a new storefront app
  skosh template <name>          Switch the current app's template
                                 (run inside a skosh project)

Options for create:
  -t, --template <name>         Template to use: fashion, grocery, electronics
      --pm <name>               Package manager: npm, yarn, pnpm, bun
      --package-manager <name>  Alias of --pm
      --no-install              Skip installing dependencies
      --no-git                  Skip initializing a git repository
  -h, --help                    Show this help

Every interactive prompt has a flag or argument equivalent, so
"skosh create my-store --template grocery --pm npm" runs fully
non-interactively.

Examples:
  npx skosh-cli
  npx skosh-cli create my-store
  npx skosh-cli create my-store --template grocery --pm pnpm --no-install
  npx skosh-cli template electronics
`;

/**
 * Parses process.argv into { command, name, ...flags }. Throws on unknown
 * flags and commands so typos fail loudly instead of being ignored.
 */
function parseArgs(argv) {
  const args = { install: true, git: true };
  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '-t':
      case '--template':
        args.template = argv[(i += 1)];
        break;
      case '--pm':
      case '--package-manager':
        args.packageManager = argv[(i += 1)];
        break;
      case '--no-install':
        args.install = false;
        break;
      case '--no-git':
        args.git = false;
        break;
      case '-h':
      case '--help':
        args.help = true;
        break;
      default:
        if (arg.startsWith('-')) {
          throw new Error(`Unknown option: ${arg}`);
        }
        positional.push(arg);
    }
  }

  if (positional.length > 0) {
    if (!COMMANDS.includes(positional[0])) {
      throw new Error(
        `Unknown command: ${positional[0]}. Did you mean "skosh create ${positional[0]}"?`,
      );
    }
    args.command = positional[0];
    args.name = positional[1];
  }
  return args;
}

/** Valid npm-style project directory name. */
function validateName(name) {
  if (!name) return 'Project name is required';
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(name)) {
    return 'Use lowercase letters, numbers, dots, hyphens, and underscores';
  }
  return true;
}

module.exports = { HELP, parseArgs, validateName };
