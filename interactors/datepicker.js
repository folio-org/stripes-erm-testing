
import { Datepicker } from '@folio/stripes-testing';

/* Datepicker is missing warning/error text in stripes-testing default */

export default Datepicker.extend('datepickerNew')
  .filters({
    warningText: (el) => (el.querySelector('[class*=feedbackWarning-]') || {}).textContent,
    errorText: (el) => (el.querySelector('[class*=feedbackError-]') || {}).textContent,
  });