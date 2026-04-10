import { api } from "../../services/api";
import { SET_DASHBOARD_STATS, SET_ERROR, SET_RECRUITMENT_DASHBOARD } from "../types";

const RECRUITMENT_DASHBOARD_CACHE_KEY = "recruitment_dashboard_cache_v1";
const DASHBOARD_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 1 day

const readCache = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeCache = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

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

export const fetchRecruitmentDashboardData = async (dispatch) => {
  try {
    const cached = readCache(RECRUITMENT_DASHBOARD_CACHE_KEY);
    if (cached?.timestamp && Date.now() - cached.timestamp < DASHBOARD_CACHE_TTL_MS && cached.data) {
      dispatch({
        type: SET_RECRUITMENT_DASHBOARD,
        payload: cached.data,
      });
      return;
    }

    const response = await api.get("/api/dashboard/recruitment");
    const {
      activeJobs,
      totalCandidates,
      selectedCandidates,
      rejectedCandidates,
      candidateStatusData,
      sourceDistribution,
      recentActivities,
    } = response.data;

    const payload = {
      activeJobs,
      totalCandidates,
      selectedCandidates,
      rejectedCandidates,
      candidateStatusData,
      sourceDistribution,
      recentActivities,
    };

    dispatch({
      type: SET_RECRUITMENT_DASHBOARD,
      payload,
    });

    writeCache(RECRUITMENT_DASHBOARD_CACHE_KEY, { timestamp: Date.now(), data: payload });
  } catch (error) {
    console.error("Error fetching recruitment dashboard stats:", error);
    dispatch({
      type: SET_ERROR,
      payload: "Failed to fetch recruitment dashboard statistics",
    });
  }
};
