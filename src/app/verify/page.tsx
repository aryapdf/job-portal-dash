"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyMagicLink } from "@/lib/firebaseAuth";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams:any = useSearchParams();
  const dispatch = useDispatch();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("error");
      setError("Link tidak valid");
      return;
    }

    const verify = async () => {
      try {
        const user = await verifyMagicLink(token, email);

        // Determine role (you can customize this logic)
        const role = email === "admin@gmail.com" ? "admin" : "user";

        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          role: role,
        }));

        setStatus("success");

        // Redirect after 2 seconds
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {status === "verifying" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800">Memverifikasi...</h2>
            <p className="text-gray-600 mt-2">Mohon tunggu sebentar</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-gray-800">Berhasil!</h2>
            <p className="text-gray-600 mt-2">Anda akan dialihkan...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="text-red-500 text-6xl mb-4">✕</div>
            <h2 className="text-xl font-semibold text-gray-800">Gagal Verifikasi</h2>
            <p className="text-red-600 mt-2">{error}</p>
            <button
              onClick={() => router.push("/sign_in")}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Kembali ke Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}