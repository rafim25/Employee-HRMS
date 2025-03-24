import { CANDIDATE_TYPES } from '../types/candidateTypes';
import toast from 'react-hot-toast';

export const fetchCandidates = async (dispatch) => {
  dispatch({ type: CANDIDATE_TYPES.SET_CANDIDATE_LOADING, payload: true });
  try {
    const response = await fetch('/api/candidates');
    if (!response.ok) throw new Error('Failed to fetch candidates');
    const data = await response.json();
    
    dispatch({ type: CANDIDATE_TYPES.SET_CANDIDATES, payload: data });
    return data;
  } catch (error) {
    dispatch({ 
      type: CANDIDATE_TYPES.SET_CANDIDATE_ERROR, 
      payload: error.message 
    });
    throw error;
  } finally {
    dispatch({ type: CANDIDATE_TYPES.SET_CANDIDATE_LOADING, payload: false });
  }
};

export const createCandidate = async (dispatch, candidateData) => {
  try {
    const response = await fetch('/api/candidates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(candidateData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'Failed to create candidate');
    }

    const data = await response.json();
    dispatch({ type: CANDIDATE_TYPES.ADD_CANDIDATE, payload: data });
    toast.success('Candidate created successfully');
    return data;
  } catch (error) {
    dispatch({ 
      type: CANDIDATE_TYPES.SET_CANDIDATE_ERROR, 
      payload: error.message 
    });
    toast.error('Failed to create candidate');
    throw error;
  }
};

export const updateCandidateStatus = async (dispatch, candidateId, status) => {
  dispatch({ type: CANDIDATE_TYPES.SET_CANDIDATE_LOADING, payload: true });
  try {
    const response = await fetch(`/api/candidates/${candidateId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error('Failed to update status');
    const data = await response.json();
    
    dispatch({ type: CANDIDATE_TYPES.UPDATE_CANDIDATE, payload: data });
    toast.success('Status updated successfully');
    return data;
  } catch (error) {
    dispatch({ 
      type: CANDIDATE_TYPES.SET_CANDIDATE_ERROR, 
      payload: error.message 
    });
    toast.error('Failed to update status');
    throw error;
  }
};

export const deleteCandidate = async (dispatch, candidateId) => {
  try {
    const response = await fetch(`/api/candidates/${candidateId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete candidate');
    
    dispatch({ type: CANDIDATE_TYPES.DELETE_CANDIDATE, payload: candidateId });
    toast.success('Candidate deleted successfully');
  } catch (error) {
    dispatch({ 
      type: CANDIDATE_TYPES.SET_CANDIDATE_ERROR, 
      payload: error.message 
    });
    toast.error('Failed to delete candidate');
    throw error;
  }
}; 