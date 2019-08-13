# How to Contribute

## Repository Organization

Edtr.io is organized as a monorepo. All Edtr.io packages are released together and follow the same versioning schema
(see also section "Semantic Versioning").

## Branch Organization

We will do our best to make sure that the [`master` branch][master] is in a
deployable state all the time (e.g. all tests pass). It might contain commits that have not been deployed yet and that
might contain breaking changes. We recommend that you use the [latest stable versions of Edtr.io packages][releases].

If you send a pull request, please do it against the [`master` branch][master] branch.

## Semantic Versioning

Edtr.io follows [Semantic Versioning](https://semver.org/). Before version 1.0.0, we release patch versions for bug fixes
and new features, and minor versions for breaking changes (e.g. 0.9.x contains breaking changes compared to 0.8.x). We
recommend that you declare Edtr.io packages with `^version` since that will yield the correct behaviour when using `yarn upgrade` resp. `npm upgrade`
and makes sure that the packages work together:

```json
{
  "dependencies": {
    "@edtr-io/core": "^0.8.0",
    "@edtr-io/ui": "^0.8.0"
  }
}
```

Every significant change (including breaking changes) is documented in the [changelog file](https://github.com/edtr-io/edtr-io/blob/master/CHANGELOG.md)
and [GitHub Releases][releases].

## Bugs

### Where to Find Known Issues

We are using [GitHub Issues][issues] for our public bugs. Before filing a new task, try to make sure your problem
does not already exist.

### Reporting New Issues

The best way to get your bug fixed is to provide steps to easily reproduce the issue (e.g. a public repository or a
description of how to reproduce the issue in our [official demo][demo])

## Development Workflow

### Requirements

- [Yarn](https://yarnpkg.com/en/) (version 1.x)
- [Node.js](https://nodejs.org/en/) (tested w/ active LTS, i.e. version 10.x)

### Packages

We are using [Lerna](https://lernajs.io/) (w/ [Yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)) to manage
our monorepo. Packages are located in [`packages/`](packages), i.e. the folder structure is

```
edtr-io
└─packages
| └─core              // npm package @edtr-io/core
| | └─__tests__       // automated tests
| | └─dist            // transpiled code
| | └─src             // source code (index.(ts|tsx) is entry)
| | | package.json
| | | tsconfig.json
| └─demo              // private package containing our Storybook
| | └─.storybook      // Storybook config
| | └─__stories__     // stories for the demo
| | └─src
| | | package.json
| | | tsconfig.json
| package.json
| ...
```

The tools should be configured in such a way, that you don't need to `build` any packages in development (if you run
into a problem, please file an issue).

### Dependencies

Dependencies should be declared in the `package.json` file of the corresponding package. Some things to look out for:

- Please make sure that all required dependencies are declared in `dependencies` (resp. `peerDependencies` for some rare
  cases).
- Version ranges of dependencies should usually be declared with a caret, and set all non-required parts of the version to 0.
  This makes sure that we do not interfere with users that depend on the same packages and `yarn upgrade` resp. `npm upgrade` works
  correctly for end users without us having to publish new releases. Some examples:

```js
{
  "foo": "^2.0.0", // usual case: depend on some major version
  "bar": "^16.8.0", // if you depend on a feature introduced in a later minor version, also specify that
  "foobar": "^0.19.0", // before 1.0.0: depend on some minor version instead
}
```

- `@edtr-io/core` and `@edtr-io/ui` should be declared in `peerDependencies` instead.
- Packages that should be declared in `peerDependencies` for any reason (e.g. `react`, `styled-components`) should also
  be declared in `devDependencies` so that they are available for tests.
- `@type/*` packages containing TypeScript declaration files should be declared where the corresponding dependency is
  declared, i.e. either in `dependencies` or `devDependencies` (but never in `peerDependencies`).

[demo]: https://demo.edtr.io
[master]: https://github.com/edtr-io/edtr-io/tree/master
[issues]: https://github.com/edtr-io/edtr-io/issues
[releases]: https://github.com/edtr-io/edtr-io/releases
