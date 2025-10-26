"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Separator from "@/components/Separator/Separator"
import { useRef } from "react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ToggleOption {
  value: string
  label: string
  toggle: boolean
}

interface ToggleFieldProps {
  control: any
  name: string
  label: string
  options: ToggleOption[]
  isMobile?: boolean
}

const JOB_TYPES = [
  { name: "Full-time", value: "full_time" },
  { name: "Contract", value: "contract" },
  { name: "Part-time", value: "part_time" },
  { name: "Internship", value: "internship" },
  { name: "Freelance", value: "freelance" },
]

const REQUIREMENT_FIELDS = [
  {
    name: "fullNameReq",
    label: "Full Name",
    options: [
      { value: "mandatory", label: "Mandatory", toggle: true },
      { value: "optional", label: "Optional", toggle: false },
      { value: "off", label: "Off", toggle: false }
    ]
  },
  {
    name: "photoProfileReq",
    label: "Photo Profile",
    options: [
      { value: "mandatory", label: "Mandatory", toggle: true },
      { value: "optional", label: "Optional", toggle: false },
      { value: "off", label: "Off", toggle: false }
    ]
  },
  {
    name: "genderReq",
    label: "Gender",
    options: [
      { value: "mandatory", label: "Mandatory", toggle: true },
      { value: "optional", label: "Optional", toggle: true },
      { value: "off", label: "Off", toggle: true }
    ]
  },
  {
    name: "domicileReq",
    label: "Domicile",
    options: [
      { value: "mandatory", label: "Mandatory", toggle: true },
      { value: "optional", label: "Optional", toggle: true },
      { value: "off", label: "Off", toggle: true }
    ]
  },
  {
    name: "emailReq",
    label: "Email",
    options: [
      { value: "mandatory", label: "Mandatory", toggle: true },
      { value: "optional", label: "Optional", toggle: false },
      { value: "off", label: "Off", toggle: false }
    ]
  },
  {
    name: "phoneNumberReq",
    label: "Phone Number",
    options: [
      { value: "mandatory", label: "Mandatory", toggle: true },
      { value: "optional", label: "Optional", toggle: true },
      { value: "off", label: "Off", toggle: true }
    ]
  },
  {
    name: "linkedinReq",
    label: "LinkedIn",
    options: [
      { value: "mandatory", label: "Mandatory", toggle: true },
      { value: "optional", label: "Optional", toggle: true },
      { value: "off", label: "Off", toggle: true }
    ]
  },
  {
    name: "dateOfBirthReq",
    label: "Date of Birth",
    options: [
      { value: "mandatory", label: "Mandatory", toggle: true },
      { value: "optional", label: "Optional", toggle: true },
      { value: "off", label: "Off", toggle: true }
    ]
  },
]

