import { api } from "../../services/api";
import { USER_ENDPOINTS } from "../../constants/apiEndpoints";
import {
  SET_CUSTOMER_LIST,
  SET_CUSTOMER_LOADING,
  SET_CUSTOMER_ERROR,
  DELETE_CUSTOMER,
  UPDATE_CUSTOMER,
} from "../types";

export const fetchCustomers = async (dispatch) => {
  try {
    dispatch({ type: SET_CUSTOMER_LOADING });
    const response = await api.get(USER_ENDPOINTS.LIST);

    dispatch({
      type: SET_CUSTOMER_LIST,
      payload: response.data,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    dispatch({
      type: SET_CUSTOMER_ERROR,
      payload: error.response?.data?.msg || "Failed to fetch customers",
    });
  }
};

export const deleteCustomer = async (dispatch, userId) => {
  try {
    await api.delete(USER_ENDPOINTS.DELETE(userId));
    dispatch({
      type: DELETE_CUSTOMER,
      payload: userId,
    });
  } catch (error) {
    dispatch({
      type: SET_CUSTOMER_ERROR,
      payload: error.response?.data?.msg || "Failed to delete customer",
    });
  }
};

export const updateCustomer = async (dispatch, userId, data) => {
  try {
    const response = await api.put(USER_ENDPOINTS.UPDATE(userId), data);
    dispatch({
      type: UPDATE_CUSTOMER,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: SET_CUSTOMER_ERROR,
      payload: error.response?.data?.msg || "Failed to update customer",
    });
  }
};
