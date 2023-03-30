# How to release edtr-io

## Updating all packages:

1. `git checkout main` - switch to `main` branch
2. `git pull` - update the `main` branch
3. `yarn build` - run it locally to check if the build will pass
4. `yarn regenerate-api` - run it locally to check if the generated API documentation is up to date
5. `yarn prepare-release` - updates the Lerna version (which will be read by the GitHub deploy workflow (`/.github/workflows/deploy.yml`) once the release commit is pushed)
6. Add a changelog entry in `/scripts/changelog.ts`
7. `yarn changelog` - to generate a new changelog entry in `CHANGELOG.md`
8. `git commit -m "release X.X.X"` - commit the changes with the correct release version

> This either increases the version number of all packages to the same number or only increase the version number of those packages that were changed. Still not entirely clear.

9. Push your changes, and a [deploy workflow](https://github.com/edtr-io/edtr-io/actions/workflows/deploy.yml) will be triggered on GitHub
10. Once the GitHub workflow is complete, check the packages on NPM
11. Inform the maintainers of package consumers ([frontend](https://github.com/serlo/frontend), [RLP editor integration](https://github.com/serlo/ece-as-a-service), ...?) about the release, providing the version and which packages changed, and any potential breaking changes

No package consumers will be affected by the release until they actually upgrade the version in their projects.

## Adding a new package

TODO
