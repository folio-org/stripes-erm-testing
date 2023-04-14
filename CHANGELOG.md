# Change history for stripes-erm-testing

## 1.2.0 In progress
  * Added stripes-kint-components to dev deps
  * Tweaked Harnesses so that we can export *just* the base harness without the kint intl stuff. This means that kint-components can use the base harness as well.

## 1.1.0 2023-02-22
  * Initial e2e cypress tests
  * Tweaks to test harness, to include ModuleHeirachyProvider and KintIntlHarness, to better handle some stripes/kint-components functionality within jest tests
  * Extra translations
  * useChunkedCQLFetch mock
  * ERM-2463 Added interactor for FormattedDateTime
  * Added KintHarness and ModuleHeirachyProvider, to provide some extra solidity and ability to test using `useNamespace` and kintIntl within kint-components
  * Added mocks for `window` methods.
  * Added proper handling for Callouts to allow Callout jest testing
  * Select interactor to fix broken default behaviour of chooseAndBlur
  * TestForm now accepts function children like Form
  * Removed all Bigtest dependencies and references in github actions yml
  * ERM-2645 initial e2e cypress test for licenses
  * add interactor for AppList

## 1.0.0 2022-11-11
  * Added mock files
  * Setup direct mocks to replace old stripes-erm-components method directly
  * Moved interactors into this directory
  * WIP doc for testing standards
