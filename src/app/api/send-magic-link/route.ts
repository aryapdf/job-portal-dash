// src/app/api/send-magic-link/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Import service account JSON
const serviceAccount = require("@/config/firebase-service-account.json");

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount) // ✅ Langsung pakai cert()
  });
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const auth = getAuth();

    let uid: string;
    try {
      const userRecord = await auth.getUserByEmail(email);
      uid = userRecord.uid;
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        const newUser = await auth.createUser({ email });
        uid = newUser.uid;
      } else {
        throw error;
      }
    }

    const customToken = await auth.createCustomToken(uid);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const magicLink = `${baseUrl}/verify?token=${customToken}&email=${encodeURIComponent(email)}`;

    await resend.emails.send({
      from: "Rakamin Academy <onboarding@resend.dev>",
      to: email,
      subject: "Masuk ke Rakamin Academy",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;text-align:center;padding:24px;border:1px solid #eee;border-radius:12px">
          <h2 style="color:#222">Masuk ke Rakamin Academy</h2>
          <p style="color:#555;font-size:15px">Halo! Klik tombol di bawah untuk masuk dengan aman.</p>
          <a href="${magicLink}" 
             style="background-color:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;margin-top:16px">
             Masuk Sekarang
          </a>
          <p style="margin-top:24px;font-size:13px;color:#777">
            Link ini berlaku selama 1 jam. Jika kamu tidak meminta ini, abaikan saja email ini.
          </p>
        </div>
      `
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Error in send-magic-link:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send magic link" },
      { status: 500 }
    );
  }
}