// path: src/app/api/jobs/manage-job/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const APPS_PATH = path.join(process.cwd(), 'data', 'applications.json');
const JOBS_PATH = path.join(process.cwd(), 'data', 'jobs.json');

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

    const dataApplications = await fs.readFile(APPS_PATH, "utf-8");
    const applications = JSON.parse(dataApplications || "[]");

    const dataJobs = await fs.readFile(JOBS_PATH, "utf-8");
    const jobs = JSON.parse(dataJobs || "[]");

    const selectedJob = jobs.find((job:any) => job.id === id)
    const candidates = applications.filter((candidate: any) => candidate.jobId === id);

    const response = {
      jobName: selectedJob.jobName,
      candidates: candidates
    }

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Error fetching candidates :", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

