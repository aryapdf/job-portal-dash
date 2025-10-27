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

export const createJob = async (jobData) => {
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

export const getAllJobs = async () => {
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

export const getJobDetail = async (id: string) => {
  try {
    const response = await fetch(`/api/jobs?id=${id}`, {
      method: 'GET',
      cache: 'no-store'
    });

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error get job detail :', error)
  }
}

