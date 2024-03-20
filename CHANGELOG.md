# Change history for stripes-erm-testing

## 2.1.0 In Progress
  * fix: Fixes to integration tests #53 (useSecureTokens, REQUIRES RTR)
  * ERM-2836 Remove an Agreement line
  * ERM-3095 Refactor e2e cypress tests to bring in line with new login

## 2.0.0 2023-10-12
  * Added stripes-kint-components to dev deps
  * Added local-settings test
  * Added timezone check to e2e.js
  * Tweaked Harnesses so that we can export *just* the base harness without the kint intl stuff. This means that kint-components can use the base harness as well.
  * ERM-3045: Swap Logs component to prev-next pagination
  * ERM-3001 Update Node.js to v18 in GitHub Actions
  * ERM-2973 Replace naive fetch hooks with parallelised ones (and deprecate)
  * ERM-2967 Use useChunkedCQLFetch consistently across ERM
  * ERM-2926 Fix cypress license-lifecycle test
  * ERM-2841 Edit Agreement line and create another, Link from agreement to search for all its agreement lines, Add agreement line with description only
  * ERM-2815 Search or filter for an Agreement
  * ERM-2812 Create an Agreement and Delete an Agreement
    * extend select interactor with selectedContent filter
  * ERM-2773 Add agreement line with internal KB resource
    * add packages: uuid, cypress-wait-until
  * ERM-2715 Create a license and delete a license
    * add a bunch of new interactor functions and cypress commands
  * STRIPES-870 *BREAKING* upgrade react to v18
    * ERM-2995 Upgrade stripes-erm-testing React to v18
  * STRIPES-868 *BREAKING* bump `react-intl` to `v6.4.4`
    * ERM-3035 Upgrade stripes-erm-testing react-intl to v6
  * ERM-3018 Implement GOKb Title UUID as primary match ID where available
    * Updated to use mod-agreements-package schema v2.0 #48

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
