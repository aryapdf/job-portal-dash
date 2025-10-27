import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const APPS_PATH = path.join(process.cwd(), 'data', 'applications.json');

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    const data = await fs.readFile(APPS_PATH, "utf-8");
    const applications = JSON.parse(data || "[]");
    const candidates = applications.filter((candidate: any) => candidate.jobId === id);

    return NextResponse.json({ success: true, data: candidates });
  } catch (error: any) {
    console.error("Error fetching candidates :", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

