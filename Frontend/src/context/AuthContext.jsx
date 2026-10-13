import React, { createContext, useContext, useReducer } from "react";
import { rootReducer } from "./reducers/rootReducer";
import { initialState } from "./initialState";
import AppToaster from "../components/molecules/AppToaster";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  const contextValue = React.useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      <AppToaster />
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
