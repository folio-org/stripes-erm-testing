import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Select } from '../../interactors';

const testSelect = ({
  selector,
  selectorName,
  optionsArray
}) => {
  const actualName = selectorName ?? JSON.stringify(selector);
  return describe.each(optionsArray)(`choosing ${actualName} option %s`, (selectOption) => {
    beforeEach(async () => {
      await waitFor(async () => {
        await Select(selector).choose(selectOption);
      });
    });

    test(`Option ${selectOption} is selected`, async () => {
      await waitFor(async () => {
        await Select(selector).has({ checkedOptionText: selectOption });
      });
    });
  });
};

export default testSelect;

