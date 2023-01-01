import ldmlNumber from 'ldml-number';

// currency format config
ldmlNumber.locale.is = {
  thousands_separator: '.',
  decimal_separator: ',',
};
ldmlNumber.locale.eu = {
  thousands_separator: '.',
  decimal_separator: ',',
};

const formatIs = ldmlNumber('#,##0', 'is');
const formatEn = ldmlNumber('#,##0.#', 'en');
const formatEur = ldmlNumber('#,##0.#', 'eu');

const currencySymbols = {
  USD: '$',
  EUR: '€',
  ISK: 'kr',
  GBP: '£',
};

const addCurrency = (price: number, currency: string, useSymbol: boolean) => {
  if (useSymbol) {
    const currencyString = currencySymbols[currency];

    return `${currency !== 'ISK' ? currencyString : ''}${price}${
      currency !== 'ISK' ? '' : ` ${currencyString}`
    }`;
  }

  return `${currency} ${price}`;
};

export const formatPrice = (
  amount: number,
  currency: string,
  useSymbol: boolean
) => {
  switch (currency) {
    case 'EUR':
      return addCurrency(formatEur(amount), currency, useSymbol);
    case 'ISK':
      return addCurrency(formatIs(amount), currency, useSymbol);
    default:
      return addCurrency(formatEn(amount), currency, useSymbol);
  }
};
