import { IQuoteActionCreateMessage } from "@redux/actions/quoteAction";
import QuoteTypes from "@redux/types/quoteTypes";
import { all, CallEffect, PutEffect, takeEvery } from "redux-saga/effects";

function* createMessage(
  action: IQuoteActionCreateMessage
): Generator<CallEffect | PutEffect> {
  const payload = action.payload;
}

export function* quoteSaga() {
  yield all([takeEvery(QuoteTypes.CREATE_MESSAGE, createMessage)]);
}
