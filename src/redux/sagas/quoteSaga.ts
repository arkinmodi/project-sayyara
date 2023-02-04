import { IQuoteActionCreateMessage } from "@redux/actions/quoteAction";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import QuoteTypes from "@redux/types/quoteTypes";
import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  select,
  SelectEffect,
  takeEvery,
} from "redux-saga/effects";
import { IMessage } from "src/types/quotes";

interface IPostCreateMessageBody {
  customer_id: string;
  shop_id: string;
  message: string;
  quoteId: string;
}
function postCreateMessage(
  quoteId: string,
  body: IPostCreateMessageBody
): Promise<IMessage | null> {
  return fetch(`/api/quotes/${quoteId}/chat/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.status === 201) {
      return res.json().then((data) => {
        return {
          id: data.id,
          message: data.message,
          createdAt: data.create_time,
          isMyMessage: true,
        };
      });
    } else {
      return null;
    }
  });
}

function* createMessage(
  action: IQuoteActionCreateMessage
): Generator<CallEffect | PutEffect | SelectEffect> {
  const userId: string | null = (yield select(AuthSelectors.getUserId)) as
    | string
    | null;
  if (userId) {
    const payload = action.payload;
    const quoteId = payload.quoteId;
    const body: IPostCreateMessageBody = {
      customer_id: userId,
      shop_id: "cldp54nf40001lukgq05zyvua",
      message: payload.message,
      quoteId: payload.quoteId,
    };

    const data = yield call(postCreateMessage, quoteId, body);
    if (data) {
      yield put({
        type: QuoteTypes.SET_MESSAGE,
        payload: { quoteId, message: data },
      });
    }
  }
}

export function* quoteSaga() {
  yield all([takeEvery(QuoteTypes.CREATE_MESSAGE, createMessage)]);
}
