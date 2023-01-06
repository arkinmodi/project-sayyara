import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  takeEvery,
} from "redux-saga/effects";
import {
  IAuthActionCreateCustomerSignUp,
  IAuthActionCreateLogin,
  IAuthActionCreateShopEmployeeSignUp,
  IAuthActionCreateShopOwnerSignUp,
} from "../actions/authActions";
import AuthTypes from "../types/authTypes";

interface IPostSignUpBody {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

interface IPostCustomerSignUpBody extends IPostSignUpBody {
  vehicle: {
    year: number;
    make: string;
    model: string;
    vin: string;
    license_plate: string;
  };
}

interface IPostShopEmployeeSignUpBody extends IPostSignUpBody {
  shop_id: string;
}

interface IPostShopOwnerSignUpBody extends IPostSignUpBody {
  shop: {
    shop_address: string;
    shop_city: string;
    shop_province: string;
    shop_postal_code: string;
    shop_phone_number: string;
  };
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

function postCustomerSignUp(body: IPostCustomerSignUpBody): Promise<boolean> {
  return fetch("/api/user/register/customer", {
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

function postShopOwnerSignUp(body: IPostShopOwnerSignUpBody): Promise<boolean> {
  return fetch("/api/user/register/shopOwner", {
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

function postShopEmployeeSignUp(
  body: IPostShopEmployeeSignUpBody
): Promise<boolean> {
  return fetch("/api/user/register/employee", {
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
  // Redirect to landing page if login is successful
  if (isLoggedIn) {
    yield put({
      type: AuthTypes.SET_IS_LOGGED_IN,
      payload: { isLoggedIn },
    });
    window.location.reload();
  }
}

function* customerSignUp(
  action: IAuthActionCreateCustomerSignUp
): Generator<CallEffect | PutEffect> {
  const payload = action.payload;
  const body: IPostCustomerSignUpBody = {
    email: payload.email,
    password: payload.password,
    first_name: payload.firstName,
    last_name: payload.lastName,
    vehicle: {
      make: payload.vehicleMake,
      model: payload.vehicleModel,
      year: payload.vehicleYear,
      license_plate: payload.licensePlate,
      vin: payload.vin,
    },
  };
  const success = yield call(postCustomerSignUp, body);
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

function* shopEmployeeSignUp(
  action: IAuthActionCreateShopEmployeeSignUp
): Generator<CallEffect | PutEffect> {
  const payload = action.payload;
  const body: IPostShopEmployeeSignUpBody = {
    email: payload.email,
    password: payload.password,
    first_name: payload.firstName,
    last_name: payload.lastName,
    shop_id: payload.shopId,
  };
  const success = yield call(postShopEmployeeSignUp, body);
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

function* shopOwnerSignUp(
  action: IAuthActionCreateShopOwnerSignUp
): Generator<CallEffect | PutEffect> {
  const payload = action.payload;
  const body: IPostShopOwnerSignUpBody = {
    email: payload.email,
    password: payload.password,
    first_name: payload.firstName,
    last_name: payload.lastName,
    shop: {
      shop_address: payload.shopAddress,
      shop_city: payload.shopCity,
      shop_province: payload.shopProvince,
      shop_postal_code: payload.shopPostalCode,
      shop_phone_number: payload.stopPhoneNumber,
    },
  };
  const success = yield call(postShopOwnerSignUp, body);
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
    takeEvery(AuthTypes.CREATE_CUSTOMER_SIGN_UP, customerSignUp),
    takeEvery(AuthTypes.CREATE_SHOP_EMPLOYEE_SIGN_UP, shopEmployeeSignUp),
    takeEvery(AuthTypes.CREATE_SHOP_OWNER_SIGN_UP, shopOwnerSignUp),
  ]);
}
