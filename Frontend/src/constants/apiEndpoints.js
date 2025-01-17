// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
};

export const AUTH_ENDPOINTS_V2 = {
  LOGIN: "/v2/login",
  LOGOUT: "/v2/logout",
  ME: "/v2/me",
};

// User/Customer endpoints
export const USER_ENDPOINTS = {
  LIST: "/users",
  DETAILS: (userId) => `/users/${userId}`,
  CREATE: "/users",
  UPDATE: (userId) => `/users/${userId}`,
  DELETE: (userId) => `/users/${userId}`,
  FILTER_BY_ROLE: (role) => `/users/filter?role=${role}`,
};

// Dashboard endpoints
export const DASHBOARD_ENDPOINTS = {
  STATS: "/dashboard/stats",
  TRANSACTIONS: "/transactions",
  LOANS: "/loans",
};

// Other endpoints can be added here as needed
export const LOAN_ENDPOINTS = {
  LIST: "/loans",
  CREATE: "/loans",
  UPDATE: (id) => `/loans/${id}`,
  DELETE: (id) => `/loans/${id}`,
  DETAILS: (id) => `/loans/${id}`,
  ADD_TRANSACTION: (id) => `/loans/${id}/transactions`,
  GET_TRANSACTIONS: (id) => `/transactions/${id}`,
  GET_LOAN_TRASACTIONS: (id) => `/loan-transactions/${id}`,
};
