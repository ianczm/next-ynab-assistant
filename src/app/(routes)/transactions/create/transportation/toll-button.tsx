"use client";

import { Toll } from "@/data/common/tolls";
import { useHover } from "@uidotdev/usehooks";
import { TrashIcon } from "lucide-react";

export interface TollButtonProps {
  toll: Toll;
  onClick: () => void;
}

export function TollButton({ toll, onClick }: Readonly<TollButtonProps>) {
  const [hoverRef, hovering] = useHover();

  return (
    <button
      ref={hoverRef}
      key={toll.displayName}
      className="-mx-4 flex items-center justify-between px-4 py-2 hover:bg-slate-100"
      onClick={onClick}
    >
      <span>{toll.displayName}</span>
      {hovering ? <TrashIcon size={16} strokeWidth={2} /> : <span>{toll.amount.toFixed(2)}</span>}
    </button>
  );
}
