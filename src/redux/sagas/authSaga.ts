import Router from "next/router";
import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  takeEvery,
} from "redux-saga/effects";
import {
  IAuthActionCreateLogin,
  IAuthActionCreateSignUp,
} from "../actions/authActions";
import AuthTypes from "../types/authTypes";

interface IPostSignUpBody {
  callbackUrl: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  type: string;
}

function postLogin(body: IAuthActionCreateLogin["payload"]): Promise<boolean> {
  return fetch("/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.status === 200) {
      return true;
    } else {
      // TODO: check and handle errors
      return false;
    }
  });
}

function postSignUp(body: IPostSignUpBody): Promise<boolean> {
  return fetch("/api/user/register", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => {
    if (res.status === 200) {
      return true;
    } else {
      // TODO: check and handle errors
      return false;
    }
  });
}

function* login(
  action: IAuthActionCreateLogin
): Generator<CallEffect | PutEffect> {
  const isLoggedIn = yield call(postLogin, action.payload);
  yield put({ type: AuthTypes.SET_IS_LOGGED_IN, isLoggedIn });
  // Redirect to landing page if login is successful
  if (isLoggedIn) {
    yield call(Router.push, "/");
  }
}

function* signUp(
  action: IAuthActionCreateSignUp
): Generator<CallEffect | PutEffect> {
  const payload = action.payload;
  const body: IPostSignUpBody = {
    callbackUrl: payload.callbackUrl,
    email: payload.email,
    password: payload.password,
    first_name: payload.firstName,
    last_name: payload.lastName,
    type: payload.type,
  };
  const success = yield call(postSignUp, body);
  if (success) {
    // If registration is successful, attempt to login automatically
    const loginBody: IAuthActionCreateLogin["payload"] = {
      csrfToken: payload.csrfToken,
      email: payload.email,
      password: payload.password,
    };
    yield put({ type: AuthTypes.CREATE_LOGIN, payload: loginBody });
  }
}

/**
 * Saga to handle all auth related actions.
 */
export function* authSaga() {
  yield all([
    takeEvery(AuthTypes.CREATE_LOGIN, login),
    takeEvery(AuthTypes.CREATE_SIGN_UP, signUp),
  ]);
}
