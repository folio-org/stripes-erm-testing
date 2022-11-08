// Direct import is a bit gross, but so is exposing the translations file...
// no super great way to do this so this will do for now.
import ermTranslations from '@folio/stripes-erm-components/translations/stripes-erm-components/en.json'

const translationsProperties = [
  {
    prefix: 'stripes-core',
    translations: {
      'label.missingRequiredField': 'Please fill this in to continue',
      'button.save': 'Save',
    }
  },
  {
    prefix: 'stripes-components',
    translations: {
      'saveAndClose': 'Save and close',
      'cancel': 'Cancel',
      'paneMenuActionsToggleLabel': 'Actions',
      'collapseAll': 'Collapse all',
      'button.edit': 'Edit'
    },
  },
  {
    prefix: 'stripes-smart-components',
    translations: {
      'permissionError': 'Sorry - your permissions do not allow access to this page.',
      'searchAndFilter': 'Search and filter',
      'hideSearchPane': 'Hide search pane',
      'search': 'Search',
      'resetAll': 'Reset all',
      'searchResultsCountHeader': '"{count, number} {count, plural, one {record found} other {records found}}"',
      'new': 'New'
    },
  },
  {
    prefix: 'stripes-erm-components',
    translations: ermTranslations
  }
];

export default translationsProperties;
