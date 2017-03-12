## Speedray CLI

[![Build Status][travis-badge]][travis-badge-url]
[![Dependency Status][david-badge]][david-badge-url]
[![devDependency Status][david-dev-badge]][david-dev-badge-url]
[![npm][npm-badge]][npm-badge-url]

Prototype of a CLI for Angular applications deployed to Liferay DXP based on the [angular-cli](https://cli.angular.io/) project.

## Note

The CLI is now in beta.
If you wish to collaborate while the project is still young, check out [our issue list](https://github.com/ddavis2xtivia/speedray-cli/issues).

Before submitting new issues, have a look at [issues marked with the `type: faq` label](https://github.com/ddavis2xtivia/speedray-cli/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3A%22type%3A%20faq%22%20).

## Liferay DXP Support

The server command is replaced with the deploy command. All testing and debugging is performed in a Liferay DXP instance. The webpack compilation is used to create a liferay DXP osgi module. This module is deployed to liferay DXP and is started to make it available for use in the liferay environment.

## Prerequisites

Both the CLI and generated project have dependencies that require Node 6.9.0 or higher, together
with NPM 3 or higher and Liferay DXP FP 11 or higher.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Generating a New Project](#generating-and-serving-an-angular-project-via-a-development-server)
* [Generating Components, Directives, Pipes and Services](#generating-components-directives-pipes-and-services)
* [Updating Speedray CLI](#updating-angular-cli)
* [Development Hints for hacking on Speedray CLI](#development-hints-for-hacking-on-angular-cli)
* [Documentation](#documentation)
* [License](#license)

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)
```bash
npm install -g @speedray/cli
```

## Usage

```bash
sr help
```

### Generating and serving an Angular project via a development server

```bash
sr new PROJECT_NAME
cd PROJECT_NAME
sr deploy --watch
```
Navigate to `http://localhost:8080/`. The app will automatically reload if you change any of the source files.

You can configure the default HTTP host and port used by the development server with two command-line options :

```bash
sr deploy --host 127.0.0.1 --port 11311
```

### Generating Components, Directives, Pipes and Services

You can use the `sr generate` (or just `sr g`) command to generate Angular components:

```bash
sr generate component my-new-component
sr g component my-new-component # using the alias

# components support relative path generation
# if in the directory src/app/feature/ and you run
sr g component new-cmp
# your component will be generated in src/app/feature/new-cmp
# but if you were to run
sr g component ../newer-cmp
# your component will be generated in src/app/newer-cmp
```
You can find all possible blueprints in the table below:

Scaffold  | Usage
---       | ---
Component | `ng g component my-new-component`
Directive | `ng g directive my-new-directive`
Pipe      | `ng g pipe my-new-pipe`
Service   | `ng g service my-new-service`
Class     | `ng g class my-new-class`
Guard     | `ng g guard my-new-guard`
Interface | `ng g interface my-new-interface`
Enum      | `ng g enum my-new-enum`
Module    | `ng g module my-module`

### Updating Speedray CLI

To update Speedray CLI to a new version, you must update both the global package and your project's local package.

Global package:
```bash
npm uninstall -g @speedray/cli
npm cache clean
npm install -g @speedray/cli@latest
```

Local project package:
```bash
rm -rf node_modules dist # use rmdir /S/Q node_modules dist in Windows Command Prompt; use rm -r -fo node_modules,dist in Windows PowerShell
npm install --save-dev @speedray/cli@latest
npm install
```

You can find more details about changes between versions in [CHANGELOG.md](https://github.com/ddavis2xtivia/speedray-cli/blob/master/CHANGELOG.md).


## Development Hints for hacking on Speedray CLI

### Working with master

```bash
git clone https://github.com/ddavis2xtivia/speedray-cli.git
cd speedray-cli
npm link
```

`npm link` is very similar to `npm install -g` except that instead of downloading the package
from the repo, the just cloned `speedray-cli/` folder becomes the global package.
Any changes to the files in the `speedary-cli/` folder will immediately affect the global `@speedray/cli` package,
allowing you to quickly test any changes you make to the cli project.

Now you can use `@speedray/cli` via the command line:

```bash
sr new foo
cd foo
npm link @speedray/cli
sr serve
```

`npm link @speedray/cli` is needed because by default the globally installed `@speedray/cli` just loads
the local `@speedray/cli` from the project which was fetched remotely from npm.
`npm link @speedray/cli` symlinks the global `@speedray/cli` package to the local `@speedray/cli` package.
Now the `speedray-cli` you cloned before is in three places:
The folder you cloned it into, npm's folder where it stores global packages and the Speedray CLI project you just created.

You can also use `sr new foo --link-cli` to automatically link the `@speedray/cli` package.

Please read the official [npm-link documentation](https://www.npmjs.org/doc/cli/npm-link.html)
and the [npm-link cheatsheet](http://browsenpm.org/help#linkinganynpmpackagelocally) for more information.


## Documentation

The documentation for the Angular CLI is located in this repo's [wiki](https://github.com/angular/angular-cli/wiki).

## License

LGPL-3


[travis-badge]: https://travis-ci.org/ddavis2xtivia/speedray-cli.svg?branch=master
[travis-badge-url]: https://travis-ci.org/ddavis2xtivia/speedray-cli
[david-badge]: https://david-dm.org/ddavis2xtivia/speedray-cli.svg
[david-badge-url]: https://david-dm.org/ddavis2xtivia/speedray-cli
[david-dev-badge]: https://david-dm.org/dddavis2xtivia/speedray-cli/dev-status.svg
[david-dev-badge-url]: https://david-dm.org/ddavis2xtivia/speedray-cli?type=dev
[npm-badge]: https://img.shields.io/npm/v/@speedray/cli.svg
[npm-badge-url]: https://www.npmjs.com/package/@speedray/cli
