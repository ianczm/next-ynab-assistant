export function parseType(input: string | null) {
  const memo = input === null ? "" : input.toLowerCase();
  if (memo.includes("deposit")) {
    return "deposit";
  } else if (memo.includes("update")) {
    return "capital";
  } else {
    return "unknown";
  }
}
