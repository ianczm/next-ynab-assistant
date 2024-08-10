"use client";

import { Account } from "@/data/common/accounts";
import { apiProvider } from "@/services/frontend/api-service";
import { Combobox } from "@/ui/components/shadcn/ui/combobox";
import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";

const apiService = apiProvider.get();

export default function AccountsReconcilePage() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [amountInput, setAmountInput] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccounts() {
      const retrievedAccounts = await apiService.getAccounts();
      setAccounts(retrievedAccounts.data);
    }
    fetchAccounts();
  }, []);

  async function handleSave() {
    if (selectedAccount && amountInput) {
      const request: Account = {
        ...selectedAccount,
        balance: parseFloat(amountInput),
      };
      console.log(request);
      await apiService.reconcileAccount(request);
    }
    handleClear();
  }

  function handleClear() {
    setAmountInput(null);
  }

  return (
    <>
      <div className="flex flex-col gap-4 p-8 text-xs">
        <span className="text-[0.7rem] uppercase">Account Selection</span>
        <div className="flex flex-col gap-2">
          <Combobox
            emptyMessage={"No accounts found"}
            placeholder={"Select an account"}
            items={accounts.map((account) => ({ value: account.id, label: account.name }))}
            onSelect={(selectedAccountId) =>
              setSelectedAccount(accounts.find((account) => account.id === selectedAccountId) ?? null)
            }
          ></Combobox>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-8 text-xs">
        <span className="text-[0.7rem] uppercase">Modification Summary</span>

        {selectedAccount ? (
          <>
            <div className="flex flex-row gap-2">
              <div className="flex w-full flex-col">
                <span className="text-base font-bold">Account</span>
                <span className="py-3">{selectedAccount?.name}</span>
              </div>
              <div className="flex w-full flex-col">
                <span className="text-base font-bold">Balance</span>
                <span className="py-3">
                  {selectedAccount?.balance.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-grow divide-x divide-gray-400 overflow-hidden rounded-xl border border-gray-400">
                <Input
                  isClearable
                  value={amountInput ?? ""}
                  onValueChange={setAmountInput}
                  variant="bordered"
                  type="text"
                  label="Updated balance"
                  classNames={{
                    base: "flex-grow !p-0 bg-transparent",
                    inputWrapper: "px-4 py-3 border-none rounded-xl rounded-r-none",
                    label: "text-xs",
                    input: "text-xs",
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <span className="text-base font-bold">No Account Selected</span>
        )}
      </div>
      {/* Button */}
      <div className="fixed bottom-0 z-10 flex w-full gap-2 bg-gradient-to-t from-white from-70% to-transparent p-8">
        <Button
          className="h-auto w-full rounded-xl border border-gray-400 px-4 py-3 font-bold text-gray-950 hover:border-gray-950 hover:!bg-gray-950 hover:text-white"
          variant="ghost"
          onClick={handleClear}
          isDisabled={!amountInput}
        >
          Clear
        </Button>
        <Button
          className="h-auto w-full rounded-xl bg-gray-950 px-4 py-3 font-bold text-white"
          onClick={handleSave}
          isDisabled={!amountInput || parseFloat(amountInput) === selectedAccount?.balance}
        >
          Save
        </Button>
      </div>
    </>
  );
}
