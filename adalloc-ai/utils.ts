import { Currency } from './types';
import { CURRENCIES } from './constants';

export const formatCurrency = (amount: number, currency: Currency): string => {
  const currencyInfo = CURRENCIES.find(c => c.code === currency);
  const symbol = currencyInfo?.symbol || '$';

  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

export const getCurrencySymbol = (currency: Currency): string => {
  const currencyInfo = CURRENCIES.find(c => c.code === currency);
  return currencyInfo?.symbol || '$';
};
