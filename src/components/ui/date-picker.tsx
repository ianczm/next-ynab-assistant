import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils/tailwind";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SelectSingleEventHandler } from "react-day-picker";

interface DatePickerProps {
  selectedDate?: Date;
  onSelect: SelectSingleEventHandler;
}

export function DatePicker({ selectedDate, onSelect }: Readonly<DatePickerProps>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[280px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selectedDate} onSelect={onSelect} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
