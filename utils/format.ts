// A simple version of viem's formatUnits
export function formatUnits(value: bigint, decimals: number, maxDecimals?: number): string {
  let display = value.toString();
  
  const negative = display.startsWith('-');
  if (negative) {
    display = display.slice(1);
  }

  let [integer, fraction] = [
    display.slice(0, display.length - decimals) || '0',
    display.slice(display.length - decimals).padStart(decimals, '0'),
  ];
  
  fraction = fraction.replace(/(0+)$/, '');

  if (maxDecimals !== undefined && fraction.length > maxDecimals) {
      fraction = fraction.slice(0, maxDecimals);
  }

  const formatted = fraction ? `${integer}.${fraction}` : integer;
  
  return (negative ? `-${formatted}` : formatted);
}


export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
