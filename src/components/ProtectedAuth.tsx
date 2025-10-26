"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "@/store";
import {LoadingOverlay} from "@/components/Loading/LoadingOverlay";

interface ProtectedAuthProps {
    children: React.ReactNode;
    publicPaths?: string[];
}

export default function ProtectedAuth({
                                          children,
                                          publicPaths = ["/sign_in"],
                                      }: ProtectedAuthProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { loggedIn, role } = useSelector((state: RootState) => state.user);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const isPublicPath = publicPaths.includes(pathname);
        const isAdminPath = pathname.startsWith("/admin");
        const isUserPath = pathname.startsWith("/user");
        const isVerifyPath = pathname.startsWith("/verify");
        const emailForSignIn = typeof window !== "undefined"
          ? localStorage.getItem("emailForSignin")
          : null;

        setIsRedirecting(true);

        try {
            // 1️⃣ Tidak login tapi di halaman yang butuh proteksi
            if (!loggedIn && !isPublicPath) {
                if (isVerifyPath) {
                    // Izinkan akses ke /verify hanya jika punya emailForSignIn
                    if (emailForSignIn) return;
                    router.replace("/sign_in");
                    return;
                }

                // Halaman terproteksi lainnya → redirect ke sign_in
                router.replace("/sign_in");
                return;
            }

            // 2️⃣ Sudah login tapi mencoba akses halaman publik
            if (loggedIn && isPublicPath) {
                const redirectPath = role === "admin" ? "/admin" : "/user";
                router.replace(redirectPath);
                return;
            }

            // 3️⃣ Role mismatch
            if (loggedIn && role === "user" && isAdminPath) {
                router.replace("/user");
                return;
            }

            if (loggedIn && role === "admin" && isUserPath) {
                router.replace("/admin");
                return;
            }

            // 4️⃣ User login dan sedang di /verify (nggak perlu redirect)
            if (loggedIn && isVerifyPath) {
                router.back(); // optional, tergantung UX-mu
                return;
            }
        } catch (error: any) {
            console.error("ProtectedAuth error:", error.message);
        } finally {
            setIsRedirecting(false);
        }
    }, [loggedIn, pathname, role, router, publicPaths]);


    // Show loading during redirect
    if (isRedirecting) {
        return (
          <div className="flex items-center justify-center min-h-screen">
             <LoadingOverlay isLoading={isRedirecting} />
          </div>
        );
    }

    // Don't render if not authorized
    if (!loggedIn && !publicPaths.includes(pathname)) {
        return null;
    }

    return <>{children}</>;
}