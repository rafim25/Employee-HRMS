import {
  SET_JOB_LIST,
  SET_JOB_LOADING,
  SET_JOB_ERROR,
  DELETE_JOB,
  UPDATE_JOB,
} from "../types";

export const jobReducer = (state, action) => {
  switch (action.type) {
    case SET_JOB_LIST:
      return {
        ...state,
        jobs: action.payload,
        loading: false,
        error: null,
      };
    case SET_JOB_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_JOB_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case DELETE_JOB:
      return {
        ...state,
        jobs: state.jobs.filter(
          (job) => job.id !== action.payload
        ),
      };
      case 'SET_JOBS':
        return {
          ...state,
          jobs: Array.isArray(action.payload) ? action.payload : [],
          loading: false
        };
      case 'UPDATE_JOB':
        return {
          ...state,
          jobs: Array.isArray(state.jobs) 
            ? state.jobs.map(job => 
                job.id === action.payload.id ? action.payload : job
              )
            : [action.payload]
        };
    default:
      return state;
  }
}; 