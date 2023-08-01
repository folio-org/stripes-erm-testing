
import { Card } from '@folio/stripes-testing';
/* Card selector doesn't work */

export default Card.extend('cardNew')
  .selector('div[class^=card]');
