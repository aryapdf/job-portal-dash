// path: src/app/api/jobs/manage-candidates/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const APPS_PATH = path.join(process.cwd(), 'data', 'applications.json');
const JOBS_PATH = path.join(process.cwd(), 'data', 'jobs.json');

// GET - Fetch candidates for a job
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

    const selectedJob = jobs.find((job: any) => job.id === id);
    if (!selectedJob) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      );
    }

    const candidates = applications
      .filter((candidate: any) => candidate.jobId === id)
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    const response = {
      jobName: selectedJob.jobName,
      candidates: candidates
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error: any) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}

// PATCH - Update order, status, or delete candidates
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { action, jobId, candidateIds, status, newOrder } = body;

    if (!action || !jobId) {
      return NextResponse.json(
        { success: false, error: "Action and jobId are required" },
        { status: 400 }
      );
    }

    const dataApplications = await fs.readFile(APPS_PATH, "utf-8");
    let applications = JSON.parse(dataApplications || "[]");

    switch (action) {
      case 'updateOrder': {
        if (!newOrder || !Array.isArray(newOrder)) {
          return NextResponse.json(
            { success: false, error: "newOrder array is required" },
            { status: 400 }
          );
        }

        // Update order for each candidate
        applications = applications.map((app: any) => {
          if (app.jobId === jobId) {
            const newOrderItem = newOrder.find((item: any) => item.id === app.id);
            if (newOrderItem) {
              return { ...app, order: newOrderItem.order };
            }
          }
          return app;
        });

        await fs.writeFile(APPS_PATH, JSON.stringify(applications, null, 2));
        return NextResponse.json({
          success: true,
          message: 'Order updated successfully'
        });
      }

      case 'updateStatus': {
        if (!candidateIds || !Array.isArray(candidateIds) || !status) {
          return NextResponse.json(
            { success: false, error: "candidateIds array and status are required" },
            { status: 400 }
          );
        }

        if (!['approved', 'declined', 'pending'].includes(status)) {
          return NextResponse.json(
            { success: false, error: "Invalid status. Must be 'approved', 'declined', or 'pending'" },
            { status: 400 }
          );
        }

        // Update status for selected candidates
        applications = applications.map((app: any) => {
          if (candidateIds.includes(app.id) && app.jobId === jobId) {
            return { ...app, status };
          }
          return app;
        });

        await fs.writeFile(APPS_PATH, JSON.stringify(applications, null, 2));
        return NextResponse.json({
          success: true,
          message: `Status updated to ${status} for ${candidateIds.length} candidate(s)`
        });
      }

      case 'delete': {
        if (!candidateIds || !Array.isArray(candidateIds)) {
          return NextResponse.json(
            { success: false, error: "candidateIds array is required" },
            { status: 400 }
          );
        }

        // Filter out deleted candidates
        const beforeCount = applications.length;
        applications = applications.filter(
          (app: any) => !(candidateIds.includes(app.id) && app.jobId === jobId)
        );
        const deletedCount = beforeCount - applications.length;

        // Reorder remaining candidates for this job
        const jobCandidates = applications
          .filter((app: any) => app.jobId === jobId)
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

        // Reassign order sequentially
        jobCandidates.forEach((candidate: any, index: number) => {
          const appIndex = applications.findIndex((app: any) => app.id === candidate.id);
          if (appIndex !== -1) {
            applications[appIndex].order = index + 1;
          }
        });

        await fs.writeFile(APPS_PATH, JSON.stringify(applications, null, 2));
        return NextResponse.json({
          success: true,
          message: `${deletedCount} candidate(s) deleted successfully`
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action. Must be 'updateOrder', 'updateStatus', or 'delete'" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Error managing candidates:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to manage candidates" },
      { status: 500 }
    );
  }
}