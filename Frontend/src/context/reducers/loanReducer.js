import {
  SET_LOAN_LIST,
  SET_LOAN_LOADING,
  SET_LOAN_ERROR,
  CREATE_LOAN,
  UPDATE_LOAN,
  DELETE_LOAN,
} from "../types";

const initialLoanState = {
  list: [],
  loading: false,
  error: null,
};

export const loanReducer = (state, action) => {
  switch (action.type) {
    case SET_LOAN_LOADING:
      return {
        ...state,
        loans: {
          ...(state.loans || initialLoanState),
          loading: action.payload,
        },
      };

    case SET_LOAN_LIST:
      return {
        ...state,
        loans: {
          ...(state.loans || initialLoanState),
          list: action.payload.map((loan) => ({
            ...loan,
            loan_amount: parseFloat(loan.loan_amount),
            remaining_balance: parseFloat(loan.remaining_balance),
            interest_amount: parseFloat(loan.loan_amount) * 0.01,
          })),
          loading: false,
          error: null,
        },
      };

    case SET_LOAN_ERROR:
      return {
        ...state,
        loans: {
          ...(state.loans || initialLoanState),
          error: action.payload,
          loading: false,
        },
      };

    case CREATE_LOAN:
      return {
        ...state,
        loans: {
          ...(state.loans || initialLoanState),
          list: [...(state.loans?.list || []), action.payload],
          loading: false,
          error: null,
        },
      };

    case UPDATE_LOAN:
      return {
        ...state,
        loans: {
          ...(state.loans || initialLoanState),
          list:
            state.loans?.list?.map((loan) =>
              loan.loan_id === action.payload.loan_id ? action.payload : loan
            ) || [],
          loading: false,
          error: null,
        },
      };

    case DELETE_LOAN:
      return {
        ...state,
        loans: {
          ...(state.loans || initialLoanState),
          list:
            state.loans?.list?.filter(
              (loan) => loan.loan_id !== action.payload
            ) || [],
          loading: false,
          error: null,
        },
      };

    default:
      return state;
  }
};
