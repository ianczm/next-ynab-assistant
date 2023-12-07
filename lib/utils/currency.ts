export function currencyToMilliUnits(amount: number) {
  return Math.round(amount * 1000);
}

export function milliUnitsToCurrency(amount: number) {
  return amount / 1000;
}
