// Direct import is a bit gross, but so is exposing the translations file...
// no super great way to do this so this will do for now.
import ermTranslations from '@folio/stripes-erm-components/translations/stripes-erm-components/en.json'
import coreTranslationsProperties from './coreTranslationsProperties';

const translationsProperties = [
  ...coreTranslationsProperties,
  {
    prefix: 'stripes-erm-components',
    translations: ermTranslations
  }
];

export default translationsProperties;
