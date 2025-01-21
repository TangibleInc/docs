# Create

Here's a quick way to start a new [WordPress](https://wordpress.org/) plugin, theme, or site.

```sh
npm create tangible@latest
```

This installs a tool called `create-tangible` ([Git repository](https://github.com/tangibleinc/create)) and runs it.

It asks some questions to create a new project.

```sh
? Select project type (Use arrow keys)
❯ WordPress plugin
  WordPress theme
  WordPress site
  Static HTML Page

? Project name
? Project title
? Project description
```

It creates the project folder, and copies the contents of a starter template based on project type. It runs `npm install` for NPM packages, then `roll install` for module dependencies like Framework, Updater, and others for local development and testing.

```sh
Create project "example"

Copy template type plugin
Install dependencies

$ roll install
Cloning into 'framework'...
Cloning into 'updater'...

Start by running:
cd example
npm run start
```

As indicated, change to the project directory and run the `start` script. This serves a self-contained local site running on WordPress Playground and PHP-WASM.
