/**
 * Install or update dependencies from Git repositories in vendor folder
 */
import path from 'path'
import fs from 'fs/promises'
import { execSync } from 'child_process'
;(async () => {
  await installCommand({
    install: [
      ...[
        'blocks',
        'blocks-pro',
        'design',
        'create',
        'fields',
        'fields-pro',
        'framework',
        'now',
        'loops-and-logic',
        'loops-and-logic-pro',
        'pipeline',
        'roller',
        'template-system',
        'template-system-pro',
        'update-server',
        'updater',
      ].map((name) => ({
        git: `git@github.com:tangibleinc/${name}`,
        dest: `vendor/tangible/${name}`,
      })),
    ],
  })
})()

async function installCommand({
  cwd = process.cwd(),
  install,
  shouldUpdate = true,
}: {
  cwd?: string
  install: {
    git: string
    branch?: string
    dest: string
  }[]
  shouldUpdate?: boolean
}) {
  const dirsCreated = {}

  for (const { git, branch = 'main', dest } of install) {
    if (!dest) {
      console.error('Property "dest" required', git)
      continue
    }

    const parts = dest.split('/')
    const folderName = parts.pop()
    const parentPath = path.join(cwd, ...parts)

    // Ensure parent folder exists
    if (!dirsCreated[parentPath] && !(await fileExists(parentPath))) {
      console.log('Create parent folder', parts.join('/'))
      await fs.mkdir(parentPath, { recursive: true })
      dirsCreated[parentPath] = true
    }

    // Git repository

    const slug = git
      .split('/')
      .pop()
      .replace(/\.git$/, '')

    const targetPath = path.join(parentPath, folderName)
    const relativeFolderPath = path.relative(cwd, targetPath)

    // Fallback to HTTPS instead of SSH protocol
    const fallbackGit = git.replace('git@github.com:', 'https://github.com/')

    async function runWithFallback(
      command,
      givenOptions: {
        cwd?: string
      } = {}
    ) {
      const options = {
        cwd: givenOptions.cwd || parentPath,
      }
      // console.log('Running command in path', options.cwd)
      try {
        console.log(command)
        await run(command, options)
      } catch (e) {
        if (git === fallbackGit) {
          console.log('Git clone failed')
          console.error(e)
        } else {
          console.log(
            "Git did't work with SSH protocol. Trying fallback with HTTPS."
          )
          const fallbackCommand = command.replace(git, fallbackGit)
          console.log(fallbackCommand)
          try {
            await run(fallbackCommand, options)
          } catch (e) {
            console.error(e)
          }
        }
      }
    }

    if (await fileExists(targetPath)) {
      if (!shouldUpdate) {
        console.log('Folder exists', relativeFolderPath)
        continue
      }
      console.log('Update existing folder', relativeFolderPath)

      await runWithFallback(`git pull --ff-only ${git} ${branch}`, {
        cwd: targetPath,
      })
    } else {
      await runWithFallback(
        `git clone --recursive --depth 1 --single-branch --branch ${branch} ${git} ${folderName || slug}`,
        {
          cwd: parentPath,
        }
      )
    }
  }
}

function run(
  cmd = process.cwd(),
  options: {
    cwd?: string
    silent?: boolean
    capture?: boolean
  } = {}
) {
  return new Promise((resolve, reject) => {
    const { silent = false, capture = false, cwd } = options
    // if (!silent && !capture) console.log(cmd)
    try {
      const result = capture
        ? execSync(cmd, { stdio: 'pipe', cwd }).toString()
        : execSync(cmd, { stdio: 'inherit', cwd })

      if (capture) return resolve(result)
      if (result && !silent) console.log(result)
      resolve(true)
    } catch (e) {
      reject(e)
    }
  })
}

async function fileExists(file) {
  try {
    await fs.access(file)
    return true
  } catch (e) {
    return false
  }
}
