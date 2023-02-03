import { HYDRATE } from "next-redux-wrapper";
import { IQuote } from "src/types/quotes";
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
    case QuoteTypes.SET_MESSAGE:
      const quoteId = action?.payload?.quoteId;
      const message = action?.payload?.message;
      if (quoteId && message && quoteId in state.quotes) {
        return {
          ...state,
          quotes: {
            ...state.quotes,
            quoteId: {
              ...state.quotes.quoteId,
              messageList: [
                ...(state.quotes.quoteId as IQuote).messageList,
                message,
              ],
            },
          },
        };
      }
      return state;
    // This is needed for Next.js
    case HYDRATE: {
      return { ...action.payload.quoteReducer };
    }
    default:
      return state;
  }
};

export default quoteReducer;
