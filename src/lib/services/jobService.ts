// File: lib/services/jobService.ts
export const createJob = async (jobData:any) => {
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

export const deleteJob = async (id: string) => {
  try {
    const response = await fetch(`/api/jobs?id=${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || "Failed to delete job");
    }

    return result;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};


export const getAllJobs = async () => {
  try {
    const response = await fetch('/api/jobs', {
      method: 'GET',
      cache: 'no-store',
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

export const applyJob = async (jobId:any, data:any) => {
  try {
    const res = await fetch(`/api/jobs/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit application');
    }

    return await res.json();
  } catch (err: any) {
    console.error(err);
    throw err;
  }
}

export const getRequirementsForm = async (jobId:any) => {
  try {
    const response = await fetch(`/api/jobs/application-form?job-id=${jobId}`, {
      method: 'GET',
      cache: 'no-store'
    });

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error get job detail :', error)
  }
}


