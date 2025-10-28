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
          <FormLabel
            style={{
              fontSize: isMobile ? "3.5vw" : "0.857vw"
            }}
          >
            Phone number {isRequired && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <div
              className="flex"
              style={{gap: isMobile ? "2vw" : "0.571vw"}}
            >
              {/* Country Code Selector */}
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger
                  style={{
                    padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw",
                    fontSize: isMobile ? "3.5vw" : "1vw",
                    width: isMobile ? "32vw" : "10vw"
                  }}
                >
                  <SelectValue>
                    <div
                      className="flex items-center"
                      style={{
                        gap: isMobile ? "2vw" : "0.571vw",
                        fontSize: isMobile ? "3.5vw" : "1vw"
                      }}
                    >
                      <span>{currentCountry.flagEmoji}</span>
                      <span>{currentCountry.dialCode}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  style={{
                    width: isMobile ? "85vw" : "24.714vw",
                    padding: isMobile ? "2vw 4vw" : "0.571vw 1.143vw"
                  }}
                >
                  <div
                    className="flex items-center rounded-md"
                    style={{
                      gap: isMobile ? "2vw" : "0.571vw",
                      border: "2px solid rgba(224, 224, 224, 1)",
                      padding: isMobile ? "2vw 4vw" : "0.571vw 1.143vw"
                    }}
                  >
                    <img
                      src="/asset/search-icon.svg"
                      alt="search"
                      style={{
                        width: isMobile ? "4vw" : "1vw",
                        height: isMobile ? "4vw" : "1vw"
                      }}
                    />
                    <Input
                      placeholder="Search country..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        border: "none",
                        boxShadow: "none",
                        fontSize: isMobile ? "3.5vw" : "1vw",
                        padding: 0
                      }}
                    />
                  </div>
                  <Separator type={"dashed"} />
                  <ScrollArea
                    style={{
                      height: isMobile ? "50vh" : "17.857vw"
                    }}
                  >
                    <SelectGroup>
                      {filteredCountries.map((country) => (
                        <SelectItem
                          key={country.code}
                          value={country.code}
                          className="flex justify-between"
                          style={{
                            padding: isMobile ? "2.5vw 3vw" : "0.571vw 0.857vw",
                            width: "100%",
                            fontSize: isMobile ? "3.5vw" : "1vw"
                          }}
                        >
                          <div>
                            {country.flagEmoji}{" "}{country.name}
                          </div>
                          <div
                            className="text-muted-foreground ml-auto"
                            style={{
                              fontSize: isMobile ? "3vw" : "0.857vw"
                            }}
                          >
                            {country.dialCode}
                          </div>
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
                style={{
                  padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw",
                  fontSize: isMobile ? "3.5vw" : "1vw"
                }}
                onChange={(e) => {
                  // Format input sesuai country format
                  const value = e.target.value.replace(/\D/g, '')
                  field.onChange(value)
                }}
              />
            </div>
          </FormControl>
          <FormMessage
            style={{
              fontSize: isMobile ? "3vw" : "0.7vw"
            }}
          />
        </FormItem>
      )}
    />
  )
}