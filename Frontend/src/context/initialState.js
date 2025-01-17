export const initialState = {
  dashboard: {
    activeLoans: 0,
    totalCustomers: 0,
    totalAdmins: 0,
  },
  user: {
    id_employee: null,
    name_employee: "",
    username: "",
    access_rights: "",
  },
  transactions: [],
  users: [], // regular users
  admins: [], // admin users
  loans: [],
  lendingDetails: {},
  error: null,
  loading: false,
  loans: {
    list: [],
    loading: false,
    error: null,
  },
};
