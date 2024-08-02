"use client";

import { useEffect, useState } from "react";
import { Toll } from "@/types/domain/tolls";
import { Button } from "@nextui-org/button";
import { Plus } from "lucide-react";
import { Input } from "@nextui-org/react";
import { AssistantApiClientProvider } from "@/providers/client/assistant-api-client-provider";
import { DatePicker } from "@/components/ui/date-picker";
import moment, { Moment } from "moment";
import { TollButton } from "./toll-button";
import { v4 as uuidv4 } from "uuid";

const apiClient = AssistantApiClientProvider.get();

type TollWithGUID = Toll & { guid: string };

export default function CreateTransactionPage() {
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [addedTolls, setAddedTolls] = useState<TollWithGUID[]>([]);
  const [tollNameInput, setTollNameInput] = useState<string>("");
  const [tollAmountInput, setTollAmountInput] = useState<string>("");

  const [commonTolls, setCommonTolls] = useState<Toll[]>([]);

  useEffect(() => {
    const fetchCommonTolls = async () => {
      const tolls: Toll[] = await apiClient.getUniqueTolls().then((response) => response.data);
      setCommonTolls(tolls);
    };
    fetchCommonTolls();
  }, []);

  function addToll(toll: Toll) {
    setAddedTolls([...addedTolls, { ...toll, guid: uuidv4() }]);
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

  function deleteToll(guid?: string) {
    setAddedTolls((prev) => prev.filter((toll) => toll.guid !== guid));
  }

  async function handleSave() {
    await apiClient.postTollTransactions(addedTolls, moment(selectedDate)).catch(console.error);
    handleClear();
  }

  function computeTotalAmount() {
    return addedTolls.reduce((sum, toll) => sum + toll.amount, 0).toFixed(2);
  }

  return (
    <>
      {/* Form */}
      <div className="flex flex-col gap-4 p-8 text-xs">
        <span className="text-[0.7rem] uppercase">Select Date</span>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Pick a date</span>
          {/* Date picker */}
          <DatePicker
            selectedDate={selectedDate.toDate()}
            onSelect={(date) => setSelectedDate(date ? moment(date) : moment())}
            classNames={{
              button: "text-xs text-gray-950 border-gray-400",
            }}
          ></DatePicker>
        </div>
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
          <div className="flex flex-col gap-1">
            {addedTolls.length === 0 ? (
              <span className="cursor-default py-3 text-left text-gray-400">There are no tolls to preview.</span>
            ) : (
              addedTolls.map((toll) => <TollButton key={toll.guid} toll={toll} onClick={() => deleteToll(toll.guid)} />)
            )}
          </div>
        </div>
      </div>
      {/* Button */}
      <div className="fixed bottom-0 z-10 flex w-full gap-2 bg-gradient-to-t from-white from-70% to-transparent p-8">
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
    </>
  );
}
