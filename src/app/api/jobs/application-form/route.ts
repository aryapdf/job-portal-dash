import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const JOBS_PATH = path.join(process.cwd(), 'data', 'jobs.json');

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("job-id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    const data = await fs.readFile(JOBS_PATH, "utf-8");
    const jobs = JSON.parse(data || "[]");
    const selectedJob = jobs.find((job: any) => job.id === id);

    const formRequirement = {
      title: selectedJob.jobName,
      fields: {
        fullNameReq: selectedJob.fullNameReq,
        photoProfileReq: selectedJob.photoProfileReq,
        genderReq: selectedJob.genderReq,
        domicileReq: selectedJob.domicileReq,
        emailReq: selectedJob.emailReq,
        phoneNumberReq: selectedJob.phoneNumberReq,
        linkedinReq: selectedJob.linkedinReq,
        dateOfBirthReq: selectedJob.dateOfBirthReq,
      }
    }

    return NextResponse.json({ success: true, data: formRequirement });
  } catch (error: any) {
    console.error("Error fetching candidates :", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

