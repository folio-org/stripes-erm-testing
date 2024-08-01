# stripes-erm-testing

A repository for shared testing config and components for the ERM suite of applications

## Cypress

### Running the tests

As a developer, there are several options for running the cypress tests, but they all have one thing in common. There must already be a fully functioning back/front-end system to point at.

NOTE - Cypress version is dictated by @folio/stripes-testing, and so we need to keep the version in our package.json in lockstep to avoid confusion and drift.

#### Commands

Running with

```
yarn test:cypress
```

will point at the [cypress development system](https://folio-testing-cypress-diku.ci.folio.org/).

Alternatively, there are options to point at various other running FOLIO instances:

- `yarn test:cypress:snapshot` will run against FOLIO snapshot
- `yarn test:cypress:snapshot2` will run against FOLIO snapshot
- `yarn test:cypress:vagrant` will run against a vagrant box configured as in `mod-agreements`
- `yarn test:cypress:local` will run against a running rancher desktop system for K-Int developers.

#### Options

Cypress options can be found through the [cypress documentation](https://docs.cypress.io/guides/guides/command-line), but some important options are listed below:

- `--headed`: Normally cypress tests run "headlessly", ie without displaying the UI to the user. This can be changed with the headed option, to allow the developer or QA personnel to watch the tests unfold.
- `--no-exit`: In conjunction with `--headed`, normally a headed test will exit, which when running with the UI means the developer does not then have a chance to click around the instance. No exit option prevents this. (It also prevents moving on to the next test.)
- `--spec`: Can be used to specify either an individual test, or set of tests. `--spec "cypress/e2e/agreements/*"` for example would run only the tests found in the agreements directory, and `--spec "cypress/e2e/agreements/agreement-lifecycle.cy.js"` would run only that specific test.

See the documentation above for more in depth instructions/other commands.

#### Self contained tests

Tests run in an order defined by cypress (Alphabetically) and so it cannot be assumed that one test spec can set up items for another. For that reason, tests should be self-contained, as in they should set up all the items required for the test to take place by themselves, and subsequently clean up after themselves, if required.

If similar set up/clean up commands are required in a number of tests, a helper can be appended to a relevant Interactor (likely AppInteractor) to make that process easier to write per test.

### Environment

These tests are full integration tests, which mean that they will create actual objects through api calls on that running system. This means that running tests multiple times can cause a build up of items in the system, and not being careful about unique naming or alternatively cleaning up after a test has finished could lead to unique name constraint errors on the second run of tests.

For example, if a test is written for Agreements which creates an agreement called "Test" and then does not subsequently delete that test, then at the end of the test run, an Agreement called "Test" will remain in the system. If the tests were then run again they would fail, as a new agreement with the name "Test" would be unable to be created.

#### Default test language
In `cypress/support/e2e.js` a before and after hook is added to ensure that the systems locale is `en-US`.

### File upload

If it's necessary to upload a file into the system during a test, place that file in the `cypress/fixtures` directory.

### Testing permissions

Generally the frontend should not run with `--hasAllPerms` parameter, but especially when testing permissions it's crucial not to use that option.
