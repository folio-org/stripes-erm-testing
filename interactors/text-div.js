import HTML from './baseHTML';

export default HTML.extend('text-div')
  .selector('div')
  .locator((el) => el.textContent)
  .filters({
    textContent: (el) => el.textContent,
  });
