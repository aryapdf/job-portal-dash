"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void // ✅ accept the new state
}

export default function JobFormDialog(props: Props) {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"

  const jobTypes:any = [
    { name: "Full-time", value: "full_time"},
    { name: "Contract", value: "contract"},
    { name: "Part-time", value: "part_time"},
    { name: "Internship", value: "internship"},
    { name: "Freelance", value: "freelance"},
  ]

  const formSchema = z.object({
    jobName: z.string(),
    jobType: z.string(),
    jobDescription: z.string(),
    candidateNumber: z.number(),
    minSalary: z.number(),
    maxSalary: z.number(),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobName: "",
      jobType: "",
      jobDescription: "",
      candidateNumber: 1,
      minSalary: 0,
      maxSalary: 0,

    }
  })
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent
        className=" rounded-xl overflow-hidden"
        showCloseButton={false}
        style={{
          gap: 0,
          maxWidth: "900px",
          maxHeight: "780px",
          overflowY: "scroll",
      }}
      >
        <DialogTitle
          className={"flex items-center justify-between"}
          style={{padding: "24px", backgroundColor: "rgba(255, 255, 255, 1)", borderBottom: "1px solid rgba(224, 224, 224, 1)"}}>
          <div>Job Form</div>
          <Button
            onClick={() => props.onOpenChange(false)}
            className="flex items-center justify-center relative"
            style={{ width: "24px", height: "24px", background: "transparent" }}
          >
            <img src="/asset/close-icon.svg" alt="" className={"w-full h-full object-contain"}/>
          </Button>
        </DialogTitle>
        <div
          className="flex flex-col items-center justify-center overflow-hidden"
          style={{
            padding: "16px 24px 24px"
          }}
        >
          <Form {...form}>
            <form
              className={"relative flex flex-col w-full"}
              style={{gap: "4px" }}
            >
              <FormField
                name={"jobName"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-slate-700 font-medium"
                      style={{ fontSize: isMobile ? "3.5vw" : "0.857vw", gap: 0 }}
                      aria-required={true}
                    >
                      Job Name<span style={{color: "rgba(225, 20, 40, 1)"}}>*</span>
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

              <FormField
                name={"jobType"}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel
                      className="text-slate-700 font-medium"
                      style={{ fontSize: isMobile ? "3.5vw" : "0.857vw", gap: 0 }}
                      aria-required={true}
                    >
                      Job Type<span style={{color: "rgba(225, 20, 40, 1)"}}>*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="select-job-type"
                          aria-invalid={fieldState.invalid}
                          className="w-full border-slate-300 transition-all"
                          style={{
                            padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                            fontSize: isMobile ? "3.5vw" : "0.857vw",
                          }}
                        >
                          <SelectValue placeholder="Select">

                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {jobTypes.map((type:any) => (
                              <SelectItem
                                value={type.value} key={type.value}
                                className={"font-bold"}
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

              <FormField
                name={"jobDescription"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-slate-700 font-medium"
                      style={{ fontSize: isMobile ? "3.5vw" : "0.857vw", gap: 0 }}
                      aria-required={true}
                    >
                      Job Description<span style={{color: "rgba(225, 20, 40, 1)"}}>*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        id="jobDescription"
                        {...field}
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all resize-none overflow-hidden"
                        rows={3}
                        style={{
                          padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                          fontSize: isMobile ? "3.5vw" : "0.857vw",
                        }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto'; // Reset height
                          target.style.height = `${target.scrollHeight}px`; // Set to scroll height
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
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
