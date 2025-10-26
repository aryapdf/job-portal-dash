"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay"
import SocialButton from "@/components/Button/SocialButton"
import Separator from "@/components/Separator/Separator";


export default function OnboardingCard() {
    const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile"

    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<"register" | "email_sent" | "login">("login")
    const [passwordMode, setPasswordMode] = useState(false)
    const [emailState, setEmailState] = useState("")


    //validator
    const formSchema = z.object({
        email: z
            .string()
            .min(1, "Email tidak boleh kosong")
            .email("Format email tidak valid"),
        password: passwordMode
            ? z
                .string()
                .min(8, "Minimal 8 karakter")
                .regex(/[A-Z]/, "Harus mengandung huruf besar")
                .regex(/[0-9]/, "Harus mengandung angka")
            : z.string().optional(),
    })

    // react-hook-form setup
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "", password: "" },
    })


    // Submit handler
    const onSubmit = (data:any) => {
        setLoading(true)
        setEmailState(data.email)
        setTimeout(() => {
            setLoading(false)
            setStatus("email_sent")
        }, 2000)
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

    // ----------------------
    // Login Form
    // ----------------------
    function renderLogin() {
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
                            onClick={() => setStatus("register")}
                            className="font-medium hover:underline transition-colors cursor-pointer"
                            style={{ color: "rgba(1, 149, 159, 1)" }}
                        >
                          Daftar menggunakan email
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="grid p-0" style={{ gap: isMobile ? "6vw" : "1.143vw" }}>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid"
                            style={{ gap: isMobile ? "6vw" : "1.143vw" }}
                        >
                            <FormField
                                control={form.control}
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
                                    control={form.control}
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
                    <Separator type={"or"} />

                    <SocialButton
                        icon={passwordMode ? "/asset/mail-icon.svg" : "/asset/key-icon.svg"}
                        text={passwordMode ? "Kirim link login melalui email" : "Masuk dengan kata sandi"}
                        onClick={() => setPasswordMode((prev) => !prev)}
                    />

                    <SocialButton icon="/asset/google-icon.svg" text="Masuk dengan Google" />
                </CardFooter>
            </>
        )
    }

    // ----------------------
    // Register
    // ----------------------
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
                            onClick={() => setStatus("login")}
                            className="font-medium hover:underline transition-colors cursor-pointer"
                            style={{ color: "rgba(1, 149, 159, 1)" }}
                        >
              Masuk
            </span>
                    </div>
                </CardHeader>

                <CardContent className="grid p-0" style={{ gap: isMobile ? "6vw" : "3vw" }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
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
                        <Separator type={"or"} />
                    </div>
                    <SocialButton icon="/asset/google-icon.svg" text="Daftar dengan Google" />
                </CardFooter>
            </>
        )
    }

    // ----------------------
    // Email Sent
    // ----------------------
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
                            marginInline: 'auto'
                        }}
                    />
                </CardContent>
            </>
        )
    }

    // ----------------------
    // Render Root
    // ----------------------
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
