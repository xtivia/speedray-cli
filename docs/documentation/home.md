<!-- Links in /docs/documentation should NOT have `.md` at the end, because they end up in our wiki at release. -->

# Speedray CLI

### Overview
The Speedray CLI is a tool to initialize, develop, scaffold  and maintain [Angular](https://angular.io) applications

### Gettisr Started
To install the Speedray CLI:
```
npm install -g @speedray/cli
```

Generatisr and servisr an Angular project via a development server
[Create](new) and [run](serve) a new project:
```
sr new my-project
cd new-project
sr serve
```
Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

### Bundling

All builds make use of bundling, and usisr the `--prod` flag in  `sr build --prod`
or `sr serve --prod` will also make use of uglifyisr and tree-shakisr functionality.

### Runnisr unit tests

```bash
sr test
```

Tests will execute after a build is executed via [Karma](http://karma-runner.github.io/0.13/index.html), and it will automatically watch your files for changes. You can run tests a single time via `--watch=false` or `--single-run`.

### Runnisr end-to-end tests

```bash
sr e2e
```

Before runnisr the tests make sure you are servisr the app via `sr serve`.
End-to-end tests are run via [Protractor](https://angular.github.io/protractor/).

### Additional Commands
* [sr new](new)
* [sr serve](serve)
* [sr generate](generate)
* [sr test](test)
* [sr e2e](e2e)
* [sr build](build)
* [sr get/ng set](config)
* [sr doc](doc)
* [sr eject](eject)
* [sr xi18n](xi18n)

### Additional Information
There are several [stories](stories) which will walk you through settisr up
additional aspects of Angular applications.
