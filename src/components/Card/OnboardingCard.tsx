"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyMagicLink } from "@/lib/firebaseAuth";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/userSlice";
import { RootState } from "@/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay";

export default function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile";

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      setStatus("error");
      setError("Link tidak valid atau sudah kadaluarsa");
      return;
    }

    const verify = async () => {
      try {
        const user = await verifyMagicLink(token, email);
        const role = email === "admin@gmail.com" ? "admin" : "user";

        dispatch(setUser({ uid: user.uid, email: user.email, role }));
        setStatus("success");

        setTimeout(() => {
          router.push(role === "admin" ? "/admin" : "/user");
        }, 2000);
      } catch (error: any) {
        console.error("Verification error:", error);
        setStatus("error");
        setError(error.message || "Gagal verifikasi magic link");
      }
    };

    verify();
  }, [searchParams, dispatch, router]);

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
        {status === "verifying" && <LoadingOverlay isLoading={true} />}

        <Logo />

        {status === "verifying" && (
          <>
            <CardHeader className="text-center p-0 gap-0">
              <CardTitle
                className="font-bold text-slate-900"
                style={{
                  marginBottom: isMobile ? "3vw" : "1.143vw",
                  fontSize: isMobile ? "5vw" : "1.714vw",
                }}
              >
                Memverifikasi
              </CardTitle>
              <CardDescription
                style={{
                  color: "rgba(76, 76, 76, 1)",
                  fontSize: isMobile ? "3.5vw" : "0.857vw",
                }}
              >
                Mohon tunggu sebentar...
              </CardDescription>
            </CardHeader>

            <CardContent className="flex items-center justify-center" style={{ padding: isMobile ? "8vw 0" : "3vw 0" }}>
              <div
                className="animate-spin rounded-full border-b-2"
                style={{
                  width: isMobile ? "16vw" : "4vw",
                  height: isMobile ? "16vw" : "4vw",
                  borderColor: "rgba(1, 149, 159, 1)",
                }}
              />
            </CardContent>
          </>
        )}

        {status === "success" && (
          <>
            <CardHeader className="text-center p-0 gap-0">
              <CardTitle
                className="font-bold text-slate-900"
                style={{
                  marginBottom: isMobile ? "3vw" : "1.143vw",
                  fontSize: isMobile ? "5vw" : "1.714vw",
                }}
              >
                Berhasil!
              </CardTitle>
              <CardDescription
                style={{
                  color: "rgba(76, 76, 76, 1)",
                  fontSize: isMobile ? "3.5vw" : "0.857vw",
                }}
              >
                Anda akan dialihkan ke dashboard...
              </CardDescription>
            </CardHeader>

            <CardContent className="flex items-center justify-center" style={{ padding: isMobile ? "8vw 0" : "3vw 0" }}>
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: isMobile ? "20vw" : "5vw",
                  height: isMobile ? "20vw" : "5vw",
                  backgroundColor: "rgba(34, 197, 94, 0.1)",
                }}
              >
                <svg
                  className="text-green-500"
                  style={{
                    width: isMobile ? "12vw" : "3vw",
                    height: isMobile ? "12vw" : "3vw",
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </CardContent>
          </>
        )}

        {status === "error" && (
          <>
            <CardHeader className="text-center p-0 gap-0">
              <CardTitle
                className="font-bold text-slate-900"
                style={{
                  marginBottom: isMobile ? "3vw" : "1.143vw",
                  fontSize: isMobile ? "5vw" : "1.714vw",
                }}
              >
                Gagal Verifikasi
              </CardTitle>
              <CardDescription
                className="text-red-600"
                style={{
                  fontSize: isMobile ? "3.5vw" : "0.857vw",
                  marginBottom: isMobile ? "4vw" : "1.143vw",
                }}
              >
                {error}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center" style={{ gap: isMobile ? "6vw" : "1.143vw", padding: 0 }}>
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: isMobile ? "20vw" : "5vw",
                  height: isMobile ? "20vw" : "5vw",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                }}
              >
                <svg
                  className="text-red-500"
                  style={{
                    width: isMobile ? "12vw" : "3vw",
                    height: isMobile ? "12vw" : "3vw",
                  }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <Button
                onClick={() => router.push("/sign_in")}
                className="w-full font-bold transition-colors shadow-md hover:shadow-lg"
                style={{
                  background: "rgba(251, 192, 55, 1)",
                  color: "rgba(64, 64, 64, 1)",
                  fontSize: isMobile ? "4vw" : "1.143vw",
                  height: isMobile ? "12vw" : "2.857vw",
                }}
              >
                Kembali ke Login
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}