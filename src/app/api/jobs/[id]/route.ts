// File: src/app/api/jobs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const JOBS_COLLECTION = 'jobs';

// PATCH - Update a job
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job ID is required',
          status: 400
        },
      );
    }

    const jobRef = doc(db, JOBS_COLLECTION, id);
    const updateData = {
      ...body,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(jobRef, updateData);

    return NextResponse.json({
      success: true,
      data: {
        id,
        ...updateData,
      },
      message: 'Job updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update job',
        status: 500
      },
    );
  }
}

// DELETE - Delete a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job ID is required',
          status: 400
        },
      );
    }

    const jobRef = doc(db, JOBS_COLLECTION, id);
    await deleteDoc(jobRef);

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete job',
        status: 500
      },
    );
  }
}