import { api } from "../../services/api";
import { JOB_ENDPOINTS } from "../../constants/apiEndpoints";
import toast from "react-hot-toast";
import {
  SET_JOB_LIST,
  SET_JOB_LOADING,
  SET_JOB_ERROR,
  DELETE_JOB,
  UPDATE_JOB,
  CREATE_JOB,
} from "../types";

let isLoading = false;

export const fetchJobs = async (dispatch) => {
  if (isLoading) return;

  try {
    isLoading = true;
    dispatch({ type: SET_JOB_LOADING, payload: true });

    const response = await api.get(JOB_ENDPOINTS.LIST);
    dispatch({
      type: SET_JOB_LIST,
      payload: response.data,
    });
    toast.success("Jobs fetched successfully");
  } catch (error) {
    console.error("Error fetching jobs:", error);
    dispatch({
      type: SET_JOB_ERROR,
      payload: error.response?.data?.msg || "Failed to fetch jobs",
    });
    toast.error("Failed to fetch jobs");
  } finally {
    isLoading = false;
    dispatch({ type: SET_JOB_LOADING, payload: false });
  }
};

export const deleteJob = async (dispatch, jobId) => {
  const loadingToast = toast.loading("Deleting job...");
  try {
    await api.delete(JOB_ENDPOINTS.DELETE(jobId));
    dispatch({
      type: DELETE_JOB,
      payload: jobId,
    });
    toast.success("Job deleted successfully", {
      id: loadingToast,
    });
  } catch (error) {
    dispatch({
      type: SET_JOB_ERROR,
      payload: error.response?.data?.msg || "Failed to delete job",
    });
    toast.error(error.response?.data?.msg || "Failed to delete job", {
      id: loadingToast,
    });
  }
};

export const updateJob = async (dispatch, jobId, data) => {
  const loadingToast = toast.loading("Updating job...");
  try {
    const response = await api.patch(JOB_ENDPOINTS.UPDATE(jobId), data);
    dispatch({
      type: UPDATE_JOB,
      payload: response.data,
    });
    toast.success("Job updated successfully", {
      id: loadingToast,
    });
  } catch (error) {
    dispatch({
      type: SET_JOB_ERROR,
      payload: error.response?.data?.msg || "Failed to update job",
    });
    toast.error("Failed to update job", {
      id: loadingToast,
    });
  }
};

export const createJob = async (dispatch, jobData) => {
  const loadingToast = toast.loading("Creating job...");
  try {
    dispatch({ type: SET_JOB_LOADING });
    const response = await api.post(JOB_ENDPOINTS.CREATE, jobData);

    dispatch({
      type: CREATE_JOB,
      payload: response.data,
    });

    toast.success("Job created successfully", {
      id: loadingToast,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: SET_JOB_ERROR,
      payload: error.response?.data?.msg || "Failed to create job",
    });
    toast.error(error.response?.data?.msg || "Failed to create job", {
      id: loadingToast,
    });
    throw error;
  }
};

export const fetchJobById = async (dispatch, jobId) => {
  const loadingToast = toast.loading("Fetching job...");
  try {
    dispatch({ type: SET_JOB_LOADING, payload: true });
    const response = await api.get(JOB_ENDPOINTS.GET(jobId));
    dispatch({
      type: SET_JOB_LIST,
      payload: response.data,
    });
    toast.success("Job fetched successfully", {
      id: loadingToast,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: SET_JOB_ERROR,
      payload: error.response?.data?.msg || "Failed to fetch job",
    });
    toast.error("Failed to fetch job", {
      id: loadingToast,
    });
  } finally {
    dispatch({ type: SET_JOB_LOADING, payload: false });
  }
};

export const updateJobStatus = async (dispatch, jobId, status, updatedBy) => {
  try {
    const response = await api.patch(`/api/jobs/${jobId}/status`, {
      status,
      updated_by: updatedBy
    });

    dispatch({
      type: UPDATE_JOB,
      payload: response.data.job
    });

    return response.data;
  } catch (error) {
    console.error('Error updating job status:', error);
    throw error;
  }
};