import { api } from "../../utils/axios";
import { USER_ENDPOINTS } from "../../constants/apiEndpoints";
import toast from "react-hot-toast";
import {
  SET_USER_LIST,
  SET_USER_LOADING,
  SET_USER_ERROR,
  DELETE_USER,
  UPDATE_USER,
  CREATE_USER,
} from "../types";

let isLoading = false;

export const fetchUsers = async (dispatch) => {
  if (isLoading) return;

  try {
    isLoading = true;
    dispatch({ type: SET_USER_LOADING, payload: true });

    const response = await api.get(USER_ENDPOINTS.LIST);
    dispatch({
      type: SET_USER_LIST,
      payload: response.data,
    });
    toast.success("Users fetched successfully");
  } catch (error) {
    console.error("Error fetching users:", error);
    dispatch({
      type: SET_USER_ERROR,
      payload: error.response?.data?.msg || "Failed to fetch users",
    });
    toast.error("Failed to fetch users");
  } finally {
    isLoading = false;
    dispatch({ type: SET_USER_LOADING, payload: false });
  }
};

export const deleteUser = async (dispatch, userId) => {
  const loadingToast = toast.loading("Deleting user...");
  try {
    await api.delete(USER_ENDPOINTS.DELETE(userId));
    dispatch({
      type: DELETE_USER,
      payload: userId,
    });
    toast.success("User deleted successfully", {
      id: loadingToast,
    });
  } catch (error) {
    dispatch({
      type: SET_USER_ERROR,
      payload: error.response?.data?.msg || "Failed to delete user",
    });
    toast.error("Failed to delete user", {
      id: loadingToast,
    });
  }
};

export const updateUser = async (dispatch, userId, data) => {
  const loadingToast = toast.loading("Updating user...");
  try {
    const response = await api.put(USER_ENDPOINTS.UPDATE(userId), data);
    dispatch({
      type: UPDATE_USER,
      payload: response.data,
    });
    toast.success("User updated successfully", {
      id: loadingToast,
    });
  } catch (error) {
    dispatch({
      type: SET_USER_ERROR,
      payload: error.response?.data?.msg || "Failed to update user",
    });
    toast.error("Failed to update user", {
      id: loadingToast,
    });
  }
};

export const createUser = async (dispatch, userData) => {
  const loadingToast = toast.loading("Creating user...");
  try {
    dispatch({ type: SET_USER_LOADING });
    const response = await api.post(USER_ENDPOINTS.CREATE, userData);

    dispatch({
      type: CREATE_USER,
      payload: response.data,
    });

    toast.success("User created successfully", {
      id: loadingToast,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: SET_USER_ERROR,
      payload: error.response?.data?.msg || "Failed to create user",
    });
    toast.error(error.response?.data?.msg || "Failed to create user", {
      id: loadingToast,
    });
    throw error;
  }
};
