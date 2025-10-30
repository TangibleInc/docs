# Rename default branch to `main`

The standard default branch name is `main` for all projects. Follow the steps below to update older projects using `master` or `trunk` branch.

It can be done in the GitHub repository, under Settings -> Default branch.

- https://github.com/TangibleInc/example-plugin/settings

After the switch, it also requires a change in any locally cloned repo. Make sure the old branch name is correct in the commands.

```sh
git checkout master
git branch -m master main
git fetch origin
git branch --unset-upstream
git branch -u origin/main
```
