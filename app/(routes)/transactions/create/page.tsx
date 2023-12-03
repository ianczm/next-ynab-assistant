"use client";

import { cn } from "@/app/_lib/utils";
import { useRef, useState } from "react";

const options = ["Eating Out", "Transportation", "Others"];
const activeOptionIdx = 1;

type Toll = {
  name: string;
  amount: number;
};

const commonTolls: Toll[] = [
  {
    name: "Sg Long",
    amount: 1.66,
  },
  {
    name: "Mines North",
    amount: 1.85,
  },
  {
    name: "Batu 9",
    amount: 1.3,
  },
  {
    name: "Sunway",
    amount: 2.1,
  },
];

export default function CreateTransactionPage() {
  const [addedTolls, setAddedTolls] = useState<Toll[]>([
    {
      name: "Batu 9",
      amount: 1.3,
    },
    {
      name: "Sunway",
      amount: 2.1,
    },
  ]);

  const otherTollName = useRef<HTMLInputElement>(null);
  const otherTollAmount = useRef<HTMLInputElement>(null);

  function addToll(toll: Toll) {
    setAddedTolls([...addedTolls, toll]);
  }

  function handleOtherTollAdd() {
    addToll({
      name: otherTollName.current?.value!,
      amount: parseFloat(otherTollAmount.current?.value!),
    });
    otherTollName.current!.value = "";
    otherTollAmount.current!.value = "";
  }

  function handleClear() {
    setAddedTolls([]);
  }

  function handleSave() {
    console.log(addedTolls);
    handleClear();
    // Todo: add logic to add to YNAB
  }

  function computeTotalAmount() {
    return addedTolls.reduce((sum, toll) => sum + toll.amount, 0).toFixed(2);
  }

  return (
    <main className="h-screen bg-gray-50 text-sm text-black">
      {/* Header */}
      <div className="flex h-44 flex-col justify-end gap-4 bg-gray-950 p-8 pt-0 text-white">
        <p>Create transaction</p>
        <ul className="flex w-max overflow-hidden rounded-xl bg-gray-900">
          {options.map((option, idx) => (
            <li
              key={option}
              className={cn("rounded-xl px-4 py-3 text-xs", {
                "bg-gray-50 font-bold text-black": activeOptionIdx === idx,
              })}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
      {/* Form */}
      <div className="flex flex-col gap-4 p-8 text-xs">
        <span className="text-[0.7rem] uppercase">Select Tolls</span>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Common tolls</span>
          {/* Tolls */}
          <div className="flex flex-wrap gap-1">
            {commonTolls.map((toll) => (
              <button
                key={toll.name}
                className="flex gap-3 rounded-xl border border-gray-400 px-4 py-3"
                onClick={() => addToll(toll)}
              >
                <span>{toll.name}</span>
                <span>
                  <b>{toll.amount.toFixed(2)}</b>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold">Other tolls</span>
          <div className="flex gap-2">
            <div className="flex flex-grow divide-x divide-gray-400 overflow-hidden rounded-xl border border-gray-400">
              <input
                ref={otherTollName}
                type="text"
                placeholder="MEX"
                className="w-16 flex-grow rounded-xl rounded-r-none bg-transparent px-4 py-3"
              />
              <input
                ref={otherTollAmount}
                type="number"
                placeholder="3.50"
                className="w-20 rounded-xl rounded-l-none bg-transparent px-4 py-3 text-right font-bold"
              />
            </div>
            <button className="w-16 rounded-xl bg-black px-4 py-3 font-bold text-white" onClick={handleOtherTollAdd}>
              +
            </button>
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
            {addedTolls.map((toll) => (
              <li key={toll.name} className="flex justify-between">
                <span>{toll.name}</span>
                <span>{toll.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Button */}
      <div className="fixed bottom-0 flex w-full gap-2 p-8">
        <button className="w-full rounded-xl border border-gray-400 px-4 py-3 font-bold" onClick={handleClear}>
          Clear
        </button>
        <button className="w-full rounded-xl bg-black px-4 py-3 font-bold text-white" onClick={handleSave}>
          Save
        </button>
      </div>
    </main>
  );
}
