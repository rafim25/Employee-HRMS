import {
  SET_CUSTOMER_LIST,
  SET_CUSTOMER_LOADING,
  SET_CUSTOMER_ERROR,
  DELETE_CUSTOMER,
  UPDATE_CUSTOMER,
} from "../types";

export const customerReducer = (state, action) => {
  switch (action.type) {
    case SET_CUSTOMER_LIST:
      return {
        ...state,
        customers: action.payload,
        loading: false,
        error: null,
      };
    case SET_CUSTOMER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case SET_CUSTOMER_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(
          (customer) => customer.user_id !== action.payload
        ),
      };
    case UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.user_id === action.payload.user_id ? action.payload : customer
        ),
      };
    default:
      return state;
  }
};