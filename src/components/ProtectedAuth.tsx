"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "@/store";
import { LoadingOverlay } from "@/components/Loading/LoadingOverlay";

interface ProtectedAuthProps {
    children: React.ReactNode;
    publicPaths?: string[];
}

export default function ProtectedAuth({
                                          children,
                                          publicPaths = ["/sign_in", "/verify"],
                                      }: ProtectedAuthProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { loggedIn, role } = useSelector((state: RootState) => state.user);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        let isMounted = true; // untuk mencegah state update setelah unmount

        const handleRedirect = async () => {
            setIsRedirecting(true);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // delay 2 detik

            const isPublicPath = publicPaths.includes(pathname);
            const isAdminPath = pathname.startsWith("/admin");
            const isUserPath = pathname.startsWith("/user");
            const isVerifyPath = pathname.startsWith("/verify");
            const emailForSignIn =
                typeof window !== "undefined" ? localStorage.getItem("emailForSignin") : null;

            try {
                // 1️⃣ Belum login & mencoba akses halaman yang butuh proteksi
                if (!loggedIn && !isPublicPath) {
                    if (isVerifyPath) {
                        if (emailForSignIn) return;
                        router.replace("/sign_in");
                        return;
                    }
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

                // 4️⃣ Sudah login & sedang di /verify → balik ke halaman sebelumnya
                if (loggedIn && isVerifyPath) {
                    router.back();
                    return;
                }

                // ✅ Semua kondisi lain valid → lanjut render
            } catch (error: any) {
                console.error("ProtectedAuth error:", error.message);
            } finally {
                if (isMounted) setIsRedirecting(false);
            }
        };

        handleRedirect();

        return () => {
            isMounted = false;
        };
    }, [loggedIn, pathname, role]); // ← dependensinya disederhanakan

    // Show loading during redirect
    if (isRedirecting) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingOverlay isLoading={true} />
            </div>
        );
    }

    if (!loggedIn && !publicPaths.includes(pathname)) {
        return null;
    }

    return <>{children}</>;
}
