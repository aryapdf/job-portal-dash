"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "@/store";

interface ProtectedAuthProps {
    children: React.ReactNode;
    publicPaths?: string[];
}

export default function ProtectedAuth({
                                          children,
                                          publicPaths = ["/", "/login"],
                                      }: ProtectedAuthProps) {
    const router = useRouter();
    const pathname = usePathname();
    const loggedIn = useSelector((state: RootState) => state.user.loggedIn);

    useEffect(() => {
        if (!loggedIn && !publicPaths.includes(pathname)) {
            router.replace("/");
        }
    }, [loggedIn, pathname, router, publicPaths]);

    if (!loggedIn && !publicPaths.includes(pathname)) {
        return null;
    }

    return <>{children}</>;
}
