"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useState} from "react";

export default function LoginCard() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = () => {
        if (!email) {
            setError("Email tidak boleh kosong.")
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Format email tidak valid.")
        } else {
            setError("")
        }
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-[5vw] md:p-4">
            <Card className="w-full max-w-[90vw] md:max-w-[35vw] md:min-w-[400px] shadow-xl border-slate-200 relative rounded-sm !p-[2.778vw] !md:p-[2.778vw]">
                <img
                    src="/asset/rakamin-logo.png"
                    alt="logo"
                    className="absolute left-0 top-[-10vw] md:top-[-5.139vw] w-[20vw] md:w-[10.069vw] object-contain"
                />

                <CardHeader className="space-y-2 text-center md:text-left p-0 pb-[4vw] md:pb-[1.5vw]">
                    <CardTitle className="font-bold text-slate-900 text-[1.389vw] leading-tight">
                        Bergabung dengan Rakamin
                    </CardTitle>

                    <div className="text-left text-slate-600 mt-2 text-[0.972vw]">
                        Sudah punya akun?{" "}
                        <a
                            href="#"
                            className="font-medium hover:underline transition-colors"
                            style={{
                                color: "rgba(1, 149, 159, 1)"
                            }}
                        >
                            Masuk
                        </a>
                    </div>
                </CardHeader>

                <CardContent className="grid gap-[3vw] md:gap-[1.2vw] p-0 pb-[4vw] md:pb-[1.5vw]">
                    <div className="grid gap-[2vw] md:gap-[0.5vw]">
                        <Label
                            htmlFor="email"
                            className="text-slate-700 font-medium text-[0.833vw]"
                        >
                            Alamat email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder=""
                            onChange={(e) => setEmail(e.target.value)}
                            className={`border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all text-[3.5vw] md:text-[0.9vw] h-[10vw] md:h-[2.5vw] ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} `}
                            style={{
                                padding: "0.556vw 1.111vw",
                            }}
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-[3vw] md:gap-[1vw] p-0">
                    <Button
                        className="w-full text-white font-medium transition-colors shadow-md hover:shadow-lg text-[3.5vw] md:text-[0.9vw] h-[10vw] md:h-[2.5vw]"
                        style={{
                            background: "rgba(251, 192, 55, 1)"
                        }}
                        onClick={handleSubmit}
                    >
                        Daftar dengan email
                    </Button>

                    <div className="relative w-full my-[1vw] md:my-[0.5vw]">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-300" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-[2vw] md:px-[0.8vw] text-slate-500 text-[3vw] md:text-[0.8vw]">
                                or
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-all shadow-sm hover:shadow-md text-[3.5vw] md:text-[0.9vw] h-[10vw] md:h-[2.5vw]"
                    >
                        <svg className="mr-[2vw] md:mr-[0.5vw] h-[4vw] md:h-[1.2vw] w-[4vw] md:w-[1.2vw]" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Daftar dengan Google
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}