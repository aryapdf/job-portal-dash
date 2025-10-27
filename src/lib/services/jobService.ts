// File: lib/services/jobService.ts
export interface JobData {
  id?: string;
  jobName: string;
  jobType: string;
  jobDescription: string;
  candidateNumber: number;
  fullNameReq: "mandatory" | "optional" | "off";
  photoProfileReq: "mandatory" | "optional" | "off";
  genderReq: "mandatory" | "optional" | "off";
  domicileReq: "mandatory" | "optional" | "off";
  emailReq: "mandatory" | "optional" | "off";
  phoneNumberReq: "mandatory" | "optional" | "off";
  linkedinReq: "mandatory" | "optional" | "off";
  dateOfBirthReq: "mandatory" | "optional" | "off";
  minSalary: number;
  maxSalary: number;
  status?: "active" | "inactive" | "draft";
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Create a new job
export const createJob = async (jobData: Omit<JobData, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> => {
  try {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to create job');
    }

    console.log('Job created with ID:', result.data.id);
    return result.data.id;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// Get all jobs
export const getAllJobs = async (): Promise<JobData[]> => {
  try {
    const response = await fetch('/api/jobs', {
      method: 'GET',
      cache: 'no-store', // Disable caching untuk data real-time
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to fetch jobs');
    }

    return result.data;
  } catch (error) {
    console.error('Error getting jobs:', error);
    throw error;
  }
};

// Get jobs by status
export const getJobsByStatus = async (status: "active" | "inactive" | "draft"): Promise<JobData[]> => {
  try {
    const response = await fetch(`/api/jobs?status=${status}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to fetch jobs');
    }

    return result.data;
  } catch (error) {
    console.error('Error getting jobs by status:', error);
    throw error;
  }
};

// Update a job
export const updateJob = async (jobId: string, jobData: Partial<JobData>): Promise<void> => {
  try {
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jobData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update job');
    }

    console.log('Job updated successfully');
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

// Delete a job
export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to delete job');
    }

    console.log('Job deleted successfully');
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// Update job status
export const updateJobStatus = async (
  jobId: string,
  status: "active" | "inactive" | "draft"
): Promise<void> => {
  try {
    const response = await fetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update job status');
    }

    console.log('Job status updated successfully');
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error;
  }
};