"use client"

import { useState } from "react"
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
import { loginUserUsingPassword } from "@/lib/firebaseAuth"
import { useRouter } from "next/navigation"
import { setUser } from "@/store/userSlice"

// ============================================
// SCHEMAS - Static, tidak berubah saat render
// ============================================
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
  const [passwordMode, setPasswordMode] = useState(true)
  const [emailState, setEmailState] = useState("")

  // Form untuk login dengan password
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  // Form untuk email only (kirim link)
  const emailForm = useForm<EmailOnlyFormValues>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: { email: "" },
  })

  // Form untuk register
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "" },
  })

  // Handle login dengan password
  const handleLogin = async (data: LoginFormValues) => {
    setLoading(true)
    setError("")

    try {
      const user = await loginUserUsingPassword(data.email, data.password)

      // admin = admin@gmail.com, qwe123
      const role = data.email === "admin@gmail.com" ? "admin" : "user"

      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        role: role,
      }))

      console.log("Login berhasil!")
      console.log("email :", data.email)
      router.push(role === "admin" ? "/admin" : "/user")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Terjadi kesalahan saat login")
    } finally {
      setLoading(false)
    }
  }

  // Handle kirim link email
  const handleSendEmailLink = async (data: EmailOnlyFormValues) => {
    setLoading(true)
    setError("")
    setEmailState(data.email)

    try {
      // TODO: Implement send email link logic
      // await sendLoginLink(data.email)

      setTimeout(() => {
        setLoading(false)
        setStatus("email_sent")
      }, 2000)
    } catch (error: any) {
      console.error("Send email error:", error)
      setError(error.message || "Gagal mengirim email")
      setLoading(false)
    }
  }

  // Handle register
  const handleRegister = async (data: RegisterFormValues) => {
    setLoading(true)
    setError("")
    setEmailState(data.email)

    try {
      // TODO: Implement register logic
      // await registerUser(data.email)

      setTimeout(() => {
        setLoading(false)
        setStatus("email_sent")
      }, 2000)
    } catch (error: any) {
      console.error("Register error:", error)
      setError(error.message || "Gagal mendaftar")
      setLoading(false)
    }
  }

  // Helper components
  const Logo = () => (
    <img
      src="/asset/rakamin-logo.png"
      alt="logo"
      className="absolute left-0 object-contain"
      style={{
        top: isMobile ? "-10vw" : "-5.286vw",
        width: isMobile ? "20vw" : "10.357vw",
      }}
    />
  )

  const ErrorMessage = () => {
    if (!error) return null
    return (
      <div
        className="text-red-500 text-center p-2 rounded-md bg-red-50"
        style={{
          fontSize: isMobile ? "3vw" : "0.857vw",
          marginBottom: isMobile ? "4vw" : "1vw",
        }}
      >
        {error}
      </div>
    )
  }

  function renderLogin() {
    const currentForm:any = passwordMode ? loginForm : emailForm
    const onSubmit = passwordMode ? handleLogin : handleSendEmailLink

    return (
      <>
        <Logo />
        <CardHeader className="text-left p-0 gap-0">
          <CardTitle
            className="font-bold text-slate-900"
            style={{
              marginBottom: isMobile ? "3vw" : "1.143vw",
              fontSize: isMobile ? "5vw" : "1.429vw",
            }}
          >
            Masuk ke Rakamin
          </CardTitle>
          <div
            className="text-left text-slate-600 mt-2"
            style={{ fontSize: isMobile ? "3.5vw" : "0.972vw" }}
          >
            Belum punya akun?{" "}
            <span
              onClick={() => {
                setStatus("register")
                setError("")
              }}
              className="font-medium hover:underline transition-colors cursor-pointer"
              style={{ color: "rgba(1, 149, 159, 1)" }}
            >
              Daftar menggunakan email
            </span>
          </div>
        </CardHeader>

        <CardContent className="grid p-0" style={{ gap: isMobile ? "6vw" : "1.143vw" }}>
          <ErrorMessage />

          <Form {...currentForm}>
            <form
              onSubmit={currentForm.handleSubmit(onSubmit as any)}
              className="grid"
              style={{ gap: isMobile ? "6vw" : "1.143vw" }}
            >
              <FormField
                control={currentForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-slate-700 font-medium"
                      style={{ fontSize: isMobile ? "3.5vw" : "0.857vw" }}
                    >
                      Alamat email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
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

              {passwordMode && (
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-slate-700 font-medium"
                        style={{ fontSize: isMobile ? "3.5vw" : "0.857vw" }}
                      >
                        Kata sandi
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
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
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-bold transition-colors shadow-md hover:shadow-lg"
                style={{
                  background: "rgba(251, 192, 55, 1)",
                  color: "rgba(64, 64, 64, 1)",
                  fontSize: isMobile ? "4vw" : "1.143vw",
                  height: isMobile ? "12vw" : "2.857vw",
                }}
              >
                {passwordMode ? "Masuk" : "Kirim link login"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col p-0" style={{ gap: isMobile ? "6vw" : "1.143vw" }}>
          <Separator type="or" />

          <SocialButton
            icon={passwordMode ? "/asset/mail-icon.svg" : "/asset/key-icon.svg"}
            text={passwordMode ? "Kirim link login melalui email" : "Masuk dengan kata sandi"}
            onClick={() => {
              setPasswordMode((prev) => !prev)
              setError("")
            }}
          />

          <SocialButton icon="/asset/google-icon.svg" text="Masuk dengan Google" />
        </CardFooter>
      </>
    )
  }

  function renderRegister() {
    return (
      <>
        <Logo />
        <CardHeader className="text-left p-0 gap-0">
          <CardTitle
            className="font-bold text-slate-900"
            style={{
              marginBottom: isMobile ? "3vw" : "1.143vw",
              fontSize: isMobile ? "5vw" : "1.429vw",
            }}
          >
            Bergabung dengan Rakamin
          </CardTitle>
          <div
            className="text-left text-slate-600 mt-2"
            style={{ fontSize: isMobile ? "3.5vw" : "0.972vw" }}
          >
            Sudah punya akun?{" "}
            <span
              onClick={() => {
                setStatus("login")
                setError("")
              }}
              className="font-medium hover:underline transition-colors cursor-pointer"
              style={{ color: "rgba(1, 149, 159, 1)" }}
            >
              Masuk
            </span>
          </div>
        </CardHeader>

        <CardContent className="grid p-0" style={{ gap: isMobile ? "6vw" : "3vw" }}>
          <ErrorMessage />

          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(handleRegister)}>
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="text-slate-700 font-medium"
                      style={{ fontSize: isMobile ? "3.5vw" : "0.857vw" }}
                    >
                      Alamat email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-bold transition-colors shadow-md hover:shadow-lg mt-4"
                style={{
                  background: "rgba(251, 192, 55, 1)",
                  color: "rgba(64, 64, 64, 1)",
                  fontSize: isMobile ? "4vw" : "1.143vw",
                  height: isMobile ? "12vw" : "2.857vw",
                }}
              >
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
          <CardTitle
            className="font-semibold text-neutral-900"
            style={{
              marginBottom: isMobile ? "3vw" : "1.143vw",
              fontSize: isMobile ? "4vw" : "1.714vw",
            }}
          >
            Periksa Email Anda
          </CardTitle>
          <CardDescription
            style={{
              color: "rgba(76, 76, 76, 1)",
              marginBottom: isMobile ? "3vw" : "1.143vw",
              fontSize: isMobile ? "3.5vw" : "0.857vw",
            }}
          >
            Kami sudah mengirimkan link register ke{" "}
            <span className="font-bold">{emailState}</span> yang berlaku dalam{" "}
            <span className="font-bold">30 menit</span>.
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
            }}
          />
        </CardContent>
      </>
    )
  }

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100"
      style={{ padding: isMobile ? "8vw" : "5vw" }}
    >
      <Card
        className="w-full shadow-xl border-slate-200 relative rounded-sm"
        style={{
          maxWidth: isMobile ? "90vw" : "35vw",
          padding: isMobile ? "5vw" : "2.778vw",
          gap: isMobile ? "3vw" : "1.143vw",
        }}
      >
        <LoadingOverlay isLoading={loading} />

        {status === "login" && renderLogin()}
        {status === "register" && renderRegister()}
        {status === "email_sent" && renderEmailSent()}
      </Card>
    </div>
  )
}