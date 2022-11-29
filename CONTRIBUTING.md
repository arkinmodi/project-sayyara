# Contribution Guidelines

Sayyara is an open source project built for our Undergraduate Software Engineering Program's Capstone.

When contributing, whether on GitHub or in other community spaces, remember to:

- Be respectful, civil, and open-minded
- Before opening a new pull request or issue, try searching through the issue tracker for known issues or fixes

Below you can find some guidance on how to work on our project.

## Table of Contents

1. [Getting Started](#getting-started)
   - [Setting up your environment](#setting-up-your-environment)
   - [Setting up the project](#setting-up-the-project)
2. [Building and Running](#building-and-running)
3. [Check the Code](#check-the-code)
4. [Making Changes](#making-changes)
5. [Testing](#testing)
6. [Writing Docs](#writing-docs)
7. [Code Reviews](#code-reviews)

## Getting Started

### Setting up your environment

Sayyara is built and run on Node.js JavaScript Runtime. Docker is also used for the external dependencies.

- Install the latest LTS version of [Node.js](https://nodejs.dev/)
  - We recommend using a Node.js version manager like [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm)
- Install a code editor
  - We recommend using [VS Code](https://code.visualstudio.com/)
    - When opening the project in VS Code for the first time, it will prompt you to install the [recommended VS Code extensions](https://code.visualstudio.com/docs/editor/extension-marketplace#_workspace-recommended-extensions) for the project.
- Install the [git](https://git-scm.com/) version control tool
- Install [Docker](https://www.docker.com/)
  - We recommend using [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Setting up the project

_Some commands will assume you have the GitHub CLI installed, if you haven't yet, consider [installing it](https://github.com/cli/cli#installation), but you can always use the Web UI if you prefer that instead._

> Note: If you are a maintainer, you can skip the forking steps and work on this repository directly

In order to contribute to this project, you will need to fork the repository:

```sh
gh repo fork arkinmodi/project-sayyara
```

Then, clone it to your local machine:

```sh
gh repo clone <your-github-name>/project-sayyara

# Or if you prefer git
git clone https://github.com/<your-github-username>/project-sayyara
```

Then `cd` into the newly cloned directory and install the project's dependencies

```sh
npm install
```

## Building and Running

An `.env` file will need to be created. A template `.env.example` is available to help you get setup. The default `DATABASE_URL` is configured to connect to the local [MySQL](https://www.mysql.com/) database started using this repository's `docker-compose.yml`. You will need to generate a `NEXTAUTH_SECRET`. This secret is used by [NextAuth.js](https://next-auth.js.org/) to encrypt the [JWT](https://jwt.io/introduction). The secret is a random unique string. One can be generated using:

```sh
openssl rand -base64 32
```

This project uses [Docker](https://www.docker.com/) to start up a local [MySQL](https://www.mysql.com/) database.

```sh
# Start
npm run docker:up

# Stop
npm run docker:down
```

This project uses [Prisma](https://www.prisma.io/) as an [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping) and for generating type definitions for database objects. To apply the [database schema](prisma/schema.prisma) onto the MySQL database run (the database will be targeted by the `DATABASE_URL` in your `.env`):

```sh
npm run db:push
```

To generate the Prisma TypeScript type definitions, run:

```sh
npm install
```

This project uses [TypeScript](https://www.typescriptlang.org/) and [Next.js](https://nextjs.org/).

To start a local development server on http://localhost:3000/:

```sh
npm run dev
```

To compile and start a production on http://localhost:3000/ (this enables the [PWA](https://web.dev/progressive-web-apps/) functionality):

```sh
# Compile
npm run build

# Start
npm run start
```

## Check the Code

To run all the linters on the entire code base:

```sh
npm run lint
```

To run the [TypeScript](https://www.typescriptlang.org/) type checking on the entire code base:

```sh
npm run lint:types
```

To run the [ESLint](https://eslint.org/) lint checking on the entire code base:

```sh
npm run lint:eslint
```

To run the [Prettier](https://prettier.io/) formatter on the entire code base:

```sh
npm run lint:prettier
```

## Making Changes

Once you have made you changes, verify that the project will work (see [Building and Running](#building-and-running) section) and the project meets style guidelines (see [Check the Code](#check-the-code) section).

Please also create tests as deem appropriate (see [Testing](#testing) section). While there is not enforce code coverage metric, we aim to be as high as reasonable possible.

Every change you make should be stored in a git commit. Changes should be committed to a new local branch, which then gets pushed to your fork of the repository on GitHub.

1. Ensure your main branch is up to date:

```sh
git switch main
git pull upstream main

# For maintainers
git pull origin main
```

2. Create a new branch, based off the main branch:

```sh
git checkout -b <new-branch-name> main

# For maintainers
git checkout -b <your-github-name>/<new-branch-name> main
```

3. Stage files to include in a commit:

```sh
git add <paths-to-changes-files>
```

4. Create the commit:

```sh
git commit
```

5. Push changes to your fork:

```sh
git push -u origin <new-branch-name>
```

6. Open a pull request to merge into `main`. Make sure to fill out the title and body appropriately.

```sh
gh pr create --web
```

## Testing

Testing is done using [Jest](https://jestjs.io/). The unit test suite and integration test suite are differentiated using [`jest-runner-groups`](https://github.com/eugene-manuilov/jest-runner-groups) which requires the decoration of `@group unit` and `@group integration`, respectively, inside a comment at the top of the test file.

The integration test suite also requires a running local [MySQL](https://www.mysql.com/) database. Reference the [Building and Running](#building-and-running) section for instructions on how to start the local database.

To run the full test suite:

```sh
npm run test
```

To run just the unit test suite:

```sh
npm run test:unit
```

To run just the integration test suite:

```sh
npm run test:integration
```

To get a combined code coverage report (unit tests and integration tests), run:

```sh
npm run test:coverage
```

## Writing Docs

The documentation is written in [LaTeX](https://www.latex-project.org/) and are located under the `docs` folder. Make changes to the `.tex` files. To build the LaTeX files into a pdf locally using Docker run:

```sh
# Build ALL docs
npm run build:docs

# Build a specific doc
npm run build:docs -- PS      # Problem Statement and Goals
npm run build:docs -- DevP    # Development Plan
npm run build:docs -- SRS     # Software Requirements Specification
npm run build:docs -- HazA    # Hazard Analysis
npm run build:docs -- VnVP    # Verification and Validation Plan
npm run build:docs -- MG      # Design/SoftArchitecture   Module Guide
npm run build:docs -- MIS     # Design/SoftDetailedDes  Module Interface Specification
npm run build:docs -- SystDes # Design/SystDesign  System Design
npm run build:docs -- VnVR    # Verification and Validation Report
npm run build:docs -- UGde    # User Guide
npm run build:docs -- Refl    # Reflection Report
```

Upon opening of a pull request, the [GitHub Action](https://github.com/features/actions) pipeline will build the PDF. It is not required for you to commit a built PDF as part of your PR as the main branch pipeline will create one for you.

## Code Reviews

All pull requests, include those from maintainers, require a review from another maintainer as defined in the [CODEOWNERS](/.github/CODEOWNERS)

## Credits

This document was heavily inspired by the contributing guidelines for [cloudflare/wrangler2](https://github.com/cloudflare/wrangler2/blob/main/CONTRIBUTING.md) and [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app/blob/next/CONTRIBUTING.md).
