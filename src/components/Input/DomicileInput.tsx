"use client"

import { useEffect, useState } from "react"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import {SearchSelectInput} from "@/components/Input/SearchSelectInput";

interface Props {
  control: any
  isRequired?: boolean
}

interface Province { id: string; name: string }
interface City { id: string; provinceId: string; name: string }
interface District { id: string; cityId: string; name: string }
interface Village { id: string; districtId: string; name: string }

const API_BASE = "https://api-regional-indonesia.vercel.app/api"

export function DomicileInput(props: Props) {
  const isMobile =
    useSelector((state: RootState) => state.screen.deviceType) === "mobile"

  const [provinces, setProvinces] = useState<Province[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [villages, setVillages] = useState<Village[]>([])

  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedVillage, setSelectedVillage] = useState("")

  const [loadingProvinces, setLoadingProvinces] = useState(true)
  const [loadingCities, setLoadingCities] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(false)
  const [loadingVillages, setLoadingVillages] = useState(false)

  // Fetch provinces on mount
  useEffect(() => {
    fetchProvinces()
  }, [])

  const fetchProvinces = async () => {
    try {
      setLoadingProvinces(true)
      const res = await fetch(`${API_BASE}/provinces`)
      const json = await res.json()
      if (json.status) setProvinces(json.data)
    } catch (error) {
      console.error("Error fetching provinces:", error)
    } finally {
      setLoadingProvinces(false)
    }
  }

  const fetchCities = async (provinceId: string) => {
    try {
      setLoadingCities(true)
      setCities([])
      setDistricts([])
      setVillages([])
      setSelectedCity("")
      setSelectedDistrict("")
      setSelectedVillage("")
      const res = await fetch(`${API_BASE}/cities/${provinceId}`)
      const json = await res.json()
      if (json.status) setCities(json.data)
    } catch (error) {
      console.error("Error fetching cities:", error)
    } finally {
      setLoadingCities(false)
    }
  }

  const fetchDistricts = async (cityId: string) => {
    try {
      setLoadingDistricts(true)
      setDistricts([])
      setVillages([])
      setSelectedDistrict("")
      setSelectedVillage("")
      const res = await fetch(`${API_BASE}/districts/${cityId}`)
      const json = await res.json()
      if (json.status) setDistricts(json.data)
    } catch (error) {
      console.error("Error fetching districts:", error)
    } finally {
      setLoadingDistricts(false)
    }
  }

  const fetchVillages = async (districtId: string) => {
    try {
      setLoadingVillages(true)
      setVillages([])
      setSelectedVillage("")
      const res = await fetch(`${API_BASE}/villages/${districtId}`)
      const json = await res.json()
      if (json.status) setVillages(json.data)
    } catch (error) {
      console.error("Error fetching villages:", error)
    } finally {
      setLoadingVillages(false)
    }
  }

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId)
    fetchCities(provinceId)
  }

  const handleCityChange = (cityId: string) => {
    setSelectedCity(cityId)
    fetchDistricts(cityId)
  }

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId)
    fetchVillages(districtId)
  }

  const handleVillageChange = (villageId: string) => {
    setSelectedVillage(villageId)
  }

  // Sync with form
  useEffect(() => {
    const provinceName = provinces.find((p) => p.id === selectedProvince)?.name || ""
    const cityName = cities.find((c) => c.id === selectedCity)?.name || ""
    const districtName = districts.find((d) => d.id === selectedDistrict)?.name || ""
    const villageName = villages.find((v) => v.id === selectedVillage)?.name || ""

    const parts = [villageName, districtName, cityName, provinceName].filter(Boolean)
    props.control._formValues.domicile = parts.join(", ")
  }, [selectedProvince, selectedCity, selectedDistrict, selectedVillage])

  return (
    <FormField
      control={props.control}
      name="domicile"
      render={({ field }) => (
        <FormItem>
          <FormLabel
            style={{ fontSize: isMobile ? "3.5vw" : "1vw" }}
          >
            Domicile {props.isRequired && <span className="text-red-500">*</span>}
          </FormLabel>

          <FormControl>
            <div className="flex flex-col" style={{ gap: isMobile ? "3vw" : "0.857vw" }}>
              <SearchSelectInput
                label="Province"
                items={provinces}
                value={selectedProvince}
                onChange={handleProvinceChange}
                loading={loadingProvinces}
                placeholder="Select Province"
                isMobile={isMobile}
              />
              {selectedProvince && (
                <SearchSelectInput
                  label="City/Regency"
                  items={cities}
                  value={selectedCity}
                  onChange={handleCityChange}
                  loading={loadingCities}
                  placeholder="Select City/Regency"
                  isMobile={isMobile}
                  disabled={cities.length === 0}
                />
              )}
              {selectedCity && (
                <SearchSelectInput
                  label="District"
                  items={districts}
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  loading={loadingDistricts}
                  placeholder="Select District (Optional)"
                  isMobile={isMobile}
                  disabled={districts.length === 0}
                />
              )}
              {selectedDistrict && (
                <SearchSelectInput
                  label="Village"
                  items={villages}
                  value={selectedVillage}
                  onChange={handleVillageChange}
                  loading={loadingVillages}
                  placeholder="Select Village (Optional)"
                  isMobile={isMobile}
                  disabled={villages.length === 0}
                />
              )}
              <input type="hidden" {...field} />
            </div>
          </FormControl>

          <FormMessage style={{ fontSize: isMobile ? "3vw" : "0.857vw" }} />
        </FormItem>
      )}
    />
  )
}
