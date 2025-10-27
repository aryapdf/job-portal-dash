"use client"

import { useEffect, useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import {useParams, useRouter, useSearchParams} from "next/navigation"
import {applyJob, getJobDetail} from "@/lib/services/jobService"
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay"
import CameraDialog from "@/components/Dialog/CameraDialog";
import {PhoneNumberInput} from "@/components/Input/PhoneNumberInput";
import {toast} from "sonner";

// Helper untuk bikin rule Zod berdasarkan jobDetail
const buildSchema = (req: any) => {
  return z.object({
    jobId: z.string(),
    fullName: req.fullNameReq === "mandatory"
      ? z.string().min(3, "Nama lengkap minimal 3 karakter")
      : z.string().optional(),

    dateOfBirth: req.dateOfBirthReq === "mandatory"
      ? z.date({ required_error: "Tanggal lahir harus diisi" })
      : z.date().optional(),

    gender: req.genderReq === "mandatory"
      ? z.enum(["female", "male"], { required_error: "Pilih jenis kelamin" })
      : z.enum(["female", "male"]).optional(),

    domicile: req.domicileReq === "mandatory"
      ? z.string().min(2, "Domicile wajib diisi")
      : z.string().optional(),

    phoneNumber: req.phoneNumberReq === "mandatory"
      ? z.string().min(10, "Nomor HP tidak valid")
      : z.string().optional(),

    email: req.emailReq === "mandatory"
      ? z.string().email("Format email tidak valid")
      : z.string().optional(),

    linkedin: req.linkedinReq === "mandatory"
      ? z.string().url("Masukkan URL LinkedIn yang valid")
      : z.string().optional(),

    photo: z.any().optional(),
  })
}

export default function Page() {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [showCamera, setShowCamera] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [calendarOpen, setCalendarOpen] = useState<any>(false)
  const [jobDetail, setJobDetail] = useState<any>(null)

  const jobId: any = params.id
  const jobTitle = searchParams.get("job_title")
  const company = searchParams.get("company")

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const fetched = await getJobDetail(jobId)
      if (fetched) {
        setJobDetail(fetched)
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const schema = useMemo(() => buildSchema(jobDetail || {}), [jobDetail])
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      jobId,
      fullName: "",
      gender: "female",
      domicile: "",
      phoneNumber: "",
      email: "",
      linkedin: "",
    },
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleCameraCapture = (file: File, previewUrl: string) => {
    setPhoto(file)
    setPhotoPreview(previewUrl)
    setShowCamera(false)
  }

  const uploadPhoto = async (file: File) => {
    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch("/api/upload-photo", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    const data = await res.json();
    return data.url;
  }

  const onSubmit = async (values: any) => {
    try {
      setLoading(true)
      let photoUrl = null
      if (photo) {
        photoUrl = await uploadPhoto(photo);
      }

      const payload = {
        ...values,
        photo: photoUrl,
      };

      const result = await applyJob(payload.jobId, payload );
      toast.success("Successfully apply job!", {
        description: "Good luck!",
      })
      router.push("/user")
      console.log("Form submitted:", payload);
    } catch (error:any) {
      console.error(error.message);
    } finally {
      setLoading(false)
    }

    console.log("Form submitted:", values)
  }

  if (loading) return <LoadingOverlay isLoading={true} />

  if (!jobDetail) return (
    <div className="flex justify-center items-center h-screen">
      <p>Job detail not found.</p>
    </div>
  )

  const renderIf = (key: string) => jobDetail[key] !== "off"
  const isRequired = (key: string) => jobDetail[key] === "mandatory"

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Card style={{ width: "700px", padding: "40px", borderRadius: "unset" }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center" style={{gap: "16px"}}>
            <Button
              onClick={() => {router.push("/user")}}
              className="flex items-center justify-center border-1 cursor-pointer"
              style={{
                background: "transparent",
                padding: "4px"
              }}
            >
              <img
                src="/asset/arrow-left.svg" alt=""
                className={"w-full h-full object-contain"}
                style={{ width: "20px", height: "20px"}}
              />
            </Button>
            <div className="font-bold" style={{color: "rgba(29, 31, 32, 1)"}}>
              Apply {jobTitle} at {company}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-blue-600">ℹ️</span> This field required to fill
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6">

            {/* Photo */}
            {renderIf("photoProfileReq") && (
              <div className="flex flex-col gap-3 w-fit h-fit">
                {photoPreview ? (
                  <img
                    src={photoPreview} alt="Preview" className="rounded-lg object-cover border"
                    style={{width: "128px", height: "128px"}}
                  />
                ) : (
                  <div
                    className="rounded-lg bg-gray-100 border flex items-center justify-center text-gray-400 text-sm"
                    style={{width: "128px", height: "128px"}}
                  >
                    No Photo
                  </div>
                )}
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  <Button
                    variant="outline"
                    type="button" size="sm"
                    className="flex items-center gap-2"
                    style={{padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw",}}
                    onClick={() => setShowCamera(true)}
                  >
                    <Upload className="w-4 h-4" /> Take a Picture
                  </Button>
                </label>
              </div>
            )}

            {/* Full Name */}
            {renderIf("fullNameReq") && (
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Full name {isRequired("fullNameReq") && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl><Input
                      placeholder="Budi Yanto" {...field}
                      style={{padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw",}}
                    /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Date of Birth */}
            {renderIf("dateOfBirthReq") && (
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Date of birth {isRequired("dateOfBirthReq") && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
                            style={{padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw"}}
                          >
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            {field.value ? format(field.value, "dd MMMM yyyy") : "Select date"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)
                            setCalendarOpen(false) // Tutup popover
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Gender */}
            {renderIf("genderReq") && (
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Pronoun (gender) {isRequired("genderReq") && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-8">
                        <FormItem className="flex items-center space-x-2">
                          <RadioGroupItem value="female" />
                          <FormLabel className="font-normal text-gray-700">She/her (Female)</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <RadioGroupItem value="male" />
                          <FormLabel className="font-normal text-gray-700">He/him (Male)</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Domicile */}
            {renderIf("domicileReq") && (
              <FormField
                control={form.control}
                name="domicile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Domicile {isRequired("domicileReq") && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Kota Jakarta Barat - DKI Jakarta" {...field}
                        style={{padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw",}}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Phone */}
            {renderIf("phoneNumberReq") && (
              <PhoneNumberInput control={form.control} isMobile={isMobile} isRequired={isRequired("phoneNumberReq")} />
            )}

            {/* Email */}
            {renderIf("emailReq") && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email {isRequired("emailReq") && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email" placeholder="your@email.com" {...field}
                        style={{padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw",}}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* LinkedIn */}
            {renderIf("linkedinReq") && (
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      LinkedIn {isRequired("linkedinReq") && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/username" {...field}
                        style={{padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw",}}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full h-11 text-base font-semibold bg-teal-600 hover:bg-teal-700">
              Submit
            </Button>
          </form>
        </Form>
      </Card>

      <CameraDialog open={showCamera} onClose={() => setShowCamera(false)} onCapture={handleCameraCapture} />
    </div>
  )
}
