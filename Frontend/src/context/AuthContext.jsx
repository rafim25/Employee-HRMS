import React, { createContext, useContext, useReducer } from "react";
import { rootReducer } from "./reducers/rootReducer";
import { initialState } from "./initialState";
import { Toaster } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  // Memoize the context value
  const contextValue = React.useMemo(() => ({
    state,
    dispatch
  }), [state]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          success: {
            style: {
              background: '#28a745',
            },
          },
          error: {
            style: {
              background: '#dc3545',
            },
            duration: 4000,
          },
        }}
      />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};