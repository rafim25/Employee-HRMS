// Get persisted user from localStorage
const persistedUser = localStorage.getItem("user");
const parsedUser = persistedUser ? JSON.parse(persistedUser) : null;

export const initialState = {
  user: parsedUser || null,
  error: null,
  loading: false,
  dashboard: {
    activeLoans: 0,
    totalCustomers: 0,
    totalAdmins: 0,
  },
  transactions: [],
  users: [], // regular users
  admins: [], // admin users
  loans: [],
  lendingDetails: {},
  loans: {
    list: [],
    loading: false,
    error: null,
  },
};
