import moment from "moment";

export enum FlagColor {
  RED = "red",
  ORANGE = "orange",
  YELLOW = "yellow",
  GREEN = "green",
  BLUE = "blue",
  PURPLE = "purple",
}

export interface Transaction {
  id: string;
  date: moment.Moment;
  amount: number;
  memo: string | null;
  parentMemo: string | null;
  account: string;
  flagColor: FlagColor | null;
}

export interface ExtendedTransaction extends Transaction {
  payee: {
    id: string | null;
    name: string | null;
  };
  category: {
    id: string | null;
    name: string | null;
  };
}

export interface Occasion<T extends Transaction> {
  memo: string | null;
  outstandingAmount: number;
  transactions: T[];
}

export interface Payee<T extends Transaction> {
  payeeId: string | null;
  payeeName: string | null;
  outstandingAmount: number;
  occasions: Occasion<T>[];
}
