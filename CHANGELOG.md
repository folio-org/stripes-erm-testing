# Change history for stripes-erm-testing

## 3.1.0 IN PROGRESS

## 3.0.0 2025-03-13
  * ERM-3607: *BREAKING* Stripes v10 dependencies update
  * *BREAKING* remove renderer as third option in renderWithIntl()
    * Instead it is an option in 3rd position "extraOptions" object
  * Added default value for renderFooter prop in mockTypedownGetter
  * Added invalidate queries as an exposed jest fn
  * Added testSelect helper function
  * Changed mockKy and mockReactQuery to improve automatic coverage of tests
  * Updated most mocks to use jest.fn for easier overriding

## 2.2.1 2024-10-31
  * Reinstate devDev that might have broken releases

## 2.2.0 2024-10-30
  * ERM-3374 Update module license and guidance for stripes-erm-testing
  * ERM-3165 Replace moment with dayjs across app suite
  * defaultProps deprecated
  * Pluggable mock now uses jest.fn so it can be overwritten
  * Cypress fixes and tweaks
  * Centralised github actions
  * Ensure tag is a run condition for github actions (allowing release)

## 2.1.1 2024-04-18
  * Added jest-config-stripes moduleNameMapper configs into jest.config.js, so any fixes and changes in there will be reflected by default
  * Exposed componentMocks, extra complex mocks which make use of stripes-components and so can't be part of manual mocks
    * MockTypedownGetter -- centralised "Typedown" mock that tests can make use of to test typedowns should they wish
  * Added support for TestForm children to access handleSubmit function

## 2.1.0 2024-03-22
  * ERM-3095 Refactor e2e cypress tests to bring in line with new login
  * ERM-2836 Remove an Agreement line
  * fix: Fixes to integration tests #53 (useSecureTokens, REQUIRES RTR)

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
