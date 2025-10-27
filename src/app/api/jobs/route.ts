// File: src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

const JOBS_COLLECTION = 'jobs';

// GET - Get all jobs or filter by status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let q;
    if (status) {
      q = query(
        collection(db, JOBS_COLLECTION),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        collection(db, JOBS_COLLECTION),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const jobs: any[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      jobs.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
      });
    });

    return NextResponse.json({
      success: true,
      data: jobs,
    });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch jobs',
        status: 500
      },
    );
  }
}

// POST - Create a new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['jobName', 'jobType', 'jobDescription', 'candidateNumber'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `${field} is required`,
            status: 400
          },
        );
      }
    }

    const jobData = {
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
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, JOBS_COLLECTION), jobData);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...jobData,
      },
      message: 'Job created successfully',
    });
  } catch (error: any) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create job',
        status: 500
      },
    );
  }
}