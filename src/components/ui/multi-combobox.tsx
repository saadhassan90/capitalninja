import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
  group?: string;
}

interface MultiComboboxProps {
  options: ComboboxOption[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiCombobox({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const groupedOptions = React.useMemo(() => {
    const groups: { [key: string]: ComboboxOption[] } = {};
    
    options.forEach(option => {
      const group = option.group || 'Other';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(option);
    });
    
    return groups;
  }, [options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected.length === 0
            ? placeholder
            : `${selected.length} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>No option found.</CommandEmpty>
          {Object.entries(groupedOptions).map(([group, groupOptions]) => (
            <CommandGroup key={group} heading={group}>
              {groupOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    const newSelected = selected.includes(option.value)
                      ? selected.filter((value) => value !== option.value)
                      : [...selected, option.value];
                    onChange(newSelected);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
}