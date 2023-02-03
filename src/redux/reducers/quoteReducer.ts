import { HYDRATE } from "next-redux-wrapper";
import { IActionWithPayload } from "../actions/IActionWithPayload";
import { IQuoteAction } from "../actions/quoteAction";
import { initialQuoteState } from "../state/quoteState";
import QuoteTypes from "../types/quoteTypes";

const quoteReducer = (
  state = initialQuoteState,
  action: IQuoteAction | IActionWithPayload<any>
) => {
  switch (action.type) {
    case QuoteTypes.SET_SELECTED_CHAT:
      return { ...state, activeChat: action?.payload?.id ?? null };
    // This is needed for Next.js
    case HYDRATE: {
      return { ...action.payload.quoteReducer };
    }
    default:
      return state;
  }
};

export default quoteReducer;
