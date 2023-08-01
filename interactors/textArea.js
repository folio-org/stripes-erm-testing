import { TextArea } from '@folio/stripes-testing';
/* TextArea selector doesn't work */

export default TextArea.extend('text area new')
  .selector('div[class^=textArea]');

