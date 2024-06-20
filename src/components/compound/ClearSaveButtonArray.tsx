import { Button } from "@nextui-org/react";

export default function ClearSaveButtonArray({
  handleClear,
  handleSave,
  isDisabled,
}: Readonly<{
  handleClear: () => void;
  handleSave: () => void;
  isDisabled: boolean;
}>) {
  return (
    <div className="fixed bottom-0 z-10 flex w-full gap-2 bg-gradient-to-t from-white from-70% to-transparent p-8">
      <Button
        className="h-auto w-full rounded-xl border border-gray-400 px-4 py-3 font-bold text-gray-950 hover:border-gray-950 hover:!bg-gray-950 hover:text-white"
        variant="ghost"
        onClick={handleClear}
        isDisabled={isDisabled}
      >
        Clear
      </Button>
      <Button
        className="h-auto w-full rounded-xl bg-gray-950 px-4 py-3 font-bold text-white"
        onClick={handleSave}
        isDisabled={isDisabled}
      >
        Save
      </Button>
    </div>
  );
}
