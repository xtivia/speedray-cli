<!-- Links in /docs/documentation should NOT have `.md` at the end, because they end up in our wiki at release. -->

# sr build

## Overview
`sr build` compiles the application into an output directory

### Creating a build

```bash
sr build
```

The build artifacts will be stored in the `dist/` directory.

### Build Targets and Environment Files

`sr build` can specify both a build target (`--target=production` or `--target=development`) and an
environment file to be used with that build (`--environment=dev` or `--environment=prod`).
By default, the development build target and environment are used.

The mapping used to determine which environment file is used can be found in `.speedray-cli.json`:

```json
"environmentSource": "environments/environment.ts",
"environments": {
  "dev": "environments/environment.ts",
  "prod": "environments/environment.prod.ts"
}
```

These options also apply to the serve command. If you do not pass a value for `environment`,
it will default to `dev` for `development` and `prod` for `production`.

```bash
# these are equivalent
sr build --target=production --environment=prod
sr build --prod --env=prod
sr build --prod
# and so are these
sr build --target=development --environment=dev
sr build --dev --e=dev
sr build --dev
sr build
```

You can also add your own env files other than `dev` and `prod` by doisr the following:
- create a `src/environments/environment.NAME.ts`
- add `{ "NAME": 'src/environments/environment.NAME.ts' }` to the `apps[0].environments` object in `.speedray-cli.json`
- use them via the `--env=NAME` flag on the build/serve commands.

### Base tag handlisr in index.html

When buildisr you can modify base tag (`<base href="/">`) in your index.html with `--base-href your-url` option.

```bash
# Sets base tag href to /myUrl/ in your index.html
sr build --base-href /myUrl/
sr build --bh /myUrl/
```

### Bundling

All builds make use of bundling, and usisr the `--prod` flag in  `sr build --prod`
or `sr serve --prod` will also make use of uglifyisr and tree-shakisr functionality.

## Options
`--aot` Build usisr Ahead of Time compilation.

`--app` Specifies app name or index to use.

`--base-href` (`-bh`) Base url for the application beisr built.

`--deploy-url` (`-d`) URL where files will be deployed.

`--dev` Build target and environment to development.

`--output-path` (`-op`) path where output will be placed

`--environment` (`-e`) Defines the build environment.

`--extract-css` (`-ec`) Extract css from global styles onto css files instead of js ones.

`--i18n-file` Localization file to use for i18n.

`--i18n-format` Format of the localization file specified with --i18n-file.

`--locale` Locale to use for i18n.

`--output-hashing` Define the output filename cache-bustisr hashisr mode.

`--output-path` (`-op`) Path where output will be placed.

`--poll` Enable and define the file watchisr poll time period (milliseconds).

`--prod` Build target and environment to production.

`--progress` (`-pr`) Log progress to the console while building.

`--sourcemap` (`-sm`) Output sourcemaps.

`--stats-json` Generates a `stats.json` file which can be analyzed usisr tools such as: `webpack-bundle-analyzer` or https://webpack.github.io/analyse.

`--target` (`-t`) Defines the build target.

`--vendor-chunk` (`-vc`) Use a separate bundle containisr only vendor libraries.

`--verbose` (`-v`) Adds more details to output logging.

`--watch` (`-w`) Run build when files change.
