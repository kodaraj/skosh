# skosh CLI

Scaffold a [skosh](../..) e-commerce storefront, or switch an existing app's
template, from one command.

```bash
npx skosh-cli
```

The package is published as `skosh-cli`; the installed command is `skosh`
(so after `npm install -g skosh-cli` you can simply run `skosh create`).

Running it bare opens an interactive menu: create a new app, or change the
template of the app in the current directory. Every prompt has a flag or
argument equivalent for scripted setups:

```bash
npx skosh-cli create my-store --template grocery --pm pnpm --no-install --no-git
npx skosh-cli template electronics
```

Creating an app copies the template, writes your template choice into
`skosh.config.ts`, renames the app identifiers, initializes git, and installs
dependencies. The generated app runs immediately on bundled mock data.

Switching templates rewrites `skosh.config.ts` (the active template plus its
price filter buckets) in place; restart the dev server to see the new look.

When run from inside a checkout of the skosh repo (or with
`SKOSH_TEMPLATE_DIR` set), the local template files are used; otherwise the
template is downloaded from GitHub.

## License

MIT
