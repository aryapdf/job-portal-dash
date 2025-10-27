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
    const showNavbar =
      pathname === "/admin" ||
      pathname === "/user" ||
      pathname.startsWith("/admin/job/");

    const chooseTitle = () => {
        if (pathname.startsWith("/admin/job")) {
            return(
              <div className={"flex items-center"} style={{gap: "6px"}}>
                  <div>Job List</div>
                  <img src="/asset/chevron-right.svg" alt="" style={{ width:"24px", height: "24px" }} />
                  <div> Manage Candidate </div>
              </div>
            )
        } else {
            return("Job List")
        }
    }



    return (<AuthListener>
        <ScreenListenerWrapper>
            <ProtectedAuth>
            <main
                className={"flex flex-col"}
                style={{
                    height: "100vh",
                }}
            >
                {showNavbar && <NavBar title={chooseTitle()}/>}
                {children}
            </main>

            </ProtectedAuth>
        </ScreenListenerWrapper>
    </AuthListener>

    )
}