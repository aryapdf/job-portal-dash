"use client"

import { Provider } from "react-redux";
import { store } from "@/store";
import AuthListener from "@/components/AuthListener";
import ProtectedAuth from "@/components/ProtectedAuth";
import React from "react";

export function Providers({children}) {
    return (
        <Provider store={store}>
            <AuthListener>
                <ProtectedAuth>
                    {children}
                </ProtectedAuth>
            </AuthListener>
        </Provider>
    )
}