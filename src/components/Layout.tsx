"use client"

import AuthListener from "@/components/AuthListener";
import ProtectedAuth from "@/components/ProtectedAuth";
import React from "react";
import {useScreenListener} from "@/hooks/useScreenListener";
import {usePathname} from "next/navigation";
import NavBar from "@/components/Navigation/NavBar";

function ScreenListenerWrapper({ children }: { children: React.ReactNode }) {
    useScreenListener(); // Only called once here!
    return <>{children}</>;
}

export function Layout({children}: {children: React.ReactNode; }) {
    const pathname = usePathname();
    const showNavbar = ["/admin", "/user"].includes(pathname);

    return (<AuthListener>
        <ScreenListenerWrapper>
            {/*<ProtectedAuth>*/}
            {showNavbar && <NavBar title={"Job List"}/>}
            <main>
                {children}
            </main>

            {/*</ProtectedAuth>*/}
        </ScreenListenerWrapper>
    </AuthListener>

    )
}