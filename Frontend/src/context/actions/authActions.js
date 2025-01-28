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
    console.log("Making login request with credentials:", credentials);
    const response = await api.post(AUTH_ENDPOINTS_V2.LOGIN, credentials);
    console.log("Login API response:", response);

    if (response.data) {
      const userData = response.data;
      console.log("Storing user data:", userData);

      // Store in localStorage first
      localStorage.setItem("user", JSON.stringify(userData));

      // Then update the context
      dispatch({
        type: SET_USER,
        payload: userData,
      });

      return userData;
    } else {
      throw new Error("No data received from login response");
    }
  } catch (error) {
    console.error("Login action error:", error);
    console.error("Error details:", {
      response: error.response,
      message: error.message,
      stack: error.stack,
    });

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
    localStorage.removeItem("user");
    dispatch({ type: CLEAR_USER });
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const getTransactions = async (dispatch, userId) => {
  try {
    const response = await api.get(TRANSACTION_ENDPOINTS.GET_BY_USER(userId));
    dispatch({
      type: SET_TRANSACTIONS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    console.error("Get transactions error:", error);
    throw error;
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
