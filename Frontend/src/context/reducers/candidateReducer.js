import { CANDIDATE_TYPES } from '../types/candidateTypes';

export const candidateReducer = (state, action) => {
  switch (action.type) {
    case CANDIDATE_TYPES.SET_CANDIDATES:
      return {
        ...state,
        candidates: action.payload,
        candidateError: null,
        candidateLoading: false
      };

    case CANDIDATE_TYPES.SET_CANDIDATE_LOADING:
      return {
        ...state,
        candidateLoading: action.payload
      };

    case CANDIDATE_TYPES.SET_CANDIDATE_ERROR:
      return {
        ...state,
        candidateError: action.payload,
        candidateLoading: false
      };

    case CANDIDATE_TYPES.ADD_CANDIDATE:
      return {
        ...state,
        candidates: [...state.candidates, action.payload],
        candidateError: null,
        candidateLoading: false
      };

    case CANDIDATE_TYPES.UPDATE_CANDIDATE:
      return {
        ...state,
        candidates: state.candidates.map(candidate =>
          candidate.id === action.payload.id ? action.payload : candidate
        ),
        candidateError: null,
        candidateLoading: false
      };

    case CANDIDATE_TYPES.DELETE_CANDIDATE:
      return {
        ...state,
        candidates: state.candidates.filter(
          candidate => candidate.id !== action.payload
        ),
        candidateError: null,
        candidateLoading: false
      };

    case CANDIDATE_TYPES.SET_CURRENT_CANDIDATE:
      return {
        ...state,
        currentCandidate: action.payload,
        candidateError: null
      };

    case CANDIDATE_TYPES.CLEAR_CURRENT_CANDIDATE:
      return {
        ...state,
        currentCandidate: null,
        candidateError: null
      };

    default:
      return state;
  }
}; 