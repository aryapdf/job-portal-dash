import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("photo") as Blob;

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `photo-${Date.now()}.jpg`;
    const filePath = path.join(process.cwd(), "public/asset/photo", fileName);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/asset/photo/${fileName}` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
