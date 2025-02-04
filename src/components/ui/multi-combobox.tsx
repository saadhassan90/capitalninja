"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export type ComboboxOption = {
  value: string
  label: string
  group: string
}

interface MultiComboboxProps {
  options: ComboboxOption[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
}

export function MultiCombobox({
  options,
  selected,
  onChange,
  placeholder = "Select options...",
}: MultiComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const toggleOption = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    onChange(newSelected)
  }

  const groupedOptions = options.reduce((acc, option) => {
    if (!acc[option.group]) {
      acc[option.group] = []
    }
    acc[option.group].push(option)
    return acc
  }, {} as Record<string, ComboboxOption[]>)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex flex-wrap gap-1 max-w-[90%]">
            {selected.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selected.map((value) => (
                <Badge
                  variant="secondary"
                  key={value}
                  className="mr-1 mb-1"
                >
                  {options.find(opt => opt.value === value)?.label || value}
                </Badge>
              ))
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search locations..." />
          <CommandEmpty>No location found.</CommandEmpty>
          {Object.entries(groupedOptions).map(([group, groupOptions]) => (
            <CommandGroup key={group} heading={group}>
              {groupOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => toggleOption(option.value)}
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
  )
}