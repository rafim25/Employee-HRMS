// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  ME: "/api/auth/me",
};

export const AUTH_ENDPOINTS_V2 = {
  LOGIN: "/api/v2/login",
  LOGOUT: "/api/v2/logout",
  ME: "/api/v2/me",
};

// User/Customer endpoints
export const USER_ENDPOINTS = {
  LIST: "/api/users",
  DETAILS: (id) => `/api/users/${id}`,
  CREATE: "/api/users",
  UPDATE: (id) => `/api/users/${id}`,
  DELETE: (id) => `/api/users/${id}`,
  FILTER_BY_ROLE: (role) => `/api/users/filter?role=${role}`,
};

// Dashboard endpoints
export const DASHBOARD_ENDPOINTS = {
  STATS: "/api/dashboard/stats",
  TRANSACTIONS: "/api/transactions",
  LOANS: "/api/loans",
};

// Other endpoints can be added here as needed
export const LOAN_ENDPOINTS = {
  LIST: "/api/loans",
  CREATE: "/api/loans",
  UPDATE: (id) => `/api/loans/${id}`,
  DELETE: (id) => `/api/loans/${id}`,
  DETAILS: (id) => `/api/loans/${id}`,
  ADD_TRANSACTION: (id) => `/api/loans/${id}/transactions`,
  GET_TRANSACTIONS: (id) => `/api/transactions/${id}`,
  GET_LOAN_TRASACTIONS: (id) => `/api/loan-transactions/${id}`,
};

export const TRANSACTION_ENDPOINTS = {
  LIST: "/api/transactions",
  CREATE: "/api/transactions",
  GET_BY_USER: (userId) => `/api/transactions/${userId}`,
  GET_LENDING_DETAILS: (userId) => `/api/lending-details/${userId}`,
};
