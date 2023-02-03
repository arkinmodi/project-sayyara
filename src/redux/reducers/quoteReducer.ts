import { HYDRATE } from "next-redux-wrapper";
import { IActionWithPayload } from "../actions/IActionWithPayload";
import { IQuoteAction } from "../actions/quoteAction";
import { initialQuoteState } from "../state/quoteState";

const quoteReducer = (
  state = initialQuoteState,
  action: IQuoteAction | IActionWithPayload<any>
) => {
  switch (action.type) {
    // This is needed for Next.js
    case HYDRATE: {
      return { ...action.payload.quoteReducer };
    }
    default:
      return state;
  }
};

export default quoteReducer;
