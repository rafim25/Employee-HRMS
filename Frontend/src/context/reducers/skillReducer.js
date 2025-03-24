import {
  SET_SKILL_LIST,
  SET_SKILL_LOADING,
  SET_SKILL_ERROR,
  DELETE_SKILL,
  UPDATE_SKILL,
} from "../types";

export const skillReducer = (state, action) => {
  switch (action.type) {
    case SET_SKILL_LIST:
      return {
        ...state,
        skills: action.payload,
        loading: false,
        error: null,
      };
    case SET_SKILL_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_SKILL_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case DELETE_SKILL:
      return {
        ...state,
        skills: state.skills.filter(
          (skill) => skill.id !== action.payload
        ),
        loading: false,
      };
    case UPDATE_SKILL:
      return {
        ...state,
        skills: state.skills.map((skill) =>
          skill.id === action.payload.id ? action.payload : skill
        ),
      };
    default:
      return state;
  }
}; 