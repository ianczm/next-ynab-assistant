import { Moment } from "moment";

export type ReceiptDetails = {
  paidTo: string;
  memo: string;
  date: Moment;
};

export type ReceiptEntryParticipant = {
  payeeId: string;
  payeeName: string;
  amount: number;
};

export class ReceiptEntry {
  private readonly itemName: string;
  private readonly unitPrice: number;
  private readonly quantity: number;
  private readonly participants: ReceiptEntryParticipant[];

  constructor(parameters: {
    itemName: string;
    unitPrice: number;
    quantity: number;
    participants: ReceiptEntryParticipant[];
  }) {
    this.itemName = parameters.itemName;
    this.unitPrice = parameters.unitPrice;
    this.quantity = parameters.quantity;
    this.participants = parameters.participants;
  }
}

export class ReceiptModifier {
  private readonly modifier: (value: number) => number;
  private readonly name: string;

  constructor(parameters: { modifier: (value: number) => number; name: string }) {
    this.modifier = parameters.modifier;
    this.name = parameters.name;
  }

  evaluate(value: number): number {
    return this.modifier(value);
  }
}

export class PercentageReceiptModifier extends ReceiptModifier {
  constructor(name: string, percentage: number) {
    super({
      name: name,
      modifier: (value) => value * (percentage / 100),
    });
  }
}

export class Receipt {
  details: ReceiptDetails;
  entries: ReceiptEntry[];
  modifiers: ReceiptModifier[];

  constructor(parameters: { details: ReceiptDetails; entries }) {}
}
