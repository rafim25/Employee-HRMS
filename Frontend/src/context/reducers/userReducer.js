import {
  SET_USER_LIST,
  SET_USER_LOADING,
  SET_USER_ERROR,
  DELETE_USER,
  UPDATE_USER,
  CREATE_USER,
} from "../types";

export const userReducer = (state, action) => {
  switch (action.type) {
    case CREATE_USER:
      return {
        ...state,
        users: [...state.users, action.payload],
        loading: false,
        error: null,
      };
    case SET_USER_LIST:
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: null,
      };
    case SET_USER_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_USER_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter((user) => user.user_id !== action.payload),
        loading: false,
      };
    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user.user_id === action.payload.user_id ? action.payload : user
        ),
        loading: false,
      };
    default:
      return state;
  }
};
