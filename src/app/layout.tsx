import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";
import React from "react";
import {Providers} from "@/components/Providers";


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
    <html lang="en">
      <body className={`${nunito.variable} ${nunitoSans.variable}`} style={{background: "rgba(250, 250, 250, 1)"}}>
      <Providers>
        {children}
      </Providers>
      </body>
    </html>
  );
}
