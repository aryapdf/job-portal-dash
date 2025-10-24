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
import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import {LoadingOverlay} from "@/components/Loading/LoadingOverlay";
import SocialButton from "@/components/Button/SocialButton";

export default function OnboardingCard() {
    const deviceType = useSelector((state: RootState) => state.screen.deviceType)
    const isMobile = deviceType === "mobile"

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [status, setStatus] = useState<"register" | "email_sent" | "login">("login")
    const [passwordMode, setPasswordMode] = useState(false)

    // Validation functions
    const validateEmail = () => {
        if (!email) {
            setEmailError("Email tidak boleh kosong.");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError("Format email tidak valid.");
            return false;
        }
        setEmailError("");
        return true;
    }

    const validatePassword = () => {
        if (password.length < 8) {
            setPasswordError("Minimal 8 karakter");
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            setPasswordError("Harus mengandung huruf besar");
            return false;
        }
        if (!/[0-9]/.test(password)) {
            setPasswordError("Harus mengandung angka");
            return false;
        }
        setPasswordError("");
        return true;
    }

    const handleSubmit = () => {
        const isEmailValid = validateEmail();
        const isPasswordValid = passwordMode ? validatePassword() : true;

        if (isEmailValid && isPasswordValid) {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                setLoading(false);
                setStatus("email_sent");
            }, 2000);
        }
    }

    // Reusable Input Field Component
    const FormField = ({
                           id,
                           label,
                           type = "text",
                           value,
                           onChange,
                           error
                       }: {
        id: string;
        label: string;
        type?: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        error?: string;
    }) => (
        <div className="grid" style={{ gap: isMobile ? "4vw" : "0.571vw" }}>
            <Label
                htmlFor={id}
                className="text-slate-700 font-medium"
                style={{ fontSize: isMobile ? "3.5vw" : "0.857vw" }}
            >
                {label}
            </Label>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                className={`border-slate-300 focus:border-blue-500 focus:ring-blue-500 transition-all ${
                    error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
                style={{
                    padding: isMobile ? "2.5vw 4vw" : "0.556vw 1.111vw",
                    fontSize: isMobile ? "3.5vw" : "0.857vw",
                }}
            />
            {error && (
                <p
                    className="text-red-500"
                    style={{
                        fontSize: isMobile ? "3vw" : "0.7vw",
                        marginTop: isMobile ? "1vw" : "0.3vw",
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    );

    const Separator = () => (
        <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center">
                <span
                    className="bg-white text-slate-500"
                    style={{
                        fontSize: isMobile ? "3.5vw" : "0.857vw",
                        paddingInline: isMobile ? "2vw" : "0.857vw",
                    }}
                >
                    or
                </span>
            </div>
        </div>
    );

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
    );

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
                    <FormField
                        id="email"
                        label="Alamat email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                    />

                    {passwordMode && (
                        <FormField
                            id="password"
                            label="Kata sandi"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={passwordError}
                        />
                    )}
                </CardContent>

                <CardFooter className="flex flex-col p-0" style={{ gap: isMobile ? "6vw" : "1.143vw" }}>
                    <Button
                        className="w-full font-bold transition-colors shadow-md hover:shadow-lg"
                        style={{
                            background: "rgba(251, 192, 55, 1)",
                            color: "rgba(64, 64, 64, 1)",
                            fontSize: isMobile ? "4vw" : "1.143vw",
                            height: isMobile ? "12vw" : "2.857vw",
                        }}
                        onClick={handleSubmit}
                    >
                        {passwordMode ? "Masuk" : "Kirim link login"}
                    </Button>

                    <Separator />

                    <SocialButton
                        icon={passwordMode ? '/asset/mail-icon.svg' : `/asset/key-icon.svg`}
                        text={passwordMode ? `Kirim link login melalui email` : `Masuk dengan kata sandi`}
                        onClick={() => setPasswordMode(prev => !prev)}
                    />

                    <SocialButton
                        icon="/asset/google-icon.svg"
                        text="Masuk dengan Google"
                    />
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
                            onClick={() => setStatus("login")}
                            className="font-medium hover:underline transition-colors cursor-pointer"
                            style={{ color: "rgba(1, 149, 159, 1)" }}
                        >
                            Masuk
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="grid p-0" style={{ gap: isMobile ? "6vw" : "3vw" }}>
                    <FormField
                        id="email"
                        label="Alamat email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                    />
                </CardContent>

                <CardFooter className="flex flex-col p-0">
                    <Button
                        className="w-full font-bold transition-colors shadow-md hover:shadow-lg"
                        style={{
                            background: "rgba(251, 192, 55, 1)",
                            color: "rgba(64, 64, 64, 1)",
                            fontSize: isMobile ? "4vw" : "1.143vw",
                            height: isMobile ? "12vw" : "2.857vw",
                        }}
                        onClick={handleSubmit}
                    >
                        Daftar dengan email
                    </Button>

                    <div
                        className="relative w-full"
                        style={{ marginBlock: isMobile ? "4vw" : "1vw" }}
                    >
                        <Separator />
                    </div>

                    <SocialButton
                        icon="/asset/google-icon.svg"
                        text="Daftar dengan Google"
                    />
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
                        Kami sudah mengirimkan link register ke <span className="font-bold">{email}</span> yang berlaku dalam <span className="font-bold">30 menit</span>.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <img
                        src='/asset/email-sent.png'
                        alt='email_sent'
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