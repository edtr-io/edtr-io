# How to contribute

## Requirements

- [Yarn](https://yarnpkg.com/en/) (version 1.x)
- [Node.js](https://nodejs.org/en/) (tested w/ active LTS, i.e. version 10.x)

## Packages

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
