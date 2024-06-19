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
 * Small hack to toggle active class on navigation buttons
 */
type Page = 'accueil' | 'mail' | 'actions' | 'historique';

export let currentPage: Page = 'accueil';

export function setCurrentPage(page: Page) {
  currentPage = page;
}

export function getCurrentPage(): Page {
  return currentPage;
}
