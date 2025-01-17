import { authReducer } from "./authReducer";
import { userReducer } from "./userReducer";
import { loanReducer } from "./loanReducer";

export const rootReducer = (state, action) => {
  // First pass the action through the auth reducer
  const authState = authReducer(state, action);

  // Then pass it through the user reducer
  const userState = userReducer(authState, action);

  // Finally pass it through the loan reducer
  // Finally pass it through the loan reducer
  const loanState = loanReducer(userState, action);

  return loanState;
};
