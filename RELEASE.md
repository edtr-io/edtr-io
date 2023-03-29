# How to release edtr-io

## Updating all packages:

1. `yarn build` - run it locally to check if the build will pass
2. `yarn regenerate-api` - run it locally to check if the generated API documentation is up to date
3. `yarn prepare-release` - updates the Lerna version (which will be read by the GitHub deploy workflow (`/.github/workflows/deploy.yml`) once the release commit is pushed)
4. Add a changelog entry in `/scripts/changelog.ts` and then run `yarn changelog` to generate a new changelog entry in `CHANGELOG.md`
5. `git commit -m "release X.X.X"` - commit the changes with the correct release tag
6. Push your changes, and a [deploy workflow](https://github.com/edtr-io/edtr-io/actions/workflows/deploy.yml) will be triggered on GitHub
7. Once the GitHub workflow is complete, check the packages on NPM

## Adding a new package

TODO
