import { api } from "../../services/api";
import { DASHBOARD_ENDPOINTS } from "../../constants/apiEndpoints";
import {
  SET_USER_COUNT,
  SET_ADMIN_COUNT,
  SET_ADMINS,
  SET_LOANS,
  SET_ERROR,
  SET_DASHBOARD_STATS,
} from "../types";

// export const fetchDashboardData = async (dispatch) => {
//   try {
//     const response = await api.get(DASHBOARD_ENDPOINTS.STATS);
//     const { totalUsers, totalAdmins, totalLoans } = response.data;

//     dispatch({
//       type: SET_USER_COUNT,
//       payload: totalUsers,
//     });

//     dispatch({
//       type: SET_ADMIN_COUNT,
//       payload: totalAdmins,
//     });

//     dispatch({
//       type: SET_LOANS,
//       payload: totalLoans,
//     });
//   } catch (error) {
//     console.error("Dashboard data fetch error:", error);
//     dispatch({
//       type: SET_ERROR,
//       payload: "Failed to fetch dashboard data",
//     });
//   }
// };

export const fetchDashboardData = async (dispatch) => {
  try {
    const response = await api.get("/api/dashboard/stats");
    console.log("API Response:", response.data);

    // Transform the data to match our needs
    const dashboardData = {
      totalUsers: parseInt(response.data.totalUsers) || 0,
      totalAdmins: parseInt(response.data.totalAdmins) || 0,
      totalLoans: parseInt(response.data.totalLoans) || 0,
      totalLoanAmount: parseFloat(response.data.totalLoanAmount) || 0,
      totalTransactionAmount:
        parseFloat(response.data.totalTransactionAmount) || 0,
      recentLoans: response.data.recentLoans || [],
      recentTransactions: response.data.recentTransactions || [],
    };

    console.log("Transformed Dashboard Data:", dashboardData);

    dispatch({
      type: SET_DASHBOARD_STATS,
      payload: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    dispatch({
      type: SET_ERROR,
      payload: "Failed to fetch dashboard data",
    });
  }
};
