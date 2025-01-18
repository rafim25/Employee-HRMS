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
    const response = await api.get(DASHBOARD_ENDPOINTS.STATS);

    const { totalUsers, totalAdmins, totalLoans } = response.data;

    dispatch({
      type: SET_DASHBOARD_STATS,
      payload: {
        activeLoans: totalLoans,
        totalCustomers: totalUsers,
        totalAdmins: totalAdmins,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    dispatch({
      type: SET_ERROR,
      payload: "Failed to fetch dashboard statistics",
    });
  }
};
