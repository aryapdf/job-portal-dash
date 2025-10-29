// path : src/app/api/jobs/apply/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const JOBS_PATH = path.join(process.cwd(), 'data', 'jobs.json');
const APPS_PATH = path.join(process.cwd(), 'data', 'applications.json');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const jobId = body.jobId;

    const jobs = JSON.parse(await fs.readFile(JOBS_PATH, 'utf-8') || '[]');
    const job = jobs.find((j: any) => j.id === jobId);
    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    const applications = JSON.parse(await fs.readFile(APPS_PATH, 'utf-8') || '[]');

    // Calculate the next order number for this job
    const jobApplications = applications.filter((app: any) => app.jobId === jobId);
    const maxOrder = jobApplications.length > 0
      ? Math.max(...jobApplications.map((app: any) => app.order || 0))
      : 0;
    const nextOrder = maxOrder + 1;

    const newApp = {
      id: randomUUID(),
      jobId,
      ...body,
      order: nextOrder, // Add order field
      appliedAt: new Date().toISOString(),
      status: 'pending'
    };

    applications.push(newApp);
    await fs.writeFile(APPS_PATH, JSON.stringify(applications, null, 2));

    return NextResponse.json({ success: true, data: newApp });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}