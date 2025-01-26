import React, { createContext, useContext, useReducer } from "react";
import { Toaster } from 'react-hot-toast';
import { dashboardReducer } from './reducers/dashboardReducer';

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token') || null,
  dashboard: {
    totalUsers: 0,
    totalLoans: 0,
    totalLoanAmount: 0,
    totalTransactionAmount: 0,
    recentLoans: [],
    recentTransactions: []
  }
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        dashboard: initialState.dashboard
      };
    case 'SET_DASHBOARD_STATS':
      return {
        ...state,
        dashboard: dashboardReducer(state.dashboard, action)
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    ...initialState,
    isAuthenticated: !!localStorage.getItem('token'),
  });

  console.log("Auth Context State:", state);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
          }
        }}
      />
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;