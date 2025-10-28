"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty
} from "@/components/ui/command"
import { ChevronsUpDown, Check } from "lucide-react"

interface SearchSelectInputProps {
  label?: string
  items: { id: string; name: string }[]
  value: string
  onChange: (val: string) => void
  loading?: boolean
  placeholder: string
  isMobile: boolean
  disabled?: boolean
}

export function SearchSelectInput({
                                    label,
                                    items,
                                    value,
                                    onChange,
                                    loading = false,
                                    placeholder,
                                    isMobile,
                                    disabled = false,
                                  }: SearchSelectInputProps) {
  const [open, setOpen] = useState(false)
  const selectedItem = items.find((i) => i.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="justify-between w-full"
          style={{
            padding: isMobile ? "3.5vw 4vw" : "0.714vw 1.143vw",
            fontSize: isMobile ? "3.5vw" : "1vw",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          {loading
            ? "Loading..."
            : selectedItem
              ? selectedItem.name
              : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)]"
        align="start"
      >
        <Command
          style={{
            padding: isMobile ? "3.5vw 4vw" : "0.714vw 1.143vw",
            fontSize: isMobile ? "3.5vw" : "1vw",
          }}
        >
          <CommandInput
            placeholder={`Search ${label || ""}...`}
          />
          <CommandList>
            <CommandEmpty>No result found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={() => {
                    onChange(item.id)
                    setOpen(false)
                  }}
                  style={{
                    padding: isMobile ? "3.5vw 4vw" : "0.714vw 1.143vw",
                    fontSize: isMobile ? "3.5vw" : "1vw",
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      item.id === value ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
