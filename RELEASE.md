# How to release edtr-io

## Updating all packages:

1. `git checkout main` - switch to `main` branch
2. `git pull` - update the `main` branch
3. `yarn build` - run it locally to check if the build will pass
4. `git checkout -b release-vX.X.X` - create and switch to the release branch
5. `yarn prepare-release` - updates the Lerna version (which will be read by the GitHub deploy workflow (`/.github/workflows/deploy.yml`) once the release commit is pushed)
6. Add a changelog entry in `/scripts/changelog.ts`
7. `yarn changelog` - to generate a new changelog entry in `CHANGELOG.md`
8. `git commit -m "release X.X.X"` - commit the changes with the correct release version and push them to your branch. This increases the version number of all packages to the same number.
9. Open a PR from the release branch to `main`
10. Merge your PR, and a [deploy workflow](https://github.com/edtr-io/edtr-io/actions/workflows/deploy.yml) will be triggered on GitHub
11. Once the GitHub workflow is complete, check the packages on NPM
12. Inform the maintainers of package consumers ([frontend](https://github.com/serlo/frontend), [RLP editor integration](https://github.com/serlo/ece-as-a-service), ...?) about the release, providing the version and which packages changed, and any potential breaking changes

No package consumers will be affected by the release until they actually upgrade the version in their projects.

## Adding a new package

TODO
