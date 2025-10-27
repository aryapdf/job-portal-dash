import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";
import React from "react";
import {Layout} from "@/components/Layout";
import {Providers} from "@/components/Providers";
import { Toaster } from "sonner";

const nunito = Nunito({
    variable: "--font-nunito",
    subsets: ["latin"],
    display: "swap"
});

const nunitoSans = Nunito_Sans({
    variable: "--font-nunito-sans",
    subsets: ["latin"],
    display: "swap"
});

export const metadata: Metadata = {
    title: "Hiring Management Dashboard",
    description: "Manage job postings and applications efficiently",
};

export default function RootLayout({children,}: {children: React.ReactNode; }) {

    return (
        <html lang="en" className={`${nunito.variable} ${nunitoSans.variable}`}>
            <body>
                <Providers>
                    <Layout>
                        {children}
                        <Toaster position={"bottom-left"} />
                    </Layout>
                </Providers>
            </body>
        </html>
    );
}