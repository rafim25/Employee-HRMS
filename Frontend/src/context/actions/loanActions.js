import { api } from "../../services/api";
import { LOAN_ENDPOINTS } from "../../constants/apiEndpoints";
import toast from "react-hot-toast";
import {
  SET_LOAN_LIST,
  SET_LOAN_LOADING,
  SET_LOAN_ERROR,
  CREATE_LOAN,
  UPDATE_LOAN,
  DELETE_LOAN,
} from "../types";

let isLoading = false;

export const fetchLoans = async (dispatch) => {
  if (isLoading) return;

  try {
    isLoading = true;
    dispatch({ type: SET_LOAN_LOADING, payload: true });

    const response = await api.get(LOAN_ENDPOINTS.LIST);
    dispatch({
      type: SET_LOAN_LIST,
      payload: response.data,
    });

    toast.success("Purchase fetched successfully");
  } catch (error) {
    console.error("Error fetching purchase:", error);
    dispatch({
      type: SET_LOAN_ERROR,
      payload: error.response?.data?.message || "Failed to fetch purchase",
    });
    toast.error("Failed to fetch purchase");
  } finally {
    isLoading = false;
    dispatch({ type: SET_LOAN_LOADING, payload: false });
  }
};

export const createLoan = async (dispatch, loanData) => {
  const loadingToast = toast.loading("Creating loan...");
  try {
    const response = await api.post(LOAN_ENDPOINTS.CREATE, loanData);

    dispatch({
      type: CREATE_LOAN,
      payload: response.data,
    });

    toast.success("Loan created successfully", {
      id: loadingToast,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: SET_LOAN_ERROR,
      payload: error.response?.data?.msg || "Failed to create loan",
    });
    toast.error(error.response?.data?.msg || "Failed to create loan", {
      id: loadingToast,
    });
    throw error;
  }
};

export const updateLoan = async (dispatch, loanId, data) => {
  const loadingToast = toast.loading("Updating loan...");
  try {
    // Calculate the remaining balance based on loan amount and advance amount
    const updatedData = {
      ...data,
      remaining_balance: data.loan_amount - data.advance_amount,
    };

    const response = await api.put(LOAN_ENDPOINTS.UPDATE(loanId), updatedData);

    dispatch({
      type: UPDATE_LOAN,
      payload: response.data.loan,
    });

    toast.success("Loan updated successfully", {
      id: loadingToast,
    });

    return response.data;
  } catch (error) {
    dispatch({
      type: SET_LOAN_ERROR,
      payload: error.response?.data?.msg || "Failed to update loan",
    });
    toast.error(error.response?.data?.msg || "Failed to update loan", {
      id: loadingToast,
    });
    throw error;
  }
};

export const deleteLoan = async (dispatch, loanId) => {
  const loadingToast = toast.loading("Deleting loan...");
  try {
    await api.delete(LOAN_ENDPOINTS.DELETE(loanId));
    dispatch({
      type: DELETE_LOAN,
      payload: loanId,
    });
    toast.success("Loan deleted successfully", {
      id: loadingToast,
    });
  } catch (error) {
    dispatch({
      type: SET_LOAN_ERROR,
      payload: error.response?.data?.msg || "Failed to delete Purchase",
    });
    toast.error(error.response?.data?.msg || "Failed to delete purchase", {
      id: loadingToast,
    });
  }
};
