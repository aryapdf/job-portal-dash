"use client"

import {useEffect, useState} from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {useParams, useSearchParams} from "next/navigation";
import {getAllJobs, getJobDetail} from "@/lib/services/jobService";
import {LoadingOverlay} from "@/components/Loading/LoadingOverlay";

const formSchema:any = z.object({
  jobId: z.string(),
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  dateOfBirth: z.date({ required_error: "Tanggal lahir harus diisi" }),
  gender: z.enum(["female", "male"], { required_error: "Pilih jenis kelamin" }),
  domicile: z.string().min(2, "Domicile wajib diisi"),
  phone: z.string().min(10, "Nomor HP tidak valid"),
  email: z.string().email("Format email tidak valid"),
  linkedin: z.string().url("Masukkan URL LinkedIn yang valid"),
  photo: z.any().optional(),
})

export default function Page() {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"
  const params = useParams()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [jobDetail, setJobDetail] = useState()

  const jobId:any = params.id
  const jobTitle = searchParams.get("job_title")
  const company = searchParams.get("company")

  useEffect(() => {
    fetchJobs()
      .then()
  }, []);

  const fetchJobs = async () => {
    try {
      const fetchedJobs = await getJobDetail(jobId);

      if (fetchedJobs) {
        setJobDetail(fetchedJobs)
      }
      console.log(fetchedJobs)
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false)
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobId: jobId,
      fullName: "",
      gender: "female",
      domicile: "",
      phone: "",
      email: "",
      linkedin: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(params)
    console.log("Form submitted:", values)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  return (
    <div className={"w-full h-full flex justify-center items-center"}>
      {loading ? (
        <LoadingOverlay isLoading={loading} />
      ) : (
        <Card style={{ width: "700px", padding: "40px", borderRadius: "unset" }}>
          <div className="flex items-center justify-between mb-6">
            <div className="text-xl font-semibold text-gray-800">Apply {jobTitle} at {company}</div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="text-blue-600">ℹ️</span>
              This field required to fill
            </div>
          </div>

          {/*<Separator className="mb-6" />*/}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col" style={{gap: "16px" }}>
              <div className={"flex flex-col"} style={{ gap: "16px", padding: "0 24px 24px" }}>
                {/* Photo */}
                <div className="flex flex-col gap-3">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-lg object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                      No Photo
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
                      className="text-sm flex items-center gap-2"
                      style={{
                        padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                        fontSize: isMobile ? "3.5vw" : "0.857vw",
                      }}
                    >
                      <Upload className="w-4 h-4" /> Take a Picture
                    </Button>
                  </label>
                </div>

                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Full name<span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Budi Yanto" {...field}
                          style={{
                            padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                            fontSize: isMobile ? "3.5vw" : "0.857vw",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date of Birth */}
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Date of birth<span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              style={{
                                padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                                fontSize: isMobile ? "3.5vw" : "0.857vw",
                              }}
                            >
                              {field.value ? format(field.value, "dd MMMM yyyy") : "Select date"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Pronoun (gender)<span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-8"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">
                              She/her (Female)
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-700">
                              He/him (Male)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Domicile */}
                <FormField
                  control={form.control}
                  name="domicile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Domicile<span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Kota Jakarta Barat - DKI Jakarta" {...field}
                          style={{
                            padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                            fontSize: isMobile ? "3.5vw" : "0.857vw",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Phone number<span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel" placeholder="+62 811xxxxxxxx" {...field}
                          style={{
                            padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                            fontSize: isMobile ? "3.5vw" : "0.857vw",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Email<span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email" placeholder="your@email.com" {...field}
                          style={{
                            padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                            fontSize: isMobile ? "3.5vw" : "0.857vw",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* LinkedIn */}
                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Link LinkedIn<span className="text-red-500 ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/username" {...field}
                          style={{
                            padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                            fontSize: isMobile ? "3.5vw" : "0.857vw",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/*<Separator />*/}

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-teal-600 hover:bg-teal-700 transition-colors"
              >
                Submit
              </Button>
            </form>
          </Form>
        </Card>
      )}
    </div>
  )
}
