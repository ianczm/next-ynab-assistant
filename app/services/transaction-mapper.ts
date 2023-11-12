import { SubTransaction, TransactionDetail } from "@/app/services/api-dto";
import moment from "moment/moment";
import { ExtendedTransaction, FlagColor, Occasion, Transaction } from "@/app/services/models";
import _ from "lodash";

export class TransactionMapper {
  private static transactionToExtendedModel(transaction: TransactionDetail): ExtendedTransaction {
    return {
      id: transaction.id,
      date: moment(transaction.date),
      amount: transaction.amount,
      memo: transaction.memo ?? null,
      parentMemo: null,
      account: transaction.account_name,
      flagColor: (transaction.flag_color as FlagColor) ?? null,
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
      flagColor: (transaction.flag_color as FlagColor) ?? null,
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

  static extendedTransactionToTransaction({ payee, category, ...transaction }: ExtendedTransaction): Transaction {
    return transaction;
  }

  static transactionsToOccasion(_transactions: _.Collection<Transaction>, memo?: string): Occasion<Transaction> {
    return {
      memo: memo ?? "Uncombined",
      outstandingAmount: _transactions.sumBy((transactions) => transactions.amount),
      transactions: _transactions.value(),
    };
  }
}
