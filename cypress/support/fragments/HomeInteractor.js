import { AppListInteractor as AppList, AppListItemInteractor as AppListItem } from "../../../interactors";

/* The interactor for the home page */
export default class HomeInteractor {
  static navToApp(appName) {
    // Ensure we can open any app, whether hidden or not
    cy.expect(AppList().exists());
    cy.get('[data-test-app-list]').then(el => {
      const hasDropdown = !!el.find('[class^=navListDropdownWrap]').length;
      if (hasDropdown) {
        cy.do(AppList().openAppList());
      }
    });

    cy.expect(AppListItem(appName).exists());
    cy.do(AppListItem(appName).click());
  }
}
