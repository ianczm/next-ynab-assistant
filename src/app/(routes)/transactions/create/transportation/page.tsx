"use client";

import { Toll } from "@/data/common/tolls";
import { apiProvider } from "@/services/frontend/api-service";
import { DatePicker } from "@/ui/components/shadcn/date-picker";
import { GUID } from "@/ui/types/guid";
import { Button } from "@nextui-org/button";
import moment, { Moment } from "moment";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { CommonTolls } from "./common-tolls";
import { useCommonTolls } from "./hooks/use-common-tolls";
import { TollButton } from "./toll-button";
import { TollInput } from "./toll-input";

const apiService = apiProvider.get();

export default function CreateTransactionPage() {
  const commonTolls = useCommonTolls(apiService);

  const [selectedDate, setSelectedDate] = useState<Moment>(moment());

  const [addedTolls, setAddedTolls] = useState<GUID<Toll>[]>([]);
  const addedTollsTotalAmount = addedTolls.reduce((sum, toll) => sum + toll.amount, 0);

  function addToll(toll: Toll) {
    setAddedTolls([...addedTolls, { ...toll, guid: uuidv4() }]);
  }

  function handleClear() {
    setAddedTolls([]);
  }

  function deleteToll(guid?: string) {
    setAddedTolls((prev) => prev.filter((toll) => toll.guid !== guid));
  }

  async function handleSave() {
    await apiService.postTollTransactions(addedTolls, selectedDate).catch(console.error);
    handleClear();
  }

  return (
    <>
      {/* Form */}
      <div className="flex flex-col gap-4 p-8 text-xs">
        <span className="text-[0.7rem] uppercase">Select Date</span>
        <div className="flex flex-col gap-2">
          <span className="font-bold">Pick a date</span>
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
          <CommonTolls commonTolls={commonTolls} onTollClick={addToll} />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold">Other tolls</span>
          <TollInput onAddToll={addToll} />
        </div>
      </div>
      {/* Preview */}
      <div className="flex flex-col gap-4 p-8 text-xs">
        <span className="text-[0.7rem] uppercase">Preview</span>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-base font-bold">
            <span>Tolls</span>
            <span>{addedTollsTotalAmount.toFixed(2)}</span>
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
