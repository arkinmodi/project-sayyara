import { ChatMessage, QuoteStatus, UserType } from "@prisma/client";
import {
  IQuoteActionAcceptQuote,
  IQuoteActionCreateMessage,
  IQuoteActionCreateQuote,
  IQuoteActionGetCustomerQuotes,
  IQuoteActionGetShopQuotes,
  IQuoteActionInviteCustomer,
} from "@redux/actions/quoteAction";
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
import { ICustomer } from "src/types/customer";
import {
  ICreateQuoteBody,
  IMessage,
  IQuote,
  IQuoteList,
} from "src/types/quotes";
import { IService } from "src/types/service";
import { IShop } from "src/types/shop";
import { getMessageListByQuoteId } from "src/utils/quotesUtil";

interface IPostCreateMessageBody {
  customerId?: string;
  shopId?: string;
  message: string;
}

function getCustomerQuotesHandler(
  customerId: string
): Promise<IQuoteList | {}> {
  return fetch(`/api/customer/${customerId}/quotes/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const quotes: IQuoteList = {};
        const promises = data.map((quote: any) => {
          const messageListPromise = getMessageListByQuoteId(quote.id);
          return Promise.all([messageListPromise]).then((values) => {
            const message = values[0];
            const customer: ICustomer = {
              id: quote.customer.id,
              firstName: quote.customer.firstName,
              lastName: quote.customer.lastName,
              phoneNumber: quote.customer.phoneNumber,
              email: quote.customer.email,
            };
            const shop: IShop = {
              id: quote.shop.id,
              name: quote.shop.name,
              address: quote.shop.address,
              postalCode: quote.shop.postalCode,
              city: quote.shop.city,
              province: quote.shop.province,
              phoneNumber: quote.shop.phoneNumber,
              hoursOfOperation: quote.shop.hoursOfOperation,
              email: quote.shop.email,
            };
            const service: IService = {
              id: quote.service.id,
              name: quote.service.name,
              description: quote.service.description,
              estimatedTime: quote.service.estimatedTime,
              totalPrice: quote.service.totalPrice,
              parts: quote.service.parts,
              type: quote.service.type,
              shopId: quote.service.shopId,
            };

            const quoteObj = {
              id: quote.id,
              customer: customer,
              shop: shop,
              service: service,
              status: quote.status,
              price: quote.estimatedPrice,
              duration: quote.duration,
              description: quote.description,
              createTime: quote.createTime,
              updateTime: quote.updateTime,
              messageList: message,
            };
            return quoteObj;
          });
        });

        return Promise.all(promises)
          .then((quoteList) => {
            quoteList.forEach((quote) => (quotes[quote.id] = quote));
          })
          .then(() => {
            return quotes;
          });
      });
    } else {
      return {};
    }
  });
}

function getShopQuotesHandler(shopId: string): Promise<IQuoteList | {}> {
  return fetch(`/api/shop/${shopId}/quotes/`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const quotes: IQuoteList = {};
        const promises = data.map((quote: any) => {
          const messageListPromise = getMessageListByQuoteId(quote.id);

          return Promise.all([messageListPromise]).then((values) => {
            const message = values[0];
            const customer: ICustomer = {
              id: quote.customer.id,
              firstName: quote.customer.firstName,
              lastName: quote.customer.lastName,
              phoneNumber: quote.customer.phoneNumber,
              email: quote.customer.email,
            };
            const shop: IShop = {
              id: quote.shop.id,
              name: quote.shop.name,
              address: quote.shop.address,
              postalCode: quote.shop.postalCode,
              city: quote.shop.city,
              province: quote.shop.province,
              phoneNumber: quote.shop.phoneNumber,
              hoursOfOperation: quote.shop.hoursOfOperation,
              email: quote.shop.email,
            };
            const service: IService = {
              id: quote.service.id,
              name: quote.service.name,
              description: quote.service.description,
              estimatedTime: quote.service.estimatedTime,
              totalPrice: quote.service.totalPrice,
              parts: quote.service.parts,
              type: quote.service.type,
              shopId: quote.service.shopId,
            };

            const quoteObj = {
              id: quote.id,
              customer: customer,
              shop: shop,
              service: service,
              status: quote.status,
              price: quote.estimatedPrice,
              duration: quote.duration,
              description: quote.description,
              createTime: quote.createTime,
              updateTime: quote.updateTime,
              messageList: message,
            };
            return quoteObj;
          });
        });
        return Promise.all(promises)
          .then((quoteList) => {
            quoteList.forEach((quote) => (quotes[quote.id] = quote));
          })
          .then(() => {
            return quotes;
          });
      });
    } else {
      return {};
    }
  });
}

function postCreateQuote(body: ICreateQuoteBody): Promise<IQuote | null> {
  return fetch("/api/quotes/", {
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
          customer: data.customer,
          shop: data.shop,
          service: data.service,
          status: data.status,
          price: data.estimatedPrice,
          duration: data.duration,
          description: data.description,
          createTime: new Date(data.createTime).toString(),
          updateTime: new Date(data.updateTime).toString(),
          messageList: [],
        };
      });
    } else {
      return null;
    }
  });
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
      return res.json().then((data: ChatMessage) => {
        return {
          id: data.id,
          quoteId: quoteId,
          customerId: data.customerId,
          shopId: data.shopId,
          message: data.message,
          createdAt: data.createTime,
        };
      });
    } else {
      return null;
    }
  });
}

function patchQuoteForInvite(
  id: string,
  price: number,
  duration: number,
  description: string
): Promise<boolean> {
  return fetch(`/api/quotes/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description,
      duration,
      estimatedPrice: price,
      status: QuoteStatus.INVITED,
    }),
  }).then((res) => {
    return res.status === 200;
  });
}

function patchQuoteForAccept(id: string): Promise<boolean> {
  return fetch(`/api/quotes/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: QuoteStatus.ACCEPTED,
    }),
  }).then((res) => {
    return res.status === 200;
  });
}

function* getCustomerQuotes(
  action: IQuoteActionGetCustomerQuotes
): Generator<CallEffect | PutEffect | SelectEffect> {
  const id = (yield select(AuthSelectors.getUserId)) as string;
  const data = yield call(getCustomerQuotesHandler, id);

  yield put({
    type: QuoteTypes.UPDATE_INITIAL_STATE,
    payload: { data },
  });
}

function* getShopQuotes(
  action: IQuoteActionGetShopQuotes
): Generator<CallEffect | PutEffect | SelectEffect> {
  const id = (yield select(AuthSelectors.getShopId)) as string;
  const data = yield call(getShopQuotesHandler, id);

  yield put({
    type: QuoteTypes.UPDATE_INITIAL_STATE,
    payload: { data },
  });
}

function* createQuote(
  action: IQuoteActionCreateQuote
): Generator<CallEffect | PutEffect | SelectEffect> {
  const payload = action.payload;
  const body: ICreateQuoteBody = {
    customerId: payload.customerId,
    shopId: payload.shopId,
    serviceId: payload.serviceId,
  };

  const data = yield call(postCreateQuote, body);
  if (data) {
    yield put({
      type: QuoteTypes.ADD_QUOTE_TO_STATE,
      payload: { data },
    });
  }
}

function* createMessage(
  action: IQuoteActionCreateMessage
): Generator<CallEffect | PutEffect | SelectEffect> {
  const userType = (yield select(AuthSelectors.getUserType)) as UserType;
  const payload = action.payload;
  const quoteId = payload.quoteId;

  let body: IPostCreateMessageBody = {
    message: payload.message,
  };
  switch (userType) {
    case UserType.CUSTOMER:
      body.customerId = (yield select(AuthSelectors.getUserId)) as string;
      break;
    case UserType.SHOP_OWNER:
    case UserType.EMPLOYEE:
      body.shopId = (yield select(AuthSelectors.getShopId)) as string;
      break;
    default:
      break;
  }
  const data = yield call(postCreateMessage, quoteId, body);
  if (data) {
    yield put({
      type: QuoteTypes.SET_MESSAGE,
      payload: { quoteId, message: data },
    });
  }
}

function* inviteCustomer(
  action: IQuoteActionInviteCustomer
): Generator<CallEffect | PutEffect> {
  const payload = action.payload;
  const success = yield call(
    patchQuoteForInvite,
    payload.quoteId,
    payload.price,
    payload.duration,
    payload.description
  );

  if (success) {
    yield put({
      type: QuoteTypes.GET_SHOP_QUOTES,
    });
  }
}

function* acceptQuote(
  action: IQuoteActionAcceptQuote
): Generator<CallEffect | PutEffect> {
  const payload = action.payload;
  const success = yield call(patchQuoteForAccept, payload.quoteId);

  if (success) {
    yield put({
      type: QuoteTypes.GET_CUSTOMER_QUOTES,
    });
  }
}

export function* quoteSaga() {
  yield all([
    takeEvery(QuoteTypes.GET_CUSTOMER_QUOTES, getCustomerQuotes),
    takeEvery(QuoteTypes.GET_SHOP_QUOTES, getShopQuotes),
    takeEvery(QuoteTypes.CREATE_QUOTE, createQuote),
    takeEvery(QuoteTypes.CREATE_MESSAGE, createMessage),
    takeEvery(QuoteTypes.INVITE_CUSTOMER, inviteCustomer),
    takeEvery(QuoteTypes.ACCEPT_QUOTE, acceptQuote),
  ]);
}
