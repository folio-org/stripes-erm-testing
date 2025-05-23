
import { Badge } from '@folio/stripes-testing';

/* Default badge "color" check only tests the entirety of the className */

const badgeRegex = /((.*)\s)?((badge)(---)?) (([a-z]+)(---)?) (([a-z]+)(---)?)/;

const parseBadge = element => {
  const regexArray = badgeRegex.exec(element.className);

  return {
    passedClassName: regexArray?.[2],
    color: regexArray[7],
    size: regexArray[10],
  };
};

export default Badge.extend('badgeNew')
  .selector('[class*=badge-]')
  .filters({
    color: (element) => parseBadge(element).color,
    size: element => parseBadge(element).size,
    passedClassName: element => parseBadge(element).passedClassName,
  });
