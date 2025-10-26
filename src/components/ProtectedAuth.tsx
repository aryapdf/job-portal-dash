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

        // Not logged in and trying to access protected path
        if (!loggedIn && !isPublicPath) {
            setIsRedirecting(true);
            router.replace("/sign_in");
            return;
        }

        // Logged in and on public path
        if (loggedIn && isPublicPath) {
            setIsRedirecting(true);
            const redirectPath = role === "admin" ? "/admin" : "/user";
            router.replace(redirectPath);
            return;
        }

        // Wrong role for path
        if (loggedIn && role === "user" && isAdminPath) {
            setIsRedirecting(true);
            router.replace("/user");
            return;
        }

        if (loggedIn && role === "admin" && isUserPath) {
            setIsRedirecting(true);
            router.replace("/admin");
            return;
        }

        // If we reach here, user is authorized
        setIsRedirecting(false);
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