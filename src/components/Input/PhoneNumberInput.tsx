"use client"

import {useEffect, useState} from "react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import phoneData from "@/lib/data/phone_number.json"
import {ScrollArea} from "@/components/ui/scroll-area";
import Separator from "@/components/Separator/Separator";

interface PhoneNumberInputProps {
  control: any
  isMobile?: boolean
  isRequired?: boolean
}

export function PhoneNumberInput({ control, isMobile = false, isRequired = false }: PhoneNumberInputProps) {
  const [selectedCountry, setSelectedCountry] = useState("ID") // Default Indonesia
  const [searchTerm, setSearchTerm] = useState("")
  const [open, setOpen] = useState(false)

  const currentCountry = phoneData.find(c => c.code === selectedCountry) || phoneData[0]

  const filteredCountries = phoneData.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  )

  useEffect(() => {
    if (!open) setSearchTerm("")
  }, [open])

  return (
    <FormField
      control={control}
      name="phoneNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Phone number {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <div className="flex gap-2">
              {/* Country Code Selector */}
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger
                  style={{padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw"}}
                >
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span>{currentCountry.flagEmoji}</span>
                      <span>{currentCountry.dialCode}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent style={{width: "346px", padding: "8px 16px"}}>
                  <div className="flex items-center rounded-md" style={{gap: "8px", border: "2px solid rgba(224, 224, 224, 1)", padding: "8px 16px"}}>
                    <img src="/asset/search-icon.svg" alt="search" style={{width: "14px", height: "14px"}} />
                    <Input
                      placeholder="Search country..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        border: "none",
                        boxShadow: "none"
                      }}
                    />
                  </div>
                  <Separator type={"dash"} />
                  <ScrollArea style={{height: "250px"}}>
                    <SelectGroup>
                      {filteredCountries.map((country) => (
                        <SelectItem
                          key={country.code}
                          value={country.code}
                          className={"flex justify-between"}
                          style={{padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw", width: "100%"}}
                        >
                          <div>{country.flagEmoji}{" "}{country.name}</div>
                          <div className="text-muted-foreground ml-auto">{country.dialCode}</div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </ScrollArea>
                </SelectContent>
              </Select>

              {/* Phone Number Input */}
              <Input
                type="tel"
                placeholder={currentCountry.placeholder}
                {...field}
                className="flex-1"
                style={{padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw"}}
                onChange={(e) => {
                  // Format input sesuai country format
                  const value = e.target.value.replace(/\D/g, '') // Hanya angka
                  field.onChange(value)
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}