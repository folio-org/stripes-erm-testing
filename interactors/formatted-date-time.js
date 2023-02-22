import { Bigtest } from '@folio/stripes-testing';

export default Bigtest.createInteractor('formatted-date-time')
  .locator((el) => el.id)
  .filters({
    id: (el) => el.id,
    date: (el) => {
      const nbsp = String.fromCharCode(160);
      return el.textContent.split(nbsp)[0];
    },
    time: (el) => {
      const nbsp = String.fromCharCode(160);
      return el.textContent.split(nbsp)[1];
    },
  });
