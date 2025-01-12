"use client";

import * as React from "react";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const sortFields = [
  {
    value: "date",
    label: "Date",
  },
  {
    value: "name",
    label: "Name",
  },
  {
    value: "priority",
    label: "Priority",
  },
];

const sortOrders = [
  {
    value: "asc",
    label: "Asc",
  },
  {
    value: "desc",
    label: "Desc",
  },
];

interface SortControlsProps {
  onSortChange: (field: string, order: string) => void;
}

export function SortControls({ onSortChange }: SortControlsProps) {
  const [openField, setOpenField] = React.useState(false);
  const [openOrder, setOpenOrder] = React.useState(false);
  const [sortField, setSortField] = React.useState("date");
  const [sortOrder, setSortOrder] = React.useState("desc");

  const handleFieldChange = (value: string) => {
    setSortField(value);
    onSortChange(value, sortOrder);
  };

  const handleOrderChange = (value: string) => {
    setSortOrder(value);
    onSortChange(sortField, value);
  };

  return (
    <div className="flex gap-2">
      <Popover open={openField} onOpenChange={setOpenField}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openField}
            className="w-[120px] justify-between"
          >
            {sortField
              ? sortFields.find((field) => field.value === sortField)?.label
              : "Sort by..."}
            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[120px] p-0">
          <Command>
            <CommandInput placeholder="Search field..." />
            <CommandList>
              <CommandEmpty>No field found.</CommandEmpty>
              <CommandGroup>
                {sortFields.map((field) => (
                  <CommandItem
                    key={field.value}
                    value={field.value}
                    onSelect={handleFieldChange}
                  >
                    <LuCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        sortField === field.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {field.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={openOrder} onOpenChange={setOpenOrder}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openOrder}
            className="w-[100px] justify-between"
          >
            {sortOrder
              ? sortOrders.find((order) => order.value === sortOrder)?.label
              : "Order..."}
            <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[100px] p-0">
          <Command>
            <CommandList>
              <CommandGroup>
                {sortOrders.map((order) => (
                  <CommandItem
                    key={order.value}
                    value={order.value}
                    onSelect={handleOrderChange}
                  >
                    <LuCheck
                      className={cn(
                        "mr-2 h-4 w-4",
                        sortOrder === order.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {order.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
