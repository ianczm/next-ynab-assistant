"use client";

import { Button } from "@/ui/components/shadcn/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/components/shadcn/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/components/shadcn/ui/popover";
import { cn } from "@/ui/utils/tailwind";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface ComboboxProps {
  onSelect: (value: string) => void;
  items: { label: string; value: string }[];
  placeholder: string;
  emptyMessage: string;
}

export function Combobox({ onSelect, items, placeholder, emptyMessage }: Readonly<ComboboxProps>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {value ? items.find((item) => item.value === value)?.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(selectedValue) => {
                    onSelect(selectedValue);
                    setValue(selectedValue);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")} />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
