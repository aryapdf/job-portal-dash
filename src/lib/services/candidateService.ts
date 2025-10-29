// path: src/lib/services/candidateService.ts

export const getCandidates = async (jobId: string) => {
  try {
    const response = await fetch(`/api/jobs/manage-candidates?id=${jobId}`, {
      method: 'GET',
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to fetch candidates');
    }

    return result.data;
  } catch (error) {
    console.error('Error getting candidates:', error);
    throw error;
  }
};

export const updateCandidateOrder = async (jobId: string, newOrder: any[]) => {
  try {
    // Map to include order index
    const orderData = newOrder.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    const response = await fetch('/api/jobs/manage-candidates', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateOrder',
        jobId,
        newOrder: orderData,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update order');
    }

    return result;
  } catch (error) {
    console.error('Error updating candidate order:', error);
    throw error;
  }
};

export const updateCandidateStatus = async (
  jobId: string,
  candidateIds: string[],
  status: 'approved' | 'declined' | 'pending'
) => {
  try {
    const response = await fetch('/api/jobs/manage-candidates', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'updateStatus',
        jobId,
        candidateIds,
        status,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update status');
    }

    return result;
  } catch (error) {
    console.error('Error updating candidate status:', error);
    throw error;
  }
};

export const deleteCandidates = async (jobId: string, candidateIds: string[]) => {
  try {
    const response = await fetch('/api/jobs/manage-candidates', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delete',
        jobId,
        candidateIds,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to delete candidates');
    }

    return result;
  } catch (error) {
    console.error('Error deleting candidates:', error);
    throw error;
  }
};