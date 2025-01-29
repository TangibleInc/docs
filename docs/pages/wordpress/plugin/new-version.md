# New version


## Update files

What to update when releasing a new plugin version.

### `readme.txt`

In the header comment block:

```
Stable tag: 1.0.0
```

In the change log:

```
== Changelog ==

= 1.0.0 =

Release Date: 2025-01-01

- Example Feature: Description of change
- Another change 
```

## Plugin entry file

The entry file has the same name as the plugin slug, like `example-plugin.php`.

In the header comment block:

```
Version: 1.0.0
```

Usually there's a constant defined.

```php
define( 'TANGIBLE_EXAMPLE_PLUGIN', '1.0.0' );
```

## Zip archive

A `zip` archive of the plugin can be created with the Roller tool.

Projects can define the `archive` script in `package.json`.

```sh
npm run archive
```

Alternatively use `npx` to run directly.

```sh
npx roll archive
```

### Archive config

The `archive` command expects to get its configuration from the file `tangible.config.js`.

Define the `archive` property with the name of the zip package, what files to include and exclude.

```js
{
  archive: {
    root: 'tangible-example-plugin',
    dest: 'publish/tangible-example-plugin.zip',
    src: [
      '*.php',
      'assets/**',
      'includes/**',
      'vendor/tangible/**',
      'readme.txt'
    ],
    exclude: [
      '.git',
      '**/artifacts',
      '**/publish',
      '**/node_modules',
      'assets/src',
      'docs',
      '**/tests',
      '**/*.scss',
      '**/*.jsx',
      '**/*.ts',
      '**/*.tsx',
      'vendor/tangible/*/vendor',
      'vendor/tangible-dev/'
    ],
    configs: [
      // './vendor/tangible/example-module/tangible.config.js'
    ]
  }
}
```

## Git commands

Add tag

```sh
git tag 1.0.0
```

Push tag

```sh
git push origin 1.0.0
```
