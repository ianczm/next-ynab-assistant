"use client";

import { DatePicker } from "@/components/ui/date-picker";
import moment, { Moment } from "moment";
import { useCallback, useEffect, useState } from "react";

import ClearSaveButtonArray from "@/components/compound/ClearSaveButtonArray";
import { isBlank } from "@/lib/utils/strings";
import { AssistantApiClientProvider } from "@/providers/client/assistant-api-client-provider";
import { SimpleTransaction, SimpleTransactionDTO } from "@/types/domain/transactions";
import { Input } from "@nextui-org/react";
import _ from "lodash";

const apiClient = AssistantApiClientProvider.get();
const BUDGET_ID = "eefbb017-955c-4350-ad22-f7b4d3f53236";

async function getInvestments(accountId: string, revalidate: boolean) {
  return await apiClient.getInvestments(BUDGET_ID, accountId, revalidate);
}

async function postUpdateBalance(accountId: string, transaction: SimpleTransactionDTO) {
  return await apiClient.postInvestment(BUDGET_ID, accountId, transaction);
}

function generateKey(transaction: SimpleTransaction) {
  return `${transaction.id ?? ""}-${transaction.date.format("YYYY-MM-DD")}`;
}

function Transaction({ date, amount }: Readonly<SimpleTransaction>) {
  return (
    <li className={"flex w-full items-center justify-between"}>
      <span>{date.format("DD MMM, YYYY")}</span>
      <span>{amount.toFixed(2)}</span>
    </li>
  );
}

export default function InvestmentsPage({ params }: Readonly<{ params: { accountId: string } }>) {
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [transactions, setTransactions] = useState<SimpleTransaction[]>([]);
  const [balance, setBalance] = useState<string>("");

  function setTransactionsSorted(transactions: SimpleTransaction[]) {
    const sortedTransactions = _(transactions)
      .sortBy((transaction) => -transaction.date)
      .value();
    setTransactions(sortedTransactions);
  }

  function total(transactions: SimpleTransaction[]) {
    return _.sumBy(transactions, (transaction) => transaction.amount);
  }

  function getDeposits() {
    return transactions.filter((transaction) => transaction.type === "deposit");
  }

  function getCapitalGains() {
    return transactions.filter((transaction) => transaction.type === "capital" || transaction.type === "unknown");
  }

  function splitDepositsCapital() {
    return [
      {
        category: "Capital",
        data: getCapitalGains(),
      },
      {
        category: "Deposits",
        data: getDeposits(),
      },
    ];
  }

  function handleClear() {
    setBalance("");
  }

  function buildAdjustmentTransaction(date: Moment, adjustmemt: number): SimpleTransactionDTO {
    return {
      amount: adjustmemt,
      date: date.toISOString(),
      type: "capital",
    };
  }

  const fetchTransactions = useCallback(
    async (revalidate: boolean) => {
      const transactions = (await getInvestments(params.accountId, revalidate)).data.map(
        (transaction) =>
          ({
            id: transaction.id,
            date: moment(transaction.date),
            amount: transaction.amount,
            type: transaction.type,
          }) as SimpleTransaction,
      );
      setTransactionsSorted(transactions);
    },
    [params.accountId],
  );

  async function handleSave() {
    const newBalance = parseFloat(balance);
    const adjustment = newBalance - total(transactions);
    const transaction = buildAdjustmentTransaction(selectedDate, adjustment);
    await postUpdateBalance(params.accountId, transaction);
    handleClear();
    fetchTransactions(true);
  }

  useEffect(() => {
    fetchTransactions(false);
  }, [fetchTransactions]);

  return (
    <>
      <div className="flex flex-col gap-4 p-8 text-xs">
        <span className="text-[0.7rem] uppercase">Update investment</span>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Pick a date</span>
          {/* Date picker */}
          <DatePicker
            selectedDate={selectedDate.toDate()}
            onSelect={(date) => setSelectedDate(date ? moment(date) : moment())}
            classNames={{
              button: "text-xs text-gray-950 border-gray-400 w-full",
            }}
          ></DatePicker>
          <Input
            isClearable
            value={balance}
            onValueChange={setBalance}
            variant="bordered"
            type="number"
            step="0.01"
            min="0"
            label="Enter new account balance"
            classNames={{
              base: "w-full bg-transparent",
              inputWrapper: "px-4 py-3 border border-gray-400 rounded-xl",
              label: "text-xs",
              input: "text-xs font-bold",
            }}
          />
        </div>
      </div>
      <div className={"flex flex-col gap-4 p-8 text-xs"}>
        <span className="text-[0.7rem] uppercase">History</span>
        <div className={"flex justify-between text-base font-bold"}>
          <span>Total</span>
          <span>{total(transactions).toFixed(2)}</span>
        </div>
        {splitDepositsCapital().map((transactions) => (
          <ul key={transactions.category}>
            <div className={"flex justify-between text-base font-bold"}>
              <span>{transactions.category}</span>
              <span>{total(transactions.data).toFixed(2)}</span>
            </div>
            {transactions.data.map((transaction) => (
              <Transaction key={generateKey(transaction)} {...transaction} />
            ))}
          </ul>
        ))}
      </div>
      <ClearSaveButtonArray handleClear={handleClear} handleSave={handleSave} isDisabled={isBlank(balance)} />
    </>
  );
}
