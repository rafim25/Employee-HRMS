import { api } from "../../services/api";
import {
  SET_USER,
  CLEAR_USER,
  SET_ERROR,
  SET_TRANSACTIONS,
  SET_LENDING_DETAILS,
} from "../types";

import {
  AUTH_ENDPOINTS_V2,
  TRANSACTION_ENDPOINTS,
} from "../../constants/apiEndpoints";

export const loginUser = async (dispatch, credentials) => {
  try {
    const response = await api.post(AUTH_ENDPOINTS_V2.LOGIN, credentials);

    if (response.data) {
      if (!response.data.token) {
        throw new Error("No token received from server");
      }

      const userData = {
        user: {
          email: response.data.email,
          username: response.data.username,
          role: response.data.role,
          permissions: response.data.permissions,
          user_id: response.data.user_id,
        },
        token: response.data.token,
      };

      // Store token separately
      localStorage.setItem("token", response.data.token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: userData,
      });

      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true };
    }
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: error.response?.data?.msg || "Login failed",
    });
    throw error;
  }
};

export const logoutUser = async (dispatch) => {
  try {
    await api.post(AUTH_ENDPOINTS_V2.LOGOUT);
    // Clear all local storage items
    localStorage.clear();
    // Clear session storage if any
    sessionStorage.clear();
    // Dispatch logout action
    dispatch({ type: "LOGOUT" });
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    // Still clear storage and dispatch logout even if API call fails
    localStorage.clear();
    sessionStorage.clear();
    dispatch({ type: "LOGOUT" });
    return { success: true };
  }
};

export const getTransactions = async (dispatch, userId) => {
  try {
    const response = await api.get(TRANSACTION_ENDPOINTS.GET_BY_USER(userId));
    dispatch({
      type: SET_TRANSACTIONS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: "Failed to fetch transactions",
    });
  }
};

export const getLendingDetails = async (dispatch, userId) => {
  try {
    const response = await api.get(
      TRANSACTION_ENDPOINTS.GET_LENDING_DETAILS(userId)
    );
    dispatch({
      type: SET_LENDING_DETAILS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: SET_ERROR,
      payload: "Failed to fetch lending details",
    });
  }
};
