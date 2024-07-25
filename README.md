![Praxis](https://git.minhenry.com/avatars/u/5724?s=200)

<!--
👋 “Hey” from the Praxis team
Please replace this comment with a description of what your app does.
And don’t be a stranger, let us know what you’re building in the [#praxis-community slack channel](https://target-tts.slack.com/messages/C839M8339).
-->

# ccshipadmin

## Table of Contents

- [Getting Started](#getting-started)
  - [Development Environment Setup](#development-environment-setup)
  - [Installation](#installation)
- [Available Commands](#available-commands)
  - [`npm start`](#npm-start)
  - [`npm test`](#npm-test)
  - [`npm run build`](#npm-run-build)
  - [`npm run format`](#npm-run-format)
  - [`npm run release`](#npm-run-release)
  - [`npm run lint`](#npm-run-lint)
  - [`npm run inspect`](#npm-run-inspect)
  - [`npm run eject`](#npm-run-eject)
- [Architecture](#architecture)
  - [Dependency Management](#dependency-management)
  - [File Structure](#file-structure)
  - [Environment Variables](#environment-variables)
- [Browser Support](#browser-support)
- [Credits](#credits)

## Getting Started

### Development Environment Setup

Follow the [Praxis Setup Guide](https://praxis.minhenry.com/dev-setup/) before installing this app.<br/>
Use the version of Node specified in the `.nvmrc` file.

### Installation

1.  Clone this repository.
1.  Use the Node version specified in `.nvmrc`:

    ```bash
    nvm install
    ```
1.  Install dependencies before your first run:

    ```bash
    npm install
    ```

## Available Commands

From a command line in the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br/>

### `npm run build`

Builds the app and outputs to the `build` folder.<br/>
Correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include unique hashes.<br/>
Your app is ready to be deployed! This command is often run as part of your [CI-CD pipeline](https://praxis.minhenry.com/guides/ci-cd).

### `npm run format`

Formats all globbed files using [prettier](https://prettier.io/) for consistency throughout the codebase.<br/>
The `.prettierrc.js` file can be altered to your team’s preferences.

### `npm run release`

Programmatically increases the app version and creates a git tag using [standard version](https://github.com/conventional-changelog/standard-version).

### `npm run lint`

Lints all globbed files according to the rules specified in the `.eslintrc.js` file, emitting errors and warnings to the console.<br/>
Prettier and eslint are preconfigured not to conflict with one another.

### `npm run inspect`

View `praxis-scripts` bundled dependencies and remove your app’s duplicates.<br/>
Available subcommands include `list`, `duplicates`, and `remove-duplicates`.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

See the [eject documentation](https://praxis.minhenry.com/guides/ejection) for more information.

## Architecture

This app is built atop [Praxis](https://praxis.minhenry.com/). Praxis is a JavaScript starter app for building user interfaces.

### Dependency Management

This app includes `praxis-scripts` as a primary dependency. It packages up common dependencies and configuration, so teams don’t need to install or configure tools like Webpack or Babel. They are preconfigured and hidden so that you can focus on the code. Dependencies are bundled within and commands deferred to `praxis-scripts`. This allows the Praxis team to upgrade dependencies, fix bugs, and add new functionality for teams that remain unejected.

To see what `praxis-scripts` contains - see [the dependency management guide](https://praxis.minhenry.com/guides/dependency-management#bundled-dependencies).<br/>
Teams can include additional dependencies alongside `praxis-scripts` if needed.

Because `praxis-scripts` contains a lot of useful modules and packaged commands, keeping it [up to date](https://praxis.minhenry.com/guides/dependency-management#updating-dependencies) is useful.

### File Structure

The default file structure looks like this:

```
app
├── build/            # optimized, production-ready code after `npm run build`
├── nginx/            # production webserver config to host build output
├── public/           # the template files used during `npm run build`
├── src/              # the app source code goes here
├── .drone.yml        # (deprecated) continuous integration and deployment config
├── .editorconfig     # consistent editor settings
├── .env.development  # sets REACT_APP_ENV during `npm run start`
├── .env.production   # sets REACT_APP_ENV during `npm run build`
├── .env.test         # sets REACT_APP_ENV during `npm run test`
├── .eslintignore     # what files to ignore during lint
├── .eslintrc.js      # lint config
├── .gitignore        # what files to ignore within version control
├── .huskyrc.js       # git hook config
├── .lintstagedrc.js  # commands to run on every commit
├── .npmrc            # npm config
├── .nvmrc            # specify version of Node to target
├── .prettierignore   # ignore globs for pretter
├── .prettierrc.js    # config for prettier
├── .vela.yml         # continuous integration and deployment config
├── Dockerfile        # default Docker config when building an image to host
├── jest.config.js    # testing config
├── package-lock.json # ensures everyone on the team has the same resolved dependencies
├── package.json      # app config
└── README.md         # this file
```

For the project to build, **these files must exist with exact filenames**:

- `public/index.html` is the page template;
- `src/index.js` is the JavaScript entry point.

For tests to run properly, `src/setupTests.js` must be present.

You may create subdirectories inside `src`. For faster rebuilds, only files inside `src` are processed by Webpack.<br/>
You need to **put any JS and CSS files inside `src`**, otherwise Webpack won’t see them.

Only files inside `public` can be used from `public/index.html`.<br/>

You can, however, create more top-level directories.<br/>
They will not be included in the production build so you can use them for things like documentation.

### Environment Variables

Praxis includes three `.env` files at the root of the app that set the `REACT_APP_ENV` variable. They can correspond to a `dev`, `stg`, and `prod` environment defined within your `apiConfig.js`, for example. Add more variables as needed, so long as they are prefixed with `REACT_APP`.

The `.env` files are loaded automatically from the following commands:

> Files on the left have more priority than files on the right

- `npm start`: `.env.development.local`, `.env.development`, `.env.local`, `.env`
- `npm run build`: `.env.production.local`, `.env.production`, `.env.local`, `.env`
- `npm test`: `.env.test.local`, `.env.test`, `.env` (note `.env.local` is missing)

These values can be overridden at runtime too:

```sh
# run the production configuration locally
npx cross-env REACT_APP_ENV='prod' npm run start
```

or during CI

```yaml
webpack_build_nonprod:
  when:
    event: [push, pull_request]
  image: node:12.14.1
  environment:
    - REACT_APP_ENV=dev
  commands:
    - npm install
    - npm run build
```

> See create-react-app’s [environment variable guidance](https://create-react-app.dev/docs/adding-custom-environment-variables/) for more information.

## Browser Support

This app [implements browser support using browserslist](https://create-react-app.dev/docs/supported-browsers-features/#configuring-supported-browsers) for Javascript compilation and [optional polyfills](https://create-react-app.dev/docs/supported-browsers-features/#supported-language-features) for runtime support of third-party dependencies. Consider uncommenting the polyfill imports within `index.js` if you need IE11 support.

## Credits

Praxis is bootstrapped with [Create React App](https://create-react-app.dev/). Their documentation, featureset, and guidance is inherited within Praxis, [excepting a few differences](https://praxis.prod.minhenry.com/overview/what-is-praxis#how-does-praxis-differ-from-create-react-app).

