import { CurrencyUnit } from '../types/financial';

/**
 * Formats a number in Indian numbering system (e.g. 1,23,45,678)
 */
export function formatIndianCurrency(
  value: number,
  unit: CurrencyUnit = 'AUTO',
  includeSymbol: boolean = true
): string {
  if (value === undefined || value === null || isNaN(value)) {
    return includeSymbol ? '₹0' : '0';
  }

  const prefix = includeSymbol ? '₹' : '';
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  if (unit === 'CRORE') {
    const cr = absValue / 10000000;
    return `${isNegative ? '-' : ''}${prefix}${cr.toFixed(2)} Cr`;
  }

  if (unit === 'LAKH') {
    const lk = absValue / 100000;
    return `${isNegative ? '-' : ''}${prefix}${lk.toFixed(2)} L`;
  }

  if (unit === 'RUPEE') {
    return `${isNegative ? '-' : ''}${prefix}${formatIndianNumber(Math.round(absValue))}`;
  }

  // AUTO mode:
  if (absValue >= 10000000) {
    const cr = absValue / 10000000;
    return `${isNegative ? '-' : ''}${prefix}${cr.toFixed(2)} Cr`;
  } else if (absValue >= 100000) {
    const lk = absValue / 100000;
    return `${isNegative ? '-' : ''}${prefix}${lk.toFixed(2)} L`;
  } else {
    return `${isNegative ? '-' : ''}${prefix}${formatIndianNumber(Math.round(absValue))}`;
  }
}

/**
 * Standard Indian comma separation helper
 */
export function formatIndianNumber(num: number): string {
  const parts = num.toString().split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return parts.length > 1 ? formattedInteger + '.' + parts[1] : formattedInteger;
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

export function parseIndianNumber(str: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/[₹,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
