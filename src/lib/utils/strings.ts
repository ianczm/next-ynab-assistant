export function isBlank(str: string) {
  if (str === null || str === undefined) {
    return true;
  }

  const cleanInput = str.trim();
  return cleanInput.length === 0;
}
