import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const JOBS_FILE_PATH = path.join(process.cwd(), 'data', 'jobs.json');

// Helper: baca file JSON
async function readJobs() {
  try {
    const data = await fs.readFile(JOBS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err: any) {
    if (err.code === 'ENOENT') return []; // kalau file belum ada
    throw err;
  }
}

// Helper: tulis file JSON
async function writeJobs(jobs: any[]) {
  await fs.mkdir(path.dirname(JOBS_FILE_PATH), { recursive: true });
  await fs.writeFile(JOBS_FILE_PATH, JSON.stringify(jobs, null, 2), 'utf-8');
}

// GET - ambil semua jobs atau filter by status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const jobs = await readJobs();

    const id = searchParams.get('id')
    let returnedJob;
    if (id) {
      returnedJob = Array.isArray(jobs) && jobs.find((j: any) => j.id === id)
    } else {
      returnedJob = jobs
    }

    return NextResponse.json({
      success: true,
      data: returnedJob,
    });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST - tambah job baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = ['jobName', 'jobType', 'jobDescription', 'candidateNumber'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const now = new Date().toISOString();

    const newJob = {
      id: randomUUID(),
      jobName: body.jobName,
      jobType: body.jobType,
      jobDescription: body.jobDescription,
      candidateNumber: body.candidateNumber,
      fullNameReq: body.fullNameReq || 'mandatory',
      photoProfileReq: body.photoProfileReq || 'mandatory',
      genderReq: body.genderReq || 'mandatory',
      domicileReq: body.domicileReq || 'mandatory',
      emailReq: body.emailReq || 'mandatory',
      phoneNumberReq: body.phoneNumberReq || 'mandatory',
      linkedinReq: body.linkedinReq || 'mandatory',
      dateOfBirthReq: body.dateOfBirthReq || 'mandatory',
      minSalary: body.minSalary || 0,
      maxSalary: body.maxSalary || 0,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };

    const jobs = await readJobs();
    jobs.push(newJob);
    await writeJobs(jobs);

    return NextResponse.json({
      success: true,
      message: 'Job created successfully',
      data: newJob,
    });
  } catch (error: any) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create job' },
      { status: 500 }
    );
  }
}
