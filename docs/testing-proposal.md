# RTL testing in ERM
This is a document to keep track of some new best practices with regards to Jest based unit testing.

## Current setup
Currently (just after Nolana release Q4 2022), `stripes-erm-components` exposes several test configuration files, helpers, interactors and mocks. The helpers and interactors are directly exposed through the index file, and the mocks are not.

At the current time, all RTL tests written in ERM import at the top of the file, something like this:
```
import  '@folio/stripes-erm-components/test/jest/__mock__';
```
This then imports all of the `mock` files set up in that directory in erm-components as if they had been written in this test. These are in a folder called `__mock__` but do NOT function like Jest manual mocks, meaning that once a component is mocked using this, it becomes very difficult to override that mock for any particular test.

Also, currently nearly all tests have a `testResources` file set up, which provides all the props needed to run the test. Quite often, this includes JSON returned from the backend at the point of writing the test.

Unfortunately these are decoupled from each other, meaning that if the shape changes in one place, and one particular component/test pair is adapted to fix that, the test suite will not catch all the other cases where the shape change might impact functionality, EVEN when we have a test written for that use case.

The final issue with this current setup is that `stripes-erm-components` needs to be declared as a regular dependency instead of a `devDep`, meaning that any testing configuration exposed through its API is liable to be pulled into a production build.

## Proposed best practice
The proposed plan is to set up a new testing library `stripes-erm-testing`. All mocks, helpers, interactors and mocked json returns will be stored there, and each of our production modules will have a dev dep on it.

[This repository](https://github.com/folio-org/stripes-erm-testing) is set up, and ready to be used in whichever module needs it. The test repository sets up jest mocks for various libraries and modules, which then can be imported by each module in turn, and implemented as a Jest manual mock.

    !!! IMPORTANT NOTE !!!
    This is a WIP, and some/all of the work described here has not begun/is in a state where we don't even know if it's possible. Changes will be needed to this doc.

### Phase 1, direct mocks (current approach, new repository)

The first step is to move all dependencies over from `stripes-erm-components` to `stripes-erm-testing`. The current mock imports can be directly changed over to 
```
import  '@folio/stripes-erm-testing/jest/directMocks';
```
as well as ensuring that the jest config is drawn from `stripes-erm-testing` instead of  `stripes-erm-components`.

This process can be followed [in this PR](https://github.com/folio-org/ui-agreements/pull/1143).

### Phase 2, manual mocks for external modules
(Once phase 1 is complete for all modules, deadline Orchid, it can be skipped for future modules)

The following step is to utilise the [underlying mock files](https://github.com/folio-org/stripes-erm-testing/tree/master/jest/mocks) to set up jest manual mocks. The easiest way is to copy the example mock directory in this PR (ADD LINK TO PR HERE).

This will enable each test to not have to worry about what is and what isn't being imported, and avoid the situation where many many tests have exactly the same mock at the beginning.


### Phase 3, manual mocks for internal components

Manual mocks can also be set up within modules for any common problem imports. For example in `ui-agreements` a common mock at the top of a test is:

```
jest.mock('../../hooks', () => ({
  ...jest.requireActual('../../hooks'),
  useAgreementsRefdata: () =>  mockRefdata,
}));
```
If a manual mock was set up for `useAgreementsRefdata`, then this would not be necessary to set up in multiple tests, helping readibility and reliability, as well as speeding up the writing of new tests.

Jest manual mocking documentation can be found [here](https://jestjs.io/docs/manual-mocks).

### Phase 4, consistent test resources
At present all our tests set up their own resources. This gives stability within individual tests and decouples all the ERM modules from each other, but also means the tests don't properly catch error cases.

This phase recommends we set up a directory of test resources in `stripes-erm-testing` that can be imported by each module, and then utilised in tests.

From that point, any changes to test resources can and will break tests in other modules, which may happen asyncronously from the resource change.

This allows our tests to properly reflect any issues we may not catch until after a particular change has been made, but obviously could throw roadblocks in the way if an issue is not caught until release time. (Albeit, if the issue has made it to release and not been caught at present, the lack of test failures means that the release will go ahead with the break)

This approach has been trialled by other communities in stripes, and we have been advised that it is difficult to pull off and may cause friction in other teams.

At present this phase is in the early planning stage, any mitigations or strategies to make this plan work as best as possible within the project would be welcome.

Possible Mitigations:
- Have stripes-erm-testing PR action checkout each known module that runs using its shared resources and report back
	- Quite manual, necessitates a list of implementing modules
	- If used as a PR blocker, irrelevant test issues in other modules could get in the way, if only a warning it could be ignored easily for the sake of expediencymk
	- However this would provide a good early warning system, and a springboard to inform other teams that their tests may break
- Have daily/weekly/monthly tasks for each individual module implementing the shared resources, which run the tests and complain loudly if they fail.
	- Similar to the above, except the onus is on an implementing module to follow up when tests start failing
	- Less visible when changing a test resource what that might mean
