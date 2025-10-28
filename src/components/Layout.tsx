"use client"

import AuthListener from "@/components/AuthListener";
import ProtectedAuth from "@/components/ProtectedAuth";
import React from "react";
import {useScreenListener} from "@/hooks/useScreenListener";
import {usePathname} from "next/navigation";
import NavBar from "@/components/Navigation/NavBar";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

function ScreenListenerWrapper({ children }: { children: React.ReactNode }) {
    useScreenListener(); // Only called once here!
    return <>{children}</>;
}

export function Layout({children}: {children: React.ReactNode; }) {
    const pathname = usePathname();
    const isMobile = useSelector((state: RootState) => state.screen.deviceType) === "mobile";

    const showNavbar =
      pathname === "/admin" ||
      pathname === "/user" ||
      pathname.startsWith("/admin/job/");

    const chooseTitle = () => {
        if (pathname.startsWith("/admin/job")) {
            return(
              <div
                className="flex items-center"
                style={{gap: isMobile ? "1.5vw" : "0.429vw"}}
              >
                  <div style={{fontSize: isMobile ? "4vw" : "1.143vw"}}>
                      Job List
                  </div>
                  <img
                    src="/asset/chevron-right.svg"
                    alt=""
                    style={{
                        width: isMobile ? "6vw" : "1.714vw",
                        height: isMobile ? "6vw" : "1.714vw"
                    }}
                  />
                  <div style={{fontSize: isMobile ? "4vw" : "1.143vw"}}>
                      Manage Candidate
                  </div>
              </div>
            )
        } else {
            return(
              <div style={{fontSize: isMobile ? "4vw" : "1.143vw"}}>
                  Job List
              </div>
            )
        }
    }

    return (
      <AuthListener>
          <ScreenListenerWrapper>
              <ProtectedAuth>
                  <main
                    className="flex flex-col"
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