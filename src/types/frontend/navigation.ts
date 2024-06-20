export type NavOption = {
  id: string;
  label: string;
  href: string;
  disabled: boolean;
};

export type AccountNavOption = NavOption & { balance: number };
