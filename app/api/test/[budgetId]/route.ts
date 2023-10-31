import YnabProvider from "@/app/providers/ynab-provider";
import { SubTransaction, TransactionDetail } from "@/app/ynab/api-dto";
import { NextRequest, NextResponse } from "next/server";
import moment from "moment/moment";
import _ from "lodash";

let ynabService = YnabProvider.getInstance();

interface Transaction {
  id: string;
  date: moment.Moment;
  amount: number;
  memo: string | null;
  parentMemo: string | null;
  account: string;
}

interface ExtendedTransaction extends Transaction {
  payee: {
    id: string | null;
    name: string | null;
  };
  category: {
    id: string | null;
    name: string | null;
  };
}

interface Occasion<T extends Transaction> {
  memo: string | null;
  outstandingAmount: number;
  transactions: T[];
}

interface Payee<T extends Transaction> {
  payeeId: string | null;
  payeeName: string | null;
  outstandingAmount: number;
  occasions: Occasion<T>[];
}

class TransactionMapper {
  private static transactionToExtendedModel(transaction: TransactionDetail): ExtendedTransaction {
    return {
      id: transaction.id,
      date: moment(transaction.date),
      amount: transaction.amount,
      memo: transaction.memo ?? null,
      parentMemo: null,
      account: transaction.account_name,
      payee: {
        id: transaction.payee_id ?? null,
        name: transaction.payee_name ?? null,
      },
      category: {
        id: transaction.category_id ?? null,
        name: transaction.category_name ?? null,
      },
    };
  }

  private static subtransactionToExtendedModel(
    subtransaction: SubTransaction,
    transaction: TransactionDetail,
  ): ExtendedTransaction {
    return {
      id: subtransaction.id,
      date: moment(transaction.date),
      amount: subtransaction.amount,
      memo: subtransaction.memo ?? null,
      parentMemo: transaction.memo ?? null,
      account: transaction.account_name,
      payee: {
        id: subtransaction.payee_id ?? null,
        name: subtransaction.payee_name ?? null,
      },
      category: {
        id: subtransaction.category_id ?? null,
        name: subtransaction.category_name ?? null,
      },
    };
  }

  static transactionToExtendedModels(transaction: TransactionDetail): ExtendedTransaction[] {
    return [
      TransactionMapper.transactionToExtendedModel(transaction),
      ...transaction.subtransactions.map((subtransactions) =>
        TransactionMapper.subtransactionToExtendedModel(subtransactions, transaction),
      ),
    ];
  }
}

export async function GET(request: NextRequest, { params }: { params: { budgetId: string } }) {
  let response = await ynabService.getAllTransactions(params.budgetId);

  function isReceivable(transaction: ExtendedTransaction) {
    return transaction.category.name === "General Receivables";
  }

  function getMergedMemo(transaction: Transaction) {
    return [transaction.parentMemo, transaction.memo].filter((s) => !!s).join(" / ");
  }

  // Could potentially use ML to categorize in the future

  let result = _(response.data.data.transactions)
    .flatMap(TransactionMapper.transactionToExtendedModels)
    .filter(isReceivable)
    .groupBy((transaction) => transaction.payee.name)
    .map((transactions, payeeName): Payee<Transaction> => {
      let _transactions = _(transactions);

      let _occasions = _transactions
        .groupBy((transaction) => Math.abs(transaction.amount))
        .map((transactions) => {
          let _transactions = _(transactions);
          let transaction = _transactions.first()!;
          return {
            memo: transaction.memo,
            outstandingAmount: _transactions.sumBy((transaction) => transaction.amount),
            transactions: transactions.map(({ payee, category, ...transaction }) => ({ ...transaction })),
          } as Occasion<Transaction>;
        });

      let _amountPairedOccasions = _occasions.filter((occasion) => occasion.outstandingAmount === 0);
      let _memoPairedOccasions = _(
        _.differenceBy(
          _occasions.flatMap((occasion) => occasion.transactions).value(),
          _amountPairedOccasions.flatMap((occasion) => occasion.transactions).value(),
          (transaction) => transaction.id,
        ),
      )
        .groupBy((transaction) => transaction.memo)
        .map((transactions, memo) => {
          let _transactions = _(transactions);
          return {
            memo: memo === "null" ? null : memo,
            outstandingAmount: _transactions.sumBy((transaction) => transaction.amount),
            transactions: transactions,
          } as Occasion<Transaction>;
        });

      let [_memoPairedOccasionsGeOne, _unpairedOccasions] = _.partition(
        _memoPairedOccasions.value(),
        (occasion) => occasion.transactions.length === 0,
      );

      let _unpairedTransactions = _(_unpairedOccasions).flatMap((occasion) => occasion.transactions);

      return {
        payeeId: _transactions.first()!.payee.id ?? null,
        payeeName: payeeName,
        outstandingAmount: _transactions.sumBy((transactions) => transactions.amount),
        occasions: _.concat(_amountPairedOccasions.value(), _memoPairedOccasionsGeOne, {
          memo: "Uncombined",
          outstandingAmount: _unpairedTransactions.sumBy((transaction) => transaction.amount),
          transactions: _unpairedTransactions.value(),
        }),
      };
    });

  return NextResponse.json(result);
}
