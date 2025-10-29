// src/app/api/send-magic-link/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    })
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
      from: "Job Portal Dash <onboarding@resend.dev>",
      to: email,
      subject: "Masuk ke Admin Dashboard",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f4f4f4;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f4f4f4;">
          <tr>
            <td style="padding:20px 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="480" style="margin:0 auto;background-color:#ffffff;border:1px solid #eeeeee;border-radius:12px;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <h2 style="color:#1d1f20;font-size:32px;margin:0 0 54px 0;font-weight:bold;font-family:sans-serif;">Job Portal Dash</h2>
                    
                    <p style="color:#555555;font-size:18px;margin:0 0 40px 0;text-align:left;line-height:1.5;font-family:sans-serif;">
                      Hai! <br/><br/>
                      Berikut adalah <strong>link masuk</strong> yang kamu request dari <span style="color:#007dfe;">jobportaldash.vercel.app</span>
                    </p>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 16px;">
                      <tr>
                        <td style="background-color:#01959f;border-radius:8px;">
                          <a href="${magicLink}" style="background-color:#01959f;color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;font-family:sans-serif;font-size:16px;">
                            Masuk ke Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin:24px 0 0 0;font-size:13px;color:#9e9e9e;line-height:1.5;font-family:sans-serif;">
                      Untuk keamanan, link hanya dapat diakses dalam 30 menit. Jika kamu tidak ada permintaan untuk login melalui link, abaikan pesan ini.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        </body>
      </html>
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