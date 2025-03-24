import { authReducer } from "./authReducer";
import { userReducer } from "./userReducer";
import { loanReducer } from "./loanReducer";
import { jobReducer } from "./jobReducer";
import { skillReducer } from "./skillReducer";
import { candidateReducer } from "./candidateReducer";

export const rootReducer = (state, action) => {
  // First pass the action through the auth reducer
  const authState = authReducer(state, action);

  // Then pass it through the user reducer
  const userState = userReducer(authState, action);

  // Pass it through the loan reducer
  const loanState = loanReducer(userState, action);

  // Pass the action through the job reducer
  const jobState = jobReducer(loanState, action);

  // Pass the action through the skill reducer
  const skillState = skillReducer(jobState, action);

  // Finally pass it through the candidate reducer
  const candidateState = candidateReducer(skillState, action);

  return candidateState;
};