export default function JobFormDialog(props: Props) {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // TODO: Make this modal responsive
  const formSchema:any = z.object({
    jobName: z.string().min(1, "Job name is required"),
    jobType: z.string().min(1, "Job type is required"),
    jobDescription: z.string().min(1, "Job description is required"),
    candidateNumber: z.coerce
      .number()
      .min(1, "At least 1 candidate needed")
      .positive("Must be a positive number"),

    // Requirement fields with enum validation
    fullNameReq: z.enum(["mandatory", "optional", "off"]),
    photoProfileReq: z.enum(["mandatory", "optional", "off"]),
    genderReq: z.enum(["mandatory", "optional", "off"]),
    domicileReq: z.enum(["mandatory", "optional", "off"]),
    emailReq: z.enum(["mandatory", "optional", "off"]),
    phoneNumberReq: z.enum(["mandatory", "optional", "off"]),
    linkedinReq: z.enum(["mandatory", "optional", "off"]),
    dateOfBirthReq: z.enum(["mandatory", "optional", "off"]),

    minSalary: z.coerce
      .number()
      .min(0, "Minimum salary cannot be negative"),
    maxSalary: z.coerce
      .number()
      .min(0, "Maximum salary cannot be negative"),
  }).refine((data) => data.maxSalary >= data.minSalary, {
    message: "Maximum salary must be greater than or equal to minimum salary",
    path: ["maxSalary"],
  })

  const defaultValues:any = {
    jobName: "",
    jobType: "",
    jobDescription: "",
    candidateNumber: 1,
    fullNameReq: "mandatory",
    photoProfileReq: "mandatory",
    genderReq: "mandatory",
    domicileReq: "mandatory",
    emailReq: "mandatory", // Email is mandatory by default
    phoneNumberReq: "mandatory",
    linkedinReq: "mandatory",
    dateOfBirthReq: "mandatory",
    minSalary: 0,
    maxSalary: 0,
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const handleTextareaResize = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  const formatCurrency = (value: number | string) => {
    if (!value && value !== 0) return ''
    const stringValue = value.toString()
    return stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    onChange(value ? parseInt(value) : 0)
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
    // TODO: Add your submit logic here
    props.onOpenChange(false)
  }

  const RequiredAsterisk = () => (
    <span style={{ color: "rgba(225, 20, 40, 1)" }}>*</span>
  )

  function RequirementToggleField({ control, name, label, options, isMobile = false }: ToggleFieldProps) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="flex w-full justify-between items-center">
            <FormLabel
              className="text-slate-700 font-medium"
              style={{ fontSize: isMobile ? "3.5vw" : "0.857vw" }}
            >
              {label}
            </FormLabel>
            <FormControl>
              <ToggleGroup
                type="single"
                variant="outline"
                value={field.value}
                onValueChange={field.onChange}
                spacing={4}
              >
                {options.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    aria-label={`Toggle ${option.value}`}
                    disabled={!option.toggle} // ✅ Disabled based on toggle property
                    className="data-[state=on]:border-cyan-500 data-[state=on]:text-cyan-500 data-[state=on]:bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      borderRadius: '1000px',
                      padding: "8px 16px",
                      fontSize: isMobile ? "3vw" : "0.857vw"
                    }}
                  >
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FormControl>
          </FormItem>
        )}
      />
    )
  }

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent
        className="rounded-xl overflow-hidden"
        showCloseButton={false}
        style={{
          gap: 0,
          maxWidth: "900px",
          maxHeight: "780px",
          overflowY: "scroll",
        }}
      >
        {/* Header */}
        <DialogTitle
          className="flex items-center justify-between"
          style={{
            padding: "24px",
            backgroundColor: "rgba(255, 255, 255, 1)",
            borderBottom: "1px solid rgba(224, 224, 224, 1)"
          }}
        >
          <div>Job Form</div>
          <Button
            onClick={() => props.onOpenChange(false)}
            className="flex items-center justify-center relative"
            style={{ width: "24px", height: "24px", background: "transparent" }}
          >
            <img src="/asset/close-icon.svg" alt="Close" className="w-full h-full object-contain" />
          </Button>
        </DialogTitle>

        {/* Form Content */}
        <div
          className="flex flex-col items-center justify-center overflow-hidden"
          style={{ padding: "16px 24px 24px" }}
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative flex flex-col w-full"
              style={{ gap: "16px" }}
            >
              {/* Job Name */}
              <FormField
                control={form.control}
                name="jobName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-slate-700 font-medium"
                      style={{ fontSize: isMobile ? "3.5vw" : "0.857vw" }}
                    >
                      Job Name <RequiredAsterisk />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                        style={{
                          padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                          fontSize: isMobile ? "3.5vw" : "0.857vw",
                        }}
                      />
                    </FormControl>
                    <FormMessage
                      className="text-red-500"
                      style={{
                        fontSize: isMobile ? "3vw" : "0.7vw",
                        marginTop: isMobile ? "1vw" : "0.3vw",
                      }}
                    />
                  </FormItem>
                )}
              />

              {/* Job Type */}
              <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-slate-700 font-medium"
                      style={{ fontSize: isMobile ? "3.5vw" : "0.857vw" }}
                    >
                      Job Type <RequiredAsterisk />
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          className="w-full border-slate-300 transition-all"
                          style={{
                            padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                            fontSize: isMobile ? "3.5vw" : "0.857vw",
                          }}
                        >
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {JOB_TYPES.map((type) => (
                              <SelectItem
                                key={type.value}
                                value={type.value}
                                className="font-bold"
                                style={{
                                  padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                                  fontSize: isMobile ? "3.5vw" : "0.857vw",
                                }}
                              >
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage
                      className="text-red-500"
                      style={{
                        fontSize: isMobile ? "3vw" : "0.7vw",
                        marginTop: isMobile ? "1vw" : "0.3vw",
                      }}
                    />
                  </FormItem>
                )}
              />

              {/* Job Description */}
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-slate-700 font-medium"
                      style={{ fontSize: isMobile ? "3.5vw" : "0.857vw" }}
                    >
                      Job Description <RequiredAsterisk />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        ref={textareaRef}
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all resize-none overflow-hidden"
                        rows={4}
                        style={{
                          padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                          fontSize: isMobile ? "3.5vw" : "0.857vw",
                        }}
                        onInput={handleTextareaResize}
                      />
                    </FormControl>
                    <FormMessage
                      className="text-red-500"
                      style={{
                        fontSize: isMobile ? "3vw" : "0.7vw",
                        marginTop: isMobile ? "1vw" : "0.3vw",
                      }}
                    />
                  </FormItem>
                )}
              />

              {/* Number of Candidates */}
              <FormField
                control={form.control}
                name="candidateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-slate-700 font-medium"
                      style={{ fontSize: isMobile ? "3.5vw" : "0.857vw" }}
                    >
                      Number of Candidates Needed <RequiredAsterisk />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={field.value || ''}
                        onChange={(e) => handleNumberChange(e, field.onChange)}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault()
                          }
                        }}
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all"
                        style={{
                          padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                          fontSize: isMobile ? "3.5vw" : "0.857vw",
                        }}
                      />
                    </FormControl>
                    <FormMessage
                      className="text-red-500"
                      style={{
                        fontSize: isMobile ? "3vw" : "0.7vw",
                        marginTop: isMobile ? "1vw" : "0.3vw",
                      }}
                    />
                  </FormItem>
                )}
              />

              <Separator type="dashed" />

              {/* Salary Range */}
              <div className="flex w-full" style={{ gap: "16px" }}>
                {/* Minimum Salary */}
                <FormField
                  control={form.control}
                  name="minSalary"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel
                        className="text-slate-700 font-medium"
                        style={{ fontSize: isMobile ? "3.5vw" : "0.857vw" }}
                      >
                        Minimum Estimated Salary
                      </FormLabel>
                      <FormControl>
                        <div
                          className="flex w-full items-center rounded-md"
                          style={{
                            padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw",
                            border: "1px solid rgba(237, 237, 237, 1)",
                          }}
                        >
                          <span
                            className="font-bold"
                            style={{ fontSize: isMobile ? "3.5vw" : "0.857vw" }}
                          >
                            Rp{" "}
                          </span>
                          <Input
                            type="text"
                            placeholder="0"
                            value={formatCurrency(field.value)}
                            onChange={(e) => handleNumberChange(e, field.onChange)}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault()
                              }
                            }}
                            className="rounded-sm h-fit"
                            style={{
                              width: "100%",
                              border: "none",
                              outline: "none",
                              boxShadow: "none",
                              fontSize: isMobile ? "3.5vw" : "0.857vw",
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage
                        className="text-red-500"
                        style={{
                          fontSize: isMobile ? "3vw" : "0.7vw",
                          marginTop: isMobile ? "1vw" : "0.3vw",
                        }}
                      />
                    </FormItem>
                  )}
                />

                {/* Maximum Salary */}
                <FormField
                  control={form.control}
                  name="maxSalary"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel
                        className="text-slate-700 font-medium"
                        style={{ fontSize: isMobile ? "3.5vw" : "0.857vw" }}
                      >
                        Maximum Estimated Salary
                      </FormLabel>
                      <FormControl>
                        <div
                          className="flex w-full items-center rounded-md"
                          style={{
                            padding: isMobile ? "3vw 4vw" : "0.714vw 1.143vw",
                            border: "1px solid rgba(237, 237, 237, 1)",
                          }}
                        >
                          <span
                            className="font-bold"
                            style={{ fontSize: isMobile ? "3.5vw" : "0.857vw" }}
                          >
                            Rp{" "}
                          </span>
                          <Input
                            type="text"
                            placeholder="0"
                            value={formatCurrency(field.value)}
                            onChange={(e) => handleNumberChange(e, field.onChange)}
                            onKeyPress={(e) => {
                              if (!/[0-9]/.test(e.key)) {
                                e.preventDefault()
                              }
                            }}
                            className="rounded-sm h-fit"
                            style={{
                              width: "100%",
                              border: "none",
                              outline: "none",
                              boxShadow: "none",
                              fontSize: isMobile ? "3.5vw" : "0.857vw",
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage
                        className="text-red-500"
                        style={{
                          fontSize: isMobile ? "3vw" : "0.7vw",
                          marginTop: isMobile ? "1vw" : "0.3vw",
                        }}
                      />
                    </FormItem>
                  )}
                />
              </div>

              <Card style={{ width: "100%", padding: "16px", gap: "16px" }}>
                <CardHeader>
                  <CardTitle>
                    Minimum Profile Information Required
                  </CardTitle>
                </CardHeader>

                <CardContent className={"flex flex-col"} style={{gap: "16px"}}>
                  {REQUIREMENT_FIELDS.map((field, index) => (
                    <>
                      <RequirementToggleField
                        key={field.name}
                        control={form.control}
                        name={field.name}
                        label={field.label}
                        options={field.options}
                        isMobile={isMobile}
                      />
                    </>
                  ))}
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end" style={{ marginTop: "16px" }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => props.onOpenChange(false)}
                  style={{
                    fontSize: isMobile ? "3.5vw" : "0.857vw",
                    padding: isMobile ? "2.5vw 5vw" : "0.556vw 1.5vw",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="font-bold"
                  style={{
                    background: "rgba(251, 192, 55, 1)",
                    color: "rgba(64, 64, 64, 1)",
                    fontSize: isMobile ? "3.5vw" : "0.857vw",
                    padding: isMobile ? "2.5vw 5vw" : "0.556vw 1.5vw",
                  }}
                >
                  Publish Job
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}