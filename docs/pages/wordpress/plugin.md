# Plugin

Here are common folders and files for a WordPress plugin.

## Documentation

### `readme.md`

Entry documentation for the project written in Markdown. This is displayed on the project page on GitHub.

### `readme.txt`

WordPress plugin declaration

### `docs`

Documentation site, such as a Docusaurus project.

## Code

### Plugin entry file

`plugin-name.php`

### `assets`

JavaScript, CSS, images, and other static assets.

- `src` - Source files for TypeScript, Sass
- `build` - Minified bundles of JS and CSS
- `vendor` - Third-party scripts

### `includes`

It's a common convention to organize PHP files in the `includes` folder.

### `publish`

Local-only folder excluded from Git, used to create and test the plugin zip archive.

### `tests`

Tests and test environment setup.

### `vendor`

External dependencies installed for development and production. These can be GitHub repositories, extracted zip files, or other sources.

Folder structure is `namespace/project`.

- `tangible` - Modules required to run to the plugin. Included in the plugin zip archive.
- `tangible-dev` - Modules and plugins for local development and testing. Excluded from plugin release.

## Configuration

### `package.json`

Package configuration for NPM (Node package manager). Defines a list of dependencies, and scripts you can run with `npm run`.

See [the Roller](/modules/roller) which bundles assets like JavaScript and CSS. For local development and testing, a tool called [Now](/modules/now) serves a self-contained site based on WordPress Playground.

### `tangible.config.js`

Configuration file used by `@tangible/roller` to build JS/CSS assets, create zip archive, install and update dependencies for local development.

The following are used to configure the local site running on `wp-now`.

- `.wp-env.json`
- `blueprint.dev.json`

### `.editorconfig`

Editor configuration based on [EditorConfig](https://editorconfig.org) supported by many editors and IDEs.

```ini
root = true

[*]

charset = utf-8

# Unix-style newlines with a newline ending every file
end_of_line = lf
insert_final_newline = true

# 2 space indentation
indent_style = space
indent_size = 2
```

Language-specific preferences can be declared here.

### `.github`

GitHub Actions pipeline to test, build, and deploy the project. See [the Pipeline module](/modules/pipeline).

### `.prettierrc`

Formatter configuration for [Prettier](https://prettier.io/).

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false
}
```
