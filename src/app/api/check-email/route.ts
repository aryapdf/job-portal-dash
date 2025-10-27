import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
      const userRecord = await auth.getUserByEmail(email);
      const providers = userRecord.providerData.map(p => p.providerId);

      return NextResponse.json({
        exists: true,
        hasPassword: providers.includes("password"),
        providers,
      });

    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        return NextResponse.json({
          exists: false,
          hasPassword: false,
          providers: [],
        });
      }
      throw error;
    }

  } catch (error: any) {
    console.error("Check email error:", error);
    return NextResponse.json({ error: error.message || "Failed to check email" }, { status: 500 });
  }
}
