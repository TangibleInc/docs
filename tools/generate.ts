import path from 'node:path'
import fs from 'node:fs/promises'
import { globby } from 'globby'
;(async () => {
  console.log('Generate docs pages from Git repos in vendor folder')

  const deps: {
    name: string
    files: {
      src: string // Glob pattern
      srcRoot?: string // Directory relative to repo root, whose name is excluded from the copied files
      dest: string // Target directory relative to docs/pages
    }[]
  }[] = [
    // Plugins
    // {
    //   name: 'blocks',
    //   files: [
    //     {
    //       src: '**/*.md',
    //       srcRoot: 'docs/pages',
    //       dest: 'plugins/blocks',
    //     },
    //   ],
    // },
    ...['blocks', 'blocks-pro', 'loops-and-logic', 'loops-and-logic-pro'].map(
      (name) => ({
        name,
        files: [
          {
            src: 'readme.md',
            dest: `plugins/${name}`,
          },
        ],
      })
    ),
    // Projects
    ...['design', 'create', 'now', 'pipeline', 'roller', 'update-server'].map(
      (name) => ({
        name,
        files: [
          {
            src: 'readme.md',
            dest: `projects/${name}`,
          },
        ],
      })
    ),
    // Modules - Shared features for plugins
    ...[
      'fields',
      // 'fields-pro',
      'framework',
      'template-system',
      // 'template-system-pro',
      'updater',
    ].map((name) => ({
      name,
      files: [
        {
          src: 'readme.md',
          dest: `modules/${name}`,
        },
        // Child modules
        ...(['framework', 'template-system'].includes(name)
          ? [
              {
                src: '*/readme.md',
                dest: `modules/${name}`,
              },
              ...(name === 'template-system'
                ? [
                  {
                    src: 'modules/*/readme.md',
                    dest: `modules/${name}`,
                  },
                  {
                    src: 'integrations/*/readme.md',
                    dest: `modules/${name}`,
                  },
              ]
                : []),
            ]
          : []),
      ],
    })),
  ]

  function createTitle(name: string) {
    return name
      .replaceAll('-', ' ')
      .split(' ')
      .map((p) => p[0].toUpperCase() + p.slice(1))
      .join(' ')
  }

  const cwd = process.cwd()
  const reposPath = path.join(cwd, 'vendor', 'tangible')
  const docsPagesPath = path.join(cwd, 'docs', 'pages')

  for (const { name, files } of deps) {
    for (const { src, dest, srcRoot = '' } of files) {
      const repoPath = path.join(reposPath, name)
      const pattern = path.join(srcRoot, src)

      console.log(`${name}/${pattern}`, '->', dest)

      for (const file of await globby(pattern, {
        cwd: repoPath,
        ignoreFiles: path.join(repoPath, '.gitignore'),
      })) {
        const srcFile = path.join(repoPath, file)
        const targetFile = path.join(
          dest,
          path.relative(srcRoot, file.replace('readme.md', 'index.md'))
        )

        console.log(' ', file, '->', targetFile)

        const targetDir = path.dirname(targetFile)

        await fs.mkdir(path.join(docsPagesPath, targetDir), {
          recursive: true, // This also makes it ignore if dir exists
        })

        // Add header comment

        const targetFilePath = path.join(docsPagesPath, targetFile)
        const content = await fs.readFile(srcFile, 'utf8')

        /**
         * Provide default title, otherwise Docusaurus will make it "index"
         */
        const title = createTitle(targetDir.split('/').pop() || '')

        await fs.writeFile(
          targetFilePath,
          `---
title: ${title
            // Fix wrong title
            .replace('Loops And Logic', 'Loops & Logic')}
---
<!--
Do not edit this file - Generated from https://github.com/tangibleinc/${name}
-->
${content}`
        )
      }
    }
  }
})()
