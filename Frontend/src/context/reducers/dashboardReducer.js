import { SET_DASHBOARD_STATS, SET_ERROR } from "../types";

const initialState = {
  totalCustomers: 0,
  totalAdmins: 0,
  activeLoans: 0,
  totalExpenses: 0,
  totalAvailableFunds: 0,
  recentLoans: [],
  recentTransactions: [],
  error: null,
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_STATS:
      return {
        ...state,
        totalCustomers: action.payload.totalUsers,
        totalAdmins: action.payload.totalAdmins,
        activeLoans: action.payload.totalLoans,
        totalExpenses: action.payload.totalExpenses,
        totalAvailableFunds: action.payload.totalAvailableFunds,
        recentLoans: action.payload.recentLoans || [],
        recentTransactions: action.payload.recentTransactions || [],
        error: null,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default dashboardReducer;
