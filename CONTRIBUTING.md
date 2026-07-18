# Contributing to skosh

Thanks for your interest in improving skosh. This guide covers setup,
project conventions, and how to get a change merged.

## Setup

```bash
git clone https://github.com/kodaraj/skosh.git
cd skosh
npm install
npx expo start
```

The app runs against bundled mock data, so no backend or environment
configuration is needed for development.

To work on the CLI:

```bash
cd packages/skosh
npm install
node index.js create demo-store --template fashion --no-install
```

When run from inside the repo, the CLI uses your local template files.

## Project conventions

- **The DataProvider boundary is sacred.** Screens and components never import
  Supabase, fetch, or any backend client directly. All data access goes through
  the `DataProvider` interface in `lib/data/types.ts`.
- **No hardcoded design values.** Components read colors, spacing, typography,
  and radii exclusively from `useTheme()`. If a new template would require
  editing screen code, extend the token contract in `theme/tokens.ts` instead.
- **Prices are integers in minor units** and are formatted only through
  `formatPrice` in `lib/format-price.ts`.
- TypeScript strict mode, no exceptions.
- Components stay under roughly 150 lines; extract when they grow past that.
- Every exported function or component in `lib/` gets a brief JSDoc.
- Files and folders are kebab-case; components are PascalCase.
- No dead code, no commented-out blocks, and no TODOs outside
  `lib/data/providers/rest.ts`, where they are intentional signposts.

## Before opening a pull request

Run the checks the CI expects:

```bash
npm run typecheck
npm run lint
npm run format:check
```

Then verify your change in the app itself, ideally in both light and dark mode.
If your change touches shared components, check it against all three templates
by switching `ACTIVE_TEMPLATE` in `skosh.config.ts`.

## Pull requests

- Keep PRs focused; one change per PR is easier to review and revert.
- Describe what changed and why, with screenshots for anything visual.
- New features should come with designed loading, empty, and error states;
  that quality bar is the point of this project.

## Reporting issues

Use the issue templates. For bugs, include your platform (iOS, Android, web),
the template in use, and steps to reproduce.
