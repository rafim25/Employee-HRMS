import { SET_DASHBOARD_STATS } from "../types";

const initialState = {
  totalUsers: 0,
  totalAdmins: 0,
  totalLoans: 0,
  totalLoanAmount: 0,
  totalTransactionAmount: 0,
  recentLoans: [],
  recentTransactions: [],
};

export const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_STATS:
      console.log("Reducer Previous State:", state);
      console.log("Reducer Action:", action);

      const newState = {
        ...state,
        totalUsers: parseInt(action.payload.totalUsers) || 0,
        totalAdmins: parseInt(action.payload.totalAdmins) || 0,
        totalLoans: parseInt(action.payload.totalLoans) || 0,
        totalLoanAmount: parseFloat(action.payload.totalLoanAmount) || 0,
        totalTransactionAmount:
          parseFloat(action.payload.totalTransactionAmount) || 0,
        recentLoans: action.payload.recentLoans || [],
        recentTransactions: action.payload.recentTransactions || [],
      };

      console.log("Reducer New State:", newState);
      return newState;

    default:
      return state;
  }
};
