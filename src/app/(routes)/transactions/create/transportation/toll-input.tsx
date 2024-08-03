import { Toll } from "@/data/common/tolls";
import { Button, Input } from "@nextui-org/react";
import { Plus } from "lucide-react";
import { useState } from "react";

interface TollInputProps {
  onAddToll: (toll: Toll) => void;
}

export function TollInput({ onAddToll }: Readonly<TollInputProps>) {
  const [tollInput, setTollInput] = useState<Toll>({ name: "", amount: 0 });
  const setTollNameInput = (value: string) => setTollInput((prev) => ({ ...prev, name: value }));
  const setTollAmountInput = (value: string) => setTollInput((prev) => ({ ...prev, amount: parseFloat(value) }));

  function onClick() {
    if (tollInput.name && tollInput.amount) {
      onAddToll({
        displayName: tollInput.name,
        name: tollInput.name,
        amount: tollInput.amount,
      });
      setTollInput({ name: "", amount: 0 });
    }
  }

  return (
    <div className="flex gap-2">
      <div className="flex flex-grow divide-x divide-gray-400 overflow-hidden rounded-xl border border-gray-400">
        <Input
          isClearable
          value={tollInput.name}
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
          value={tollInput.amount !== 0 ? tollInput.amount.toString() : ""}
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
      <Button className="h-auto w-16 rounded-xl bg-gray-950 px-4 py-3 font-bold text-white" onClick={onClick}>
        <Plus size={16} strokeWidth={3} />
      </Button>
    </div>
  );
}
