import { api } from "../../services/api";
import { SKILL_ENDPOINTS } from "../../constants/apiEndpoints";
import toast from "react-hot-toast";
import {
  SET_SKILL_LIST,
  SET_SKILL_LOADING,
  SET_SKILL_ERROR,
  DELETE_SKILL,
  UPDATE_SKILL,
  CREATE_SKILL,
} from "../types";

let isLoading = false;

export const fetchSkills = async (dispatch) => {
  try {
    dispatch({ type: SET_SKILL_LOADING, payload: true });

    const response = await api.get(SKILL_ENDPOINTS.LIST);
    dispatch({
      type: SET_SKILL_LIST,
      payload: response.data,
    });
    toast.success("Skills fetched successfully");
  } catch (error) {
    console.error("Error fetching skills:", error);
    dispatch({
      type: SET_SKILL_ERROR,
      payload: error.response?.data?.msg || "Failed to fetch skills",
    });
    toast.error("Failed to fetch skills");
  } finally {
    dispatch({ type: SET_SKILL_LOADING, payload: false });
  }
};

export const deleteSkill = async (dispatch, skillId) => {
  const loadingToast = toast.loading("Deleting skill...");
  try {
    dispatch({ type: SET_SKILL_LOADING, payload: true });

    await api.delete(SKILL_ENDPOINTS.DELETE(skillId));
    dispatch({
      type: DELETE_SKILL,
      payload: skillId,
    });
    toast.success("Skill deleted successfully", {
      id: loadingToast,
    });
  } catch (error) {
    dispatch({
      type: SET_SKILL_ERROR,
      payload: error.response?.data?.msg || "Failed to delete skill",
    });
    toast.error(error.response?.data?.msg || "Failed to delete skill", {
      id: loadingToast,
    });
  } finally {
    dispatch({ type: SET_SKILL_LOADING, payload: false });
  }
};

export const updateSkill = async (dispatch, skillId, data) => {
  const loadingToast = toast.loading("Updating skill...");
  try {
    const response = await api.patch(SKILL_ENDPOINTS.UPDATE(skillId), data);
    dispatch({
      type: UPDATE_SKILL,
      payload: response.data,
    });
    toast.success("Skill updated successfully", {
      id: loadingToast,
    });
  } catch (error) {
    dispatch({
      type: SET_SKILL_ERROR,
      payload: error.response?.data?.msg || "Failed to update skill",
    });
    toast.error("Failed to update skill", {
      id: loadingToast,
    });
  }
};

export const createSkill = async (dispatch, skillData) => {
  const loadingToast = toast.loading("Creating skill...");
  try {
    dispatch({ type: SET_SKILL_LOADING });
    const response = await api.post(SKILL_ENDPOINTS.CREATE, skillData);

    dispatch({
      type: CREATE_SKILL,
      payload: response.data,
    });

    toast.success("Skill created successfully", {
      id: loadingToast,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: SET_SKILL_ERROR,
      payload: error.response?.data?.msg || "Failed to create skill",
    });
    toast.error(error.response?.data?.msg || "Failed to create skill", {
      id: loadingToast,
    });
    throw error;
  }
};

export const fetchSkillById = async (dispatch, skillId) => {
  const loadingToast = toast.loading("Fetching skill...");
  try {
    dispatch({ type: SET_SKILL_LOADING, payload: true });
    const response = await api.get(SKILL_ENDPOINTS.GET(skillId));
    dispatch({
      type: SET_SKILL_LIST,
      payload: response.data,
    });
    toast.success("Skill fetched successfully", {
      id: loadingToast,
    });
  } catch (error) {
    dispatch({
      type: SET_SKILL_ERROR,
      payload: error.response?.data?.msg || "Failed to fetch skill",
    });
    toast.error("Failed to fetch skill", {
      id: loadingToast,
    });
  } finally {
    dispatch({ type: SET_SKILL_LOADING, payload: false });
  }
};