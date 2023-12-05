"use client";

import { useState } from "react";
import { Toll } from "@/types/tolls";
import axios from "axios";
import { Tab, Tabs } from "@nextui-org/tabs";
import { Button } from "@nextui-org/button";
import { Plus } from "lucide-react";
import { Input } from "@nextui-org/react";

const options = [
  {
    id: "eating-out",
    label: "Eating Out",
    disabled: false,
  },
  {
    id: "transportation",
    label: "Transportation",
    disabled: false,
  },
  {
    id: "others",
    label: "Others",
    disabled: false,
  },
];

const activeOptionId = "transportation";

const commonTolls: Toll[] = [
  {
    displayName: "Sg Long",
    name: "Sg Long",
    amount: 1.66,
  },
  {
    displayName: "Mines North",
    name: "Sg Besi Mines North",
    amount: 1.85,
  },
  {
    displayName: "Batu 9",
    name: "Batu 9",
    amount: 1.3,
  },
  {
    displayName: "Sunway",
    name: "Sunway",
    amount: 2.1,
  },
];

export default function CreateTransactionPage() {
  const [addedTolls, setAddedTolls] = useState<Toll[]>([]);
  const [tollNameInput, setTollNameInput] = useState<string>("");
  const [tollAmountInput, setTollAmountInput] = useState<string>("");

  function addToll(toll: Toll) {
    setAddedTolls([...addedTolls, toll]);
  }

  function handleAddTollFromInput() {
    if (tollNameInput && tollAmountInput) {
      addToll({
        displayName: tollNameInput,
        name: tollNameInput,
        amount: parseFloat(tollAmountInput),
      });
      setTollNameInput("");
      setTollAmountInput("");
    }
  }

  function handleClear() {
    setAddedTolls([]);
  }

  async function handleSave() {
    console.log(addedTolls);

    const tollTransactions = await axios
      .post<{
        name: string;
        amount: number;
        id: string;
      }>("/api/v1/transactions/create/tolls", addedTolls)
      .then((response) => response.data)
      .catch(console.error);

    console.log(tollTransactions);

    handleClear();
  }

  function computeTotalAmount() {
    return addedTolls.reduce((sum, toll) => sum + toll.amount, 0).toFixed(2);
  }

  return (
    <main className="dark h-screen bg-gray-50 text-sm text-gray-950">
      {/* Header */}
      <div className="flex h-44 flex-col justify-end gap-4 bg-gray-950 p-8 pt-0 text-white">
        <p>Create transaction</p>
        <Tabs
          defaultSelectedKey={activeOptionId}
          classNames={{
            tabList: "rounded-xl bg-gray-800 p-0 gap-0",
            tab: "px-4 py-3 h-auto rounded-xl",
            tabContent: "text-xs font-bold text-gray-400 group-data-[selected=true]:text-gray-950",
            cursor: "dark:bg-white rounded-xl",
          }}
        >
          {options.map((option) => (
            <Tab key={option.id} id={option.id} title={option.label} isDisabled={option.disabled} />
          ))}
        </Tabs>
      </div>
      {/* Form */}
      <div className="flex flex-col gap-4 p-8 text-xs">
        <span className="text-[0.7rem] uppercase">Select Tolls</span>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Common tolls</span>
          {/* Tolls */}
          <div className="flex flex-wrap gap-1">
            {commonTolls.map((toll) => (
              <Button
                key={toll.displayName}
                variant="ghost"
                className="flex gap-3 rounded-xl border border-gray-400 px-4 py-3 text-xs text-gray-950 hover:border-gray-950 hover:!bg-gray-950 hover:text-white"
                onClick={() => addToll(toll)}
              >
                <span>{toll.displayName}</span>
                <span>
                  <b>{toll.amount.toFixed(2)}</b>
                </span>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold">Other tolls</span>
          <div className="flex gap-2">
            <div className="flex flex-grow divide-x divide-gray-400 overflow-hidden rounded-xl border border-gray-400">
              <Input
                isClearable
                value={tollNameInput}
                onValueChange={setTollNameInput}
                variant="bordered"
                type="text"
                label="Toll Name"
                classNames={{
                  base: "flex-grow !p-0 bg-transparent",
                  inputWrapper: "px-4 py-3 border-none rounded-xl rounded-r-none",
                  label: "text-xs",
                  input: "text-xs",
                }}
              />
              <Input
                isClearable
                value={tollAmountInput}
                onValueChange={setTollAmountInput}
                variant="bordered"
                type="number"
                step="0.01"
                min="0"
                label="Amount"
                classNames={{
                  base: "!p-0 w-32 bg-transparent",
                  inputWrapper: "px-4 py-3 border-none rounded-xl",
                  label: "text-xs",
                  input: "text-xs font-bold",
                }}
              />
            </div>
            <Button
              className="h-auto w-16 rounded-xl bg-gray-950 px-4 py-3 font-bold text-white"
              onClick={handleAddTollFromInput}
            >
              <Plus size={16} strokeWidth={3} />
            </Button>
          </div>
        </div>
      </div>
      {/* Preview */}
      <div className="flex flex-col gap-4 p-8 text-xs">
        <span className="text-[0.7rem] uppercase">Preview</span>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-base font-bold">
            <span>Tolls</span>
            <span>{computeTotalAmount()}</span>
          </div>
          {/* Tolls */}
          <ul className="flex flex-col gap-1">
            {addedTolls.length === 0 ? (
              <li className="text-gray-400">There are no tolls to preview.</li>
            ) : (
              addedTolls.map((toll) => (
                <li key={toll.displayName} className="flex justify-between">
                  <span>{toll.displayName}</span>
                  <span>{toll.amount.toFixed(2)}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
      {/* Button */}
      <div className="fixed bottom-0 flex w-full gap-2 p-8">
        <Button
          className="h-auto w-full rounded-xl border border-gray-400 px-4 py-3 font-bold text-gray-950 hover:border-gray-950 hover:!bg-gray-950 hover:text-white"
          variant="ghost"
          onClick={handleClear}
          isDisabled={addedTolls.length === 0}
        >
          Clear
        </Button>
        <Button
          className="h-auto w-full rounded-xl bg-gray-950 px-4 py-3 font-bold text-white"
          onClick={handleSave}
          isDisabled={addedTolls.length === 0}
        >
          Save
        </Button>
      </div>
    </main>
  );
}
