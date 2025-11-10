# Deploy to Cloudflare Pages

Here are the steps to deploy a GitHub repository to Cloudflare Pages.

For reference, see [Cloudflare Pages GitHub Action](https://github.com/marketplace/actions/deploy-to-cloudflare-pages).

Replace the placeholder `example` with your project name. (Kebab case: lowercase alphanumeric with dash `-`, no spaces.)

## Repository secrets

From GitHub repo's Settings -> Secrets -> Actions, add new "repository secrets".

- `CLOUDFLARE_ACCOUNT_ID`
  - From dash.cloudflare.com, select the domain. In the Overview's right sidebar, scroll down to find **Account ID**.
- `CLOUDFLARE_API_TOKEN`
  - From dashboard, select your user's avatar (top right) and go to Profile -> API Tokens -> Create Token. Then to Custom Token -> Get Started.
  - Name: `tangible-cloudflare-pages-deploy`
  - Under Permissions, select Account, Cloudflare Pages, and Edit.
  - Click Continue to Summary, and **Create Token**.

## Pages project

From Cloudflare dashboard, create a Pages project.

- Go to Workers & Pages, click Create Application. Then Pages -> Drag and drop your files.
- Name: `storybook-example`. Then Created Project - no need to Deploy Site, it will be done in the next step.

## Workflow script

Prepare GitHub Actions workflow script.

- Create `.github/workflows/deploy-cloudflare-pages.yml`
- Copy from [tangible-ui](https://github.com/TangibleInc/tangible-ui/blob/main/.github/workflows/deploy-cloudflare-pages.yml) or pipeline, and replace project-specific values:
  - projectName: `storybook-example` - Same as Cloudflare Pages project created above
