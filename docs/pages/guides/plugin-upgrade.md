# Plugin upgrade to new setup

**Prerequisites**: [Git](https://git-scm.com/), [Node](https://nodejs.org/), [Docker](https://docs.docker.com/engine/), [Bash](https://en.wikipedia.org/wiki/Bash_(Unix_shell))-compatible shell - See [Setup](/setup)

Here are the steps to upgrade an existing plugin with the common setup used by all new plugins.

- Create GitHub repository
- Basic setup: Copy common files from example plugin
  - Local development site
  - Unit tests with PHPUnit
  - End-to-end tests with Playwright
- Upgrade Framework
- Upgrade Build Pipeline
- Upgrade Assets Bundler
- Code formatter using Roller (CSS, Sass, JavaScript, TypeScript) and [PHP Beautify](https://github.com/TangibleInc/php-beautify)

## Git repository

Create an empty repository from here: https://github.com/new

It can be public or private; however, at the moment the automated release pipeline for private repos is still in development.

Go into the local repository of the existing plugin. If you don't have it, clone it from its original location.

```sh
git clone git@bitbucket.org:tangibleinc/example-plugin # if needed
cd example-plugin
```

List existing remote targets.

```sh
git remote -v
```

Replace remote `origin` with a new one pointing to GitHub. Optionally add remote `bitbucket` if you want to keep deploying to the old location until the upgrade is complete.

```sh
git remote remove origin
git remote add origin git@github.com:tangibleinc/example-plugin.git
git remote add bitbucket git@bitbucket.org:tangibleinc/example-plugin
```

Rename main branch from "master" to "main".

```sh
git branch -M main
```

Push to remote `origin`, setting it as the upstream of main branch.

```sh
git push -u origin main
```

Create and switch to a new branch for doing the upgrade work.

```sh
git checkout -b feature/upgrade-setup
```

This can be turned into a pull request for an optional review session before merging to the main branch.

## Common setup

To get an idea of the complete setup, see:

- [Example Plugin](https://github.com/TangibleInc/example-plugin)
- [Folder structure and files](/wordpress/plugin/file-structure)
- [Commands used during plugin development](/wordpress/plugin/develop)

It's recommended, but not required, to use the [Create](/modules/create/) tool to generate a new plugin that includes the complete setup.

```sh
npm create tangible@latest
```

This can be used as a reference for how everything works together. The tool prompts for the plugin name, title, description; then creates common setup files with those values.

If you want to use it as the new project folder, rename the old plugin to something else before creating the new plugin with the original name. For example:

```sh
mv example-plugin example-plugin-old
```

Then you can copy over the main files from the old plugin, including the `.git` folder, to the new plugin.

Alternatively, to manually update an existing plugin, copy and merge the following folders and files into the project.

- `.editorconfig`
- `.github` - See [Build Pipeline](#build-pipeline)
- `.gitignore`
- `.prettierrc`
- `.wp-env.json`
- `blueprint.dev.json`
- `composer.json`
- `package.json`
- `phpunit.xml`
- `playwright.config.js`
- `playwright.setup.js`
- `readme.md`
- `tangible.config.js` - See [Assets Bundler](#assets-bundler)
- `tests`

If copying from the example plugin, update the file contents as needed. Examples of placeholder values: `example-plugin` (name), `Example Plugin` (title), `EXAMPLE_PLUGIN` (constant). 

## Vendor dependencies

In the new setup, Composer is only used for dev dependencies needed for testing.

```json
{
  "require-dev": {
    "phpunit/phpunit": "9.6.x-dev",
    "yoast/phpunit-polyfills": "2.x-dev"
  },
  "minimum-stability": "dev"
}
```

Define other vendor dependencies in `tangible.config.js` to be installed and updated by Roller. Example:

```js
{
  install: [
    {
      git: 'git@github.com:tangibleinc/framework',
      dest: 'vendor/tangible/framework',
      branch: 'main',
    },
    {
      git: 'git@github.com:tangibleinc/updater',
      branch: 'main',
      dest: 'vendor/tangible/updater'
    },
  ]
}
```

These are managed by Roller.

To install dependencies, run `npm install` which runs the `postinstall` script that calls `roll install`. Or run directly as `npx roll install`, after NPM packages are installed.

To update dependencies, run `npm run update` which calls `roll update`. Or run directly as `npx roll update`.

### Third-party plugins

For dev dependencies, add the option `--dev`. These typically include optionally supported plugins. Here's an example from [Blocks Pro](/plugins/blocks-pro).

```js
{
  installDev: [
    // Third-party plugins
    {
      zip: 'https://downloads.wordpress.org/plugin/advanced-custom-fields.latest-stable.zip',
      dest: 'vendor/tangible-dev/advanced-custom-fields',
    },
    {
      zip: 'https://downloads.wordpress.org/plugin/beaver-builder-lite-version.latest-stable.zip',
      dest: 'vendor/tangible-dev/beaver-builder-lite-version',
    },
    {
      zip: 'https://downloads.wordpress.org/plugin/elementor.latest-stable.zip',
      dest: 'vendor/tangible-dev/elementor',
    },
    {
      zip: 'https://downloads.wordpress.org/plugin/easy-digital-downloads.latest-stable.zip',
      dest: 'vendor/tangible-dev/easy-digital-downloads',
    },
    {
      zip: 'https://downloads.wordpress.org/plugin/the-events-calendar.latest-stable.zip',
      dest: 'vendor/tangible-dev/the-events-calendar',
    },
    {
      zip: 'https://downloads.wordpress.org/plugin/lifterlms.latest-stable.zip',
      dest: 'vendor/tangible-dev/lifterlms',
    },
    {
      zip: 'https://downloads.wordpress.org/plugin/woocommerce.latest-stable.zip',
      dest: 'vendor/tangible-dev/woocommerce',
    },

    // LearnDash
    {
      zip: 'https://static.tangible.one/vendor/sfwd-lms.zip',
      dest: 'vendor/tangible-dev/sfwd-lms'
    },
    {
      zip: 'https://static.tangible.one/vendor/learndash-course-grid.zip',
      dest: 'vendor/tangible-dev/learndash-course-grid'
    },
    {
      zip: 'https://static.tangible.one/vendor/learndash-hub.zip',
      dest: 'vendor/tangible-dev/learndash-hub'
    },
  ],
}
```

Run `npm run install:dev` or `npm run update:dev` to update them. Or directly with `npx roll install --dev` and `npx roll update --dev`.

Note how they're installed in `vendor/tangible-dev`, which is excluded from the zip release package.

Dev dependencies are typically mounted into the Docker container in `.wp-env.json`. For example:

```json
{
  "core": "WordPress/WordPress",
  "phpVersion": "8.2",
  "plugins": ["."],
  "mappings": {
    "wp-content/tangible": "./vendor/tangible",
    "wp-content/plugins/beaver-builder-lite-version": "./vendor/tangible-dev/beaver-builder-lite-version",
    "wp-content/plugins/tangible-e2e-plugin": "./vendor/tangible/framework/env/e2e-plugin",
    "wp-content/themes/empty-block-theme": "./vendor/tangible/framework/empty-block-theme"
  }
}
```

## Dev site

Install NPM dependencies.

```sh
npm install
```

Install dev dependencies like third-party plugins.

```sh
npm run install:dev
```

### wp-now

Start a quick dev site using [`wp-now`](https://github.com/WordPress/playground-tools/blob/trunk/packages/wp-now/README.md).

```sh
npm run now
```

The default user is `admin` with `password`. Press CTRL + C to stop.

This environment is meant as a temporary playground. It uses PHP-WASM which is more convenient and faster to start than Docker, but it's a bit experimental and may not be fully compatible with a normal PHP install.

### wp-env

Start a proper dev site using [`wp-env`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env).

```sh
npm run start
```

This starts the Docker containers for a dev site, test site, and WP-CLI. The test site's database is erased every time the unit tests are run.

Visit the dev site at: http://localhost:8888

The default PHP version is 8.2. If you need to downgrade to 7.4, for example to support a third-party plugin, update the property `phpVersion` in `.wp-env.json`; then run `npm run start:update`.

To stop the server.

```sh
npm run stop
```

To run arbitrary commands for the dev site, use `npx wp-env`.

```sh
npx wp-env run cli cat wp-content/debug.log # See debug log
npx wp-env run cli bash # Start shell session
npx wp-env run cli wp # WP-CLI commands
```

## Unit tests

After the dev site is started, install Composer. This needs to be done only once.

```sh
npm run composer:install
```

Run tests.

```sh
npm run test
```

## End-to-end tests

Install the Chromium browser engine for Playwright. This needs to be done only once.

```sh
npm run e2e:install
```

Run E2E tests.

```sh
npm run e2e
```

## Framework

Read the documentation for the [Framework](/modules/framework) and its [Plugin module](/modules/framework/plugin). For more context about the upgrade, see [this GitHub issue](https://github.com/TangibleInc/framework/issues/11).

Here are the main points of upgrading from Framework [v2](https://bitbucket.org/tangibleinc/tangible-plugin-framework) to [v3](https://github.com/TangibleInc/framework/).

Replace all occurences of `tgbl`, `tangible_plugin_framework`, and `$framework`.

Search for a keyword in the codebase.

```sh
grep -R framework
```

Example of old framework usage.

```php
$framework = tangible_plugin_framework();

$framework->example_method();
```

Example of new framework usage.

```php
use tangible\framework;

framework\example_method();
```

Update the way the plugin and its settings page, features, and dependencies are defined, according to the [Plugin module](/modules/framework/plugin).

## Build pipeline

Read the documentation for the [Build Pipeline](/modules/pipeline) using [GitHub Actions](https://docs.github.com/en/actions).

Copy the folder `.github` from the [Example Plugin](https://github.com/TangibleInc/example-plugin). The workflow files are the same for all plugins, so they don't need to be updated.

For reference, here's the old pipeline [v1](https://bitbucket.org/tangibleinc/tangible-pipeline) and [v2](https://bitbucket.org/tangibleinc/tangible-pipeline-v2/) using Bitbucket.

## Assets bundler

Read the documentation for [Roller](/modules/roller).

The section [Comparison with Tangible Builder](/modules/roller/#comparison-with-tangible-builder) explains a few small differences in the schema for the configuration file `tangible.config.js`. Update as needed.

## Formatter

Read the documentation for Roller's [Format command](/modules/roller/#format).

In the build configuration file `tangible.config.js`, the `format` property defines file patterns to be formatted. Update to match the existing folder structure.
