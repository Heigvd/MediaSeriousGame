/**
 * Various utility functions to format or convert variables for display
 */

/**
 * Convert number to Swiss currency format (ignoring cents)
 */
export function convertToCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Logic to toggle active class on navigation buttons
 */
type Page = 'accueil' | 'mail' | 'actions' | 'historique';

export let currentPage: Page = 'accueil';

export function setCurrentPage(page: Page) {
  currentPage = page;
}

export function getCurrentPage(): Page {
  return currentPage;
}

export function getCurrentPhaseInbox() {
  const currentPhase = Variable.find(gameModel, 'phaseMSG').getValue(self);

  switch (currentPhase) {
    case 1:
      return Variable.find(gameModel, 'phase1_CreationEntreprise');
    case 2:
      return Variable.find(gameModel, 'phase1_1');
    case 3:
      return Variable.find(gameModel, 'phase2_ReponseAL_offre');
    case 4:
      return Variable.find(gameModel, 'phase3_PlanificationDuMandat');
  }
}

/**
 * Exception handling specific logic to handle WegasOutOfBoundException error display for core variables
 */

WegasEvents.addEventHandler('exceptionHandler', 'ExceptionEvent', event => {
  for (let exception of event.exceptions) {
    let popupMessage: STranslatableContent;

    if (exception['@class'] === 'WegasOutOfBoundException') {
      switch (exception.variableName) {
        case 'caisse':
          popupMessage = I18n.createTranslatableContent(
            "Malheureusement vous n'avez pas assez de liquidités pour cela."
          );
          break;
        case 'timeCards':
          popupMessage = I18n.createTranslatableContent(
            "Malheureusement vous n'avez plus assez de temps pour cela."
          );
          break;
        default:
          popupMessage = I18n.createTranslatableContent('Une erreur est survenue');
          break;
      }
      Popups.addPopup(
        `exceptionEventPopup-${exception.variableName}`,
        popupMessage,
        5000,
        'msg-popup'
      );
    }
  }
});
