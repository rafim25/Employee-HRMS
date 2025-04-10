const handleStatusChange = async (candidateId, newStatus) => {
  try {
    const response = await axios.patch(`/api/candidates/${candidateId}/status`, {
      status: newStatus,
      changed_by: currentUser.user_id, // Make sure you have access to the current user
      notes: 'Status updated by user' // Optional notes
    });

    if (response.data.message === "Status updated successfully") {
      toast.success('Status updated successfully');
      // Update your UI accordingly
    }
  } catch (error) {
    console.error('Error updating status:', error);
    toast.error(error.response?.data?.message || 'Failed to update status');
  }
}; 