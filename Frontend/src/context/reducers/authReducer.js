import {
  SET_USER,
  CLEAR_USER,
  SET_TRANSACTIONS,
  SET_LENDING_DETAILS,
  SET_ERROR,
  CLEAR_ERROR,
  SET_USERS,
  SET_ADMINS,
  SET_LOANS,
  SET_ADMIN_COUNT,
  SET_USER_COUNT,
  SET_DASHBOARD_STATS,
} from "../types";

export const authReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case SET_DASHBOARD_STATS:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          activeLoans: action.payload.activeLoans,
          totalCustomers: action.payload.totalCustomers,
          totalAdmins: action.payload.totalAdmins,
        },
      };
    case SET_USER_COUNT:
      return {
        ...state,
        userCount: action.payload,
        error: null,
      };
    case CLEAR_USER:
      return {
        ...state,
        user: null,
        transactions: [],
        lendingDetails: {},
      };
    case SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
      };
    case SET_LENDING_DETAILS:
      return {
        ...state,
        lendingDetails: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case SET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case SET_ADMIN_COUNT:
      return {
        ...state,
        adminCount: action.payload,
      };
    case SET_LOANS:
      return {
        ...state,
        loans: action.payload,
      };
    default:
      return state;
  }
};
