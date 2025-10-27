import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const JOBS_FILE_PATH = path.join(process.cwd(), 'data', 'jobs.json');

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const data = await fs.readFile(JOBS_FILE_PATH, 'utf-8');
    const jobs = JSON.parse(data || '[]');
    const job = Array.isArray(jobs) && jobs.find((j: any) => j.id === id)

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error: any) {
    console.error('Error fetching job detail:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch job detail' },
      { status: 500 }
    );
  }
}
