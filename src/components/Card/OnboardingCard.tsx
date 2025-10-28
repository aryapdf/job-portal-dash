"use client"

import {useEffect, useState} from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay"
import SocialButton from "@/components/Button/SocialButton"
import Separator from "@/components/Separator/Separator"
import {checkEmailExists, loginUserUsingPassword, sendMagicLink} from "@/lib/firebaseAuth"
import { useRouter } from "next/navigation"
import { setUser } from "@/store/userSlice"

// schemas
const loginSchema = z.object({
  email: z.string().min(1, "Email tidak boleh kosong").email("Format email tidak valid"),
  password: z.string().min(1, "Password tidak boleh kosong"),
})

const emailOnlySchema = z.object({
  email: z.string().min(1, "Email tidak boleh kosong").email("Format email tidak valid"),
})

const registerSchema = z.object({
  email: z.string().min(1, "Email tidak boleh kosong").email("Format email tidak valid"),
})

type LoginFormValues = z.infer<typeof loginSchema>
type EmailOnlyFormValues = z.infer<typeof emailOnlySchema>
type RegisterFormValues = z.infer<typeof registerSchema>

export default function OnboardingCard() {
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"
  const dispatch = useDispatch()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState<"register" | "email_sent" | "login">("login")
  const [passwordMode, setPasswordMode] = useState(false)
  const [emailState, setEmailState] = useState("")

  const form = useForm<{ email: string; password?: string }>({
    resolver: zodResolver(passwordMode ? loginSchema : emailOnlySchema),
    defaultValues: { email: "", password: "" },
  })

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "" },
  })

  useEffect(() => {
    form.reset()
    registerForm.reset()
  }, [status, form, registerForm])

  const handleLogin = async (data: LoginFormValues) => {
    setLoading(true)
    setError("")
    try {
      const checkEmail = await checkEmailExists(data.email)
      if (!checkEmail.exists) {
        setError("Email ini belum terdaftar sebagai akun di Rakamin Academy.")
        return
      }
      if (passwordMode) {
        const user = await loginUserUsingPassword(data.email, data.password)
        const role = data.email === "admin@gmail.com" ? "admin" : "user"
        dispatch(setUser({ uid: user.uid, email: user.email, role }))
        router.push(role === "admin" ? "/admin" : "/user")
      } else {
        await sendMagicLink(data.email)
        setStatus("email_sent")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (data: RegisterFormValues) => {
    setLoading(true)
    setError("")
    setEmailState(data.email)
    try {
      await sendMagicLink(data.email)
      setStatus("email_sent")
    } catch (error: any) {
      setError(error.message || "Gagal mendaftar")
    } finally {
      setLoading(false)
    }
  }

  const Logo = () => (
    <img
      src="/asset/rakamin-logo.png"
      alt="logo"
      className="absolute left-0 object-contain"
      style={{
        top: isMobile ? "-10.556vw" : "-5.292vw",
        width: isMobile ? "20vw" : "10.344vw",
      }}
    />
  )

  const ErrorMessage = () => {
    if (!error) return null
    const baseStyle = { fontSize: isMobile ? "3.472vw" : "0.859vw", marginBottom: isMobile ? "4.167vw" : "1vw" }

    if (error.includes("belum terdaftar")) {
      return (
        <div className="text-red-500 text-center p-2 rounded-md bg-red-50" style={baseStyle}>
          {error}{" "}
          <span className="font-bold cursor-pointer underline" onClick={() => { setStatus("register"); setError("") }}>
            Daftar
          </span>
        </div>
      )
    }

    if (error.includes("sudah terdaftar")) {
      return (
        <div className="text-red-500 text-center p-2 rounded-md bg-red-50" style={baseStyle}>
          {error}{" "}
          <span className="font-bold cursor-pointer underline" onClick={() => { setStatus("login"); setError("") }}>
            Masuk
          </span>
        </div>
      )
    }

    return <div className="text-red-500 text-center p-2 rounded-md bg-red-50" style={baseStyle}>{error}</div>
  }

  function renderLogin() {
    const currentForm: any = form
    const onSubmit = status === "login" ? handleLogin : handleRegister
    return (
      <>
        <Logo />
        <CardHeader className="text-left p-0 gap-0">
          <CardTitle style={{ marginBottom: isMobile ? "3.75vw" : "1.143vw", fontSize: isMobile ? "5vw" : "1.427vw" }} className="font-bold text-slate-900">
            Masuk ke Rakamin
          </CardTitle>
          <div style={{ fontSize: isMobile ? "3.472vw" : "0.973vw" }} className="text-left text-slate-600 mt-2">
            Belum punya akun?{" "}
            <span style={{ color: "rgba(1, 149, 159, 1)" }} className="font-medium hover:underline cursor-pointer transition-colors" onClick={() => { setStatus("register"); setError("") }}>
              Daftar menggunakan email
            </span>
          </div>
        </CardHeader>

        <CardContent className="grid p-0" style={{ gap: isMobile ? "6vw" : "1.146vw" }}>
          <ErrorMessage />
          <Form {...currentForm}>
            <form onSubmit={currentForm.handleSubmit(onSubmit)} className="grid" style={{ gap: isMobile ? "6vw" : "1.146vw" }}>
              <FormField control={currentForm.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ fontSize: isMobile ? "3.472vw" : "0.857vw" }} className="text-slate-700 font-medium">Alamat email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" style={{ padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw", height: isMobile ? "12vw" : "2.854vw", fontSize: isMobile ? "3.472vw" : "0.857vw" }} className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all" />
                  </FormControl>
                  <FormMessage style={{ fontSize: isMobile ? "3vw" : "0.7vw", marginTop: isMobile ? "1vw" : "0.312vw" }} className="text-red-500" />
                </FormItem>
              )} />

              {passwordMode && (
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ fontSize: isMobile ? "3.472vw" : "0.857vw" }} className="text-slate-700 font-medium">Kata sandi</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" style={{ padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw", height: isMobile ? "12vw" : "2.854vw", fontSize: isMobile ? "3.472vw" : "0.857vw" }} className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all" />
                    </FormControl>
                    <FormMessage style={{ fontSize: isMobile ? "3vw" : "0.7vw", marginTop: isMobile ? "1vw" : "0.312vw" }} className="text-red-500" />
                  </FormItem>
                )} />
              )}

              <Button type="submit" disabled={loading} className="w-full font-bold transition-colors shadow-md hover:shadow-lg" style={{ background: "rgba(251, 192, 55, 1)", color: "rgba(64, 64, 64, 1)", fontSize: isMobile ? "4vw" : "1.146vw", height: isMobile ? "12vw" : "2.854vw" }}>
                {passwordMode ? "Masuk" : "Kirim link login"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col p-0" style={{ gap: isMobile ? "6vw" : "1.146vw" }}>
          <Separator type="or" />
          <SocialButton icon={passwordMode ? "/asset/mail-icon.svg" : "/asset/key-icon.svg"} text={passwordMode ? "Kirim link login melalui email" : "Masuk dengan kata sandi"} onClick={() => { setPasswordMode(prev => !prev); setError("") }} />
        </CardFooter>
      </>
    )
  }

  function renderRegister() {
    return (
      <>
        <Logo />
        <CardHeader className="text-left p-0 gap-0">
          <CardTitle style={{ marginBottom: isMobile ? "3.75vw" : "1.143vw", fontSize: isMobile ? "5vw" : "1.427vw" }} className="font-bold text-slate-900">
            Bergabung dengan Rakamin
          </CardTitle>
          <div style={{ fontSize: isMobile ? "3.472vw" : "0.973vw" }} className="text-left text-slate-600 mt-2">
            Sudah punya akun?{" "}
            <span style={{ color: "rgba(1, 149, 159, 1)" }} className="font-medium hover:underline cursor-pointer transition-colors" onClick={() => { setStatus("login"); setError("") }}>
              Masuk
            </span>
          </div>
        </CardHeader>

        <CardContent className="grid p-0" style={{ gap: isMobile ? "6vw" : "3vw" }}>
          <ErrorMessage />
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="flex flex-col" style={{ gap: isMobile ? "6vw" : "1.146vw" }}>
              <FormField control={registerForm.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel style={{ fontSize: isMobile ? "3.472vw" : "0.857vw" }} className="text-slate-700 font-medium">Alamat email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" style={{ padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw", fontSize: isMobile ? "3.472vw" : "0.857vw" }} className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all" />
                  </FormControl>
                  <FormMessage style={{ fontSize: isMobile ? "3vw" : "0.7vw", marginTop: isMobile ? "1vw" : "0.312vw" }} className="text-red-500" />
                </FormItem>
              )} />

              <Button type="submit" disabled={loading} className="w-full font-bold transition-colors shadow-md hover:shadow-lg mt-4" style={{ background: "rgba(251, 192, 55, 1)", color: "rgba(64, 64, 64, 1)", fontSize: isMobile ? "4vw" : "1.146vw", height: isMobile ? "12vw" : "2.854vw" }}>
                Daftar dengan email
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col p-0">
          <div className="relative w-full" style={{ marginBlock: isMobile ? "4vw" : "1vw" }}>
            <Separator type="or" />
          </div>
          <SocialButton icon="/asset/google-icon.svg" text="Daftar dengan Google" />
        </CardFooter>
      </>
    )
  }

  function renderEmailSent() {
    return (
      <>
        <CardHeader className="text-center p-0 gap-0">
          <CardTitle style={{ marginBottom: isMobile ? "3vw" : "1.143vw", fontSize: isMobile ? "4vw" : "1.714vw" }} className="font-semibold text-neutral-900">
            Periksa Email Anda
          </CardTitle>
          <CardDescription style={{ color: "rgba(76, 76, 76, 1)", marginBottom: isMobile ? "3vw" : "1.143vw", fontSize: isMobile ? "3.472vw" : "0.857vw" }}>
            Kami sudah mengirimkan link register ke <span className="font-bold">{emailState}</span> yang berlaku dalam <span className="font-bold">30 menit</span>.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <img
            src="/asset/email-sent.png"
            alt="email_sent"
            className="relative mx-auto"
            style={{
              width: isMobile ? "40vw" : "13.143vw",
              height: isMobile ? "40vw" : "13.143vw",
              margin: "auto"
            }}
          />
        </CardContent>
      </>
    )
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100" style={{ padding: isMobile ? "8vw" : "5vw" }}>
      <Card className="w-full shadow-xl border-slate-200 relative rounded-sm" style={{ maxWidth: isMobile ? "90vw" : "35vw", padding: isMobile ? "5vw" : "2.778vw", gap: isMobile ? "3vw" : "1.146vw" }}>
        <LoadingOverlay isLoading={loading} />
        {status === "login" && renderLogin()}
        {status === "register" && renderRegister()}
        {status === "email_sent" && renderEmailSent()}
      </Card>
    </div>
  )
}
