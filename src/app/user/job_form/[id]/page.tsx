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
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { applyJob, getRequirementsForm } from "@/lib/services/jobService"
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay"
import CameraDialog from "@/components/Dialog/CameraDialog"
import { PhoneNumberInput } from "@/components/Input/PhoneNumberInput"
import { toast } from "sonner"
import {DomicileInput} from "@/components/Input/DomicileInput";
import CalendarInput from "@/components/Input/CalendarInput";

// Helper untuk bikin rule Zod berdasarkan field
const buildSchema = (fields: any) => {
  return z.object({
    jobId: z.string(),
    fullName: fields.fullNameReq === "mandatory"
      ? z.string().min(3, "Nama lengkap minimal 3 karakter")
      : z.string().optional(),

    dateOfBirth: fields.dateOfBirthReq === "mandatory"
      ? z.date().min(1, "Tanggal lahir harus diisi")
      : z.date().optional(),

    gender: fields.genderReq === "mandatory"
      ? z.enum(["female", "male"])
      : z.enum(["female", "male"]).optional(),

    domicile: fields.domicileReq === "mandatory"
      ? z.string().min(2, "Domicile wajib diisi")
      : z.string().optional(),

    phoneNumber: fields.phoneNumberReq === "mandatory"
      ? z.string().min(10, "Nomor HP tidak valid")
      : z.string().optional(),

    email: fields.emailReq === "mandatory"
      ? z.string().email("Format email tidak valid")
      : z.string().optional(),

    linkedin: fields.linkedinReq === "mandatory"
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
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [jobDetail, setJobDetail] = useState<any>(null)

  const jobId = params.id as string
  const jobTitle = searchParams.get("job_title")
  const company = searchParams.get("company")

  useEffect(() => {
    fetchForm()
  }, [])

  const fetchForm = async () => {
    try {
      const fetched = await getRequirementsForm(jobId)
      if (fetched) {
        setJobDetail(fetched)
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const fields = jobDetail?.fields || {}
  const schema = useMemo(() => buildSchema(fields), [fields])

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

  const handlePhotoChange = (e:any) => {
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

    if (!res.ok) throw new Error("Upload failed")

    const data = await res.json()
    return data.url
  }

  const onSubmit = async (values: any) => {
    try {
      setLoading(true)
      let photoUrl = null
      if (photo) {
        photoUrl = await uploadPhoto(photo)
      }

      const payload = {
        ...values,
        photo: photoUrl,
      }

      await applyJob(payload.jobId, payload)
      toast.success("Successfully applied!", {
        description: "Good luck!",
      })
      router.push("/user")
    } catch (error: any) {
      console.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingOverlay isLoading={true} />
  if (!jobDetail) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Job detail not found.</p>
      </div>
    )
  }

  const renderIf = (key: string) => fields[key] !== undefined
  const isRequired = (key: string) => fields[key] === "mandatory"

  return (
    <div
      className="w-full h-full flex overflow-y-auto"
      style={{
        padding: isMobile ? "4vw" : "2vw"
      }}
    >
      <Card
        style={{
          width: isMobile ? "100%" : "50vw",
          height: "fit-content",
          margin: "auto",
          padding: isMobile ? "5vw" : "2.86vw",
          borderRadius: isMobile ? "3vw" : "0.857vw"
        }}
      >
        {/* Header */}
        <div
          className="flex flex-col items-start"
          style={{
            gap: isMobile ? "3vw" : "0"
          }}
        >
          <div
            className="flex items-center w-full"
            style={{
              gap: isMobile ? "3vw" : "1.14vw",
            }}
          >
            <Button
              onClick={() => {router.push("/user")}}
              className="flex items-center justify-center border-1 cursor-pointer"
              style={{
                background: "transparent",
                padding: isMobile ? "1.5vw" : "0.29vw",
                minWidth: isMobile ? "8vw" : "auto",
                minHeight: isMobile ? "8vw" : "auto"
              }}
            >
              <img
                src="/asset/arrow-left.svg"
                alt=""
                className="w-full h-full object-contain"
                style={{
                  width: isMobile ? "5vw" : "1.43vw",
                  height: isMobile ? "5vw" : "1.43vw"
                }}
              />
            </Button>
            <div
              className="font-bold flex-1"
              style={{
                color: "rgba(29, 31, 32, 1)",
                fontSize: isMobile ? "4.5vw" : "1.25vw",
                lineHeight: isMobile ? "1.3" : "1.5"
              }}
            >
              Apply {jobTitle} at {company}
            </div>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
            style={{
              gap: isMobile ? "5vw" : "1.143vw",
              padding: isMobile ? "0" : "0 1.714vw"
            }}
          >
            {/* Photo */}
            {renderIf("photoProfileReq") && (
              <div
                className="flex flex-col w-fit h-fit"
                style={{gap: isMobile ? "3vw" : "0.857vw"}}
              >
                <div
                  style={{
                    fontSize: isMobile ? "3.5vw" : "1vw",
                    fontWeight: "500"
                  }}
                >
                  Photo Profile {isRequired("photoProfileReq") && <span className="text-red-500">*</span>}
                </div>
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="rounded-lg object-cover border"
                    style={{
                      width: isMobile ? "32vw" : "9.14vw",
                      height: isMobile ? "32vw" : "9.14vw"
                    }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: isMobile ? "32vw" : "9.14vw",
                      height: isMobile ? "32vw" : "9.14vw"
                    }}
                  >
                    <img
                      src="/asset/photo-placeholder.svg"
                      alt="photo placeholder"
                      className="relative w-full h-full"
                    />
                  </div>
                )}
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <Button
                    variant="outline"
                    type="button"
                    size="sm"
                    className="flex items-center"
                    style={{
                      padding: isMobile ? "3vw 4vw" : "1.41vw 1.143vw",
                      fontSize: isMobile ? "3.5vw" : "1vw",
                      gap: isMobile ? "2vw" : "0.571vw"
                    }}
                    onClick={() => setShowCamera(true)}
                  >
                    <Upload
                      style={{
                        width: isMobile ? "4vw" : "1.143vw",
                        height: isMobile ? "4vw" : "1.143vw"
                      }}
                    />
                    Take a Picture
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
                    <FormLabel
                      style={{
                        fontSize: isMobile ? "3.5vw" : "1vw"
                      }}
                    >
                      Full name {isRequired("fullNameReq") && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Budi Yanto"
                        {...field}
                        style={{
                          padding: isMobile ? "3.5vw 4vw" : "1.41vw 1.143vw",
                          fontSize: isMobile ? "3.5vw" : "1vw"
                        }}
                      />
                    </FormControl>
                    <FormMessage style={{fontSize: isMobile ? "3vw" : "0.857vw"}} />
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
                    <FormLabel
                      style={{
                        fontSize: isMobile ? "3.5vw" : "1vw"
                      }}
                    >
                      Date of birth {isRequired("dateOfBirthReq") && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <CalendarInput
                      value={field.value}
                      onChange={(date) => {
                        console.log('date is :', date)
                        field.onChange(date)
                        setCalendarOpen(false)
                      }}
                    />
                    <FormMessage style={{fontSize: isMobile ? "3vw" : "0.857vw"}} />
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
                    <FormLabel
                      style={{
                        fontSize: isMobile ? "3.5vw" : "1vw",
                        marginBottom: isMobile ? "2vw" : "0.5vw"
                      }}
                    >
                      Pronoun (gender) {isRequired("genderReq") && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex"
                        style={{
                          gap: isMobile ? "5vw" : "2.286vw",
                          flexDirection: isMobile ? "column" : "row",
                        }}
                      >
                        <FormItem
                          className="flex items-center"
                          style={{gap: isMobile ? "2vw" : "0.571vw"}}
                        >
                          <RadioGroupItem value="female" style={{color: "green"}} />
                          <FormLabel
                            className="font-normal text-gray-700"
                            style={{fontSize: isMobile ? "3.5vw" : "1vw"}}
                          >
                            She/her (Female)
                          </FormLabel>
                        </FormItem>
                        <FormItem
                          className="flex items-center"
                          style={{gap: isMobile ? "2vw" : "0.571vw"}}
                        >
                          <RadioGroupItem value="male" />
                          <FormLabel
                            className="font-normal text-gray-700"
                            style={{fontSize: isMobile ? "3.5vw" : "1vw"}}
                          >
                            He/him (Male)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage style={{fontSize: isMobile ? "3vw" : "0.857vw"}} />
                  </FormItem>
                )}
              />
            )}

            {/* Domicile */}
            {renderIf("domicileReq") && (
              <DomicileInput
                control={form.control}
                isRequired={isRequired("domicileReq")}
              />
            )}

            {/* Phone */}
            {renderIf("phoneNumberReq") && (
              <PhoneNumberInput
                control={form.control}
                isMobile={isMobile}
                isRequired={isRequired("phoneNumberReq")}
              />
            )}

            {/* Email */}
            {renderIf("emailReq") && (
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      style={{
                        fontSize: isMobile ? "3.5vw" : "1vw"
                      }}
                    >
                      Email {isRequired("emailReq") && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                        style={{
                          padding: isMobile ? "3.5vw 4vw" : "1.41vw 1.143vw",
                          fontSize: isMobile ? "3.5vw" : "1vw"
                        }}
                      />
                    </FormControl>
                    <FormMessage style={{fontSize: isMobile ? "3vw" : "0.857vw"}} />
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
                    <FormLabel
                      style={{
                        fontSize: isMobile ? "3.5vw" : "1vw"
                      }}
                    >
                      LinkedIn {isRequired("linkedinReq") && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/username"
                        {...field}
                        style={{
                          padding: isMobile ? "3.5vw 4vw" : "1.41vw 1.143vw",
                          fontSize: isMobile ? "3.5vw" : "1vw"
                        }}
                      />
                    </FormControl>
                    <FormMessage style={{fontSize: isMobile ? "3vw" : "0.857vw"}} />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="w-full font-semibold bg-teal-600 hover:bg-teal-700"
              style={{
                height: isMobile ? "12vw" : "3.143vw",
                fontSize: isMobile ? "4vw" : "1.143vw",
                marginTop: isMobile ? "3vw" : "1.143vw"
              }}
            >
              Submit
            </Button>
          </form>
        </Form>
      </Card>

      <CameraDialog
        open={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  )
}