import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('/api/candidates');
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Failed to fetch candidates');
    }
  };

  const handleStatusUpdate = async (uuid, newStatus) => {
    try {
      const response = await axios.patch(
        `/api/candidates/${uuid}/status`,
        { status: newStatus }
      );

      setCandidates(candidates.map(candidate =>
        candidate.uuid === uuid
          ? { ...candidate, status: response.data.status }
          : candidate
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      {candidates.map(candidate => (
        <div key={candidate.uuid}>
          {/* ... other fields ... */}
          <div>
            Status: {candidate.status || candidate.application_status}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CandidateList; 