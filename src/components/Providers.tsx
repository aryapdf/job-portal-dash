"use client"

import { Provider } from "react-redux";
import { store } from "@/store";
import AuthListener from "@/components/AuthListener";
import ProtectedAuth from "@/components/ProtectedAuth";
import React from "react";
import {useScreenListener} from "@/hooks/useScreenListener";

function ScreenListenerWrapper({ children }: { children: React.ReactNode }) {
    useScreenListener(); // Only called once here!
    return <>{children}</>;
}

export function Providers({children}: {children: React.ReactNode; }) {
    return (
        <Provider store={store}>
            <AuthListener>
                <ScreenListenerWrapper>
                    {/*<ProtectedAuth>*/}
                        {children}
                    {/*</ProtectedAuth>*/}
                </ScreenListenerWrapper>
            </AuthListener>
        </Provider>
    )
}