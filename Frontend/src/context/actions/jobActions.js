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

const JOBS_CACHE_KEY = "jobs_list_cache_v2";

const clearJobsCache = () => {
  try {
    localStorage.removeItem("jobs_list_cache_v1");
    localStorage.removeItem(JOBS_CACHE_KEY);
  } catch {
    // ignore
  }
};

const writeCache = (data) => {
  try {
    if (!Array.isArray(data)) return;
    localStorage.setItem(
      JOBS_CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch {
    // ignore
  }
};

const normalizeJobsPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

/**
 * @param {Function} dispatch
 * @param {{ force?: boolean }} [options]
 */
export const fetchJobs = async (dispatch, options = {}) => {
  const { force = true } = options;

  try {
    dispatch({ type: SET_JOB_LOADING, payload: true });
    dispatch({ type: SET_JOB_ERROR, payload: null });

    if (force) clearJobsCache();

    const response = await api.get(JOB_ENDPOINTS.LIST, {
      // bust intermediary / browser caches
      params: force ? { _t: Date.now() } : undefined,
    });

    const jobs = normalizeJobsPayload(response.data);
    dispatch({
      type: SET_JOB_LIST,
      payload: jobs,
    });
    writeCache(jobs);
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    const message =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      "Failed to fetch jobs";
    dispatch({
      type: SET_JOB_ERROR,
      payload: message,
    });
    toast.error(message, { id: "jobs-fetch-error" });
    throw error;
  } finally {
    dispatch({ type: SET_JOB_LOADING, payload: false });
  }
};

export const deleteJob = async (dispatch, jobId) => {
  const loadingToast = toast.loading("Deleting job...", { id: "job-delete" });
  try {
    await api.delete(JOB_ENDPOINTS.DELETE(jobId));
    clearJobsCache();
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
    throw error;
  }
};

export const updateJob = async (dispatch, jobId, data) => {
  const loadingToast = toast.loading("Updating job...");
  try {
    const response = await api.patch(JOB_ENDPOINTS.UPDATE(jobId), data);
    clearJobsCache();
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
    dispatch({ type: SET_JOB_LOADING, payload: true });
    const response = await api.post(JOB_ENDPOINTS.CREATE, jobData);

    clearJobsCache();
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
  } finally {
    dispatch({ type: SET_JOB_LOADING, payload: false });
  }
};

export const fetchJobById = async (dispatch, jobId) => {
  try {
    dispatch({ type: SET_JOB_LOADING, payload: true });
    const response = await api.get(JOB_ENDPOINTS.GET(jobId));
    return response.data;
  } catch (error) {
    dispatch({
      type: SET_JOB_ERROR,
      payload: error.response?.data?.msg || "Failed to fetch job",
    });
    toast.error("Failed to fetch job", { id: "job-fetch-one-error" });
    throw error;
  } finally {
    dispatch({ type: SET_JOB_LOADING, payload: false });
  }
};

export const updateJobStatus = async (dispatch, jobId, status, updatedBy) => {
  try {
    const response = await api.patch(`/api/jobs/${jobId}/status`, {
      status,
      updated_by: updatedBy,
    });

    clearJobsCache();
    dispatch({
      type: UPDATE_JOB,
      payload: response.data.job,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating job status:", error);
    throw error;
  }
};
