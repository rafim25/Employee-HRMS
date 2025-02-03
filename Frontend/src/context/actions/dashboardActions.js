import { api } from "../../services/api";
import { SET_DASHBOARD_STATS, SET_ERROR } from "../types";

export const fetchDashboardData = async (dispatch) => {
  try {
    const response = await api.get("/api/dashboard/stats");
    const {
      totalUsers,
      totalAdmins,
      totalLoans,
      totalExpenses,
      totalAvailableFunds,
      recentLoans,
      recentTransactions,
      monthlyExpenses,
      monthlyIncome,
    } = response.data;

    // Map recent loans and transactions to include proper user info
    const mappedLoans = recentLoans.map((loan) => ({
      ...loan,
      customerName: loan.user?.username || loan.customer_name,
    }));

    const mappedTransactions = recentTransactions.map((transaction) => ({
      ...transaction,
      customerName: transaction.customer?.username || "Unknown",
    }));

    dispatch({
      type: SET_DASHBOARD_STATS,
      payload: {
        totalCustomers: totalUsers,
        totalAdmins,
        activeLoans: totalLoans,
        totalExpenses,
        totalAvailableFunds,
        recentLoans: mappedLoans,
        recentTransactions: mappedTransactions,
        monthlyExpenses: monthlyExpenses,
        monthlyIncome: monthlyIncome,
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
