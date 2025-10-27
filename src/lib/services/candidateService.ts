export const getCandidates = async (jobId:string) => {
  try {
    const response = await fetch(`/api/jobs/manage-job?id=${jobId}`, {
      method: 'GET',
      cache: 'no-store'
    });

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error get job detail :', error)
  }
}