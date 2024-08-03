import { Button } from "@/ui/components/shadcn/button";
import { Calendar } from "@/ui/components/shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/components/shadcn/popover";
import { cn } from "@/ui/utils/tailwind";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { SelectSingleEventHandler } from "react-day-picker";

interface DatePickerProps {
  selectedDate?: Date;
  onSelect: SelectSingleEventHandler;
  classNames?: {
    button: string;
  };
}

export function DatePicker({ selectedDate, onSelect, classNames }: Readonly<DatePickerProps>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] items-center justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            classNames?.button,
          )}
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
