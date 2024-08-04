import { Toll } from "@/data/common/tolls";
import { GUID } from "@/ui/types/guid";
import { Button } from "@nextui-org/react";

interface CommonTollsProps {
  commonTolls: GUID<Toll>[];
  onTollClick: (toll: GUID<Toll>) => void;
}

export function CommonTolls({ commonTolls, onTollClick }: Readonly<CommonTollsProps>) {
  return (
    <div className="flex flex-wrap gap-1">
      {commonTolls.map((toll) => (
        <Button
          key={toll.guid}
          variant="ghost"
          className="flex gap-3 rounded-xl border border-gray-400 px-4 py-3 text-xs text-gray-950 hover:border-gray-950 hover:!bg-gray-950 hover:text-white"
          onClick={() => onTollClick(toll)}
        >
          <span>{toll.displayName}</span>
          <span>
            <b>{toll.amount.toFixed(2)}</b>
          </span>
        </Button>
      ))}
    </div>
  );
}
