export function currencyToMilliUnits(amount: number) {
  return -1 * Math.round(amount * 1000);
}

export function milliUnitsToCurrency(amount: number) {
  return ((-1 * amount) / 1000).toFixed(2);
}
