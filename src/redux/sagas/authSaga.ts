import { UserType } from "@prisma/client";
import { AuthSelectors } from "@redux/selectors/authSelectors";
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
import { IVehicle } from "src/types/vehicle";
import { getVehicleByCustomerId } from "src/utils/vehicleUtil";
import {
  IAuthActionCreateCustomerSignUp,
  IAuthActionCreateLogin,
  IAuthActionCreateShopEmployeeSignUp,
  IAuthActionCreateShopOwnerSignUp,
  IAuthActionReadCustomerVehicle,
} from "../actions/authActions";
import AuthTypes from "../types/authTypes";

var md5Hash = require("md5-hash");

interface IPostSignUpBody {
  email: string;
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface IPostCustomerSignUpBody extends IPostSignUpBody {
  vehicle: {
    year: number;
    make: string;
    model: string;
    vin: string;
    licensePlate: string;
  };
}

interface IPostShopEmployeeSignUpBody extends IPostSignUpBody {
  shopId: string;
}

interface IPostShopOwnerSignUpBody extends IPostSignUpBody {
  shop: {
    name: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    phoneNumber: string;
    email: string;
    latitude: string;
    longitude: string;
  };
}

function postLogin(body: IAuthActionCreateLogin["payload"]): Promise<boolean> {
  return fetch("/api/auth/callback/credentials", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body, password: md5Hash.default(body.password) }),
  }).then((res) => {
    if (res.status === 200) {
      if (res.url.includes("error=CredentialsSignin")) {
        return false;
      } else {
        return true;
      }
    } else {
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
  yield put({
    type: AuthTypes.SET_SHOW_INVALID_LOGIN_TOAST,
    payload: { showInvalidLoginToast: !isLoggedIn },
  });
}

function* customerSignUp(
  action: IAuthActionCreateCustomerSignUp
): Generator<CallEffect | PutEffect> {
  const payload = action.payload;
  const body: IPostCustomerSignUpBody = {
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    password: md5Hash.default(payload.password),
    firstName: payload.firstName,
    lastName: payload.lastName,
    vehicle: {
      make: payload.vehicleMake,
      model: payload.vehicleModel,
      year: payload.vehicleYear,
      licensePlate: payload.licensePlate,
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
    phoneNumber: payload.phoneNumber,
    password: md5Hash.default(payload.password),
    firstName: payload.firstName,
    lastName: payload.lastName,
    shopId: payload.shopId,
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
    phoneNumber: payload.phoneNumber,
    password: md5Hash.default(payload.password),
    firstName: payload.firstName,
    lastName: payload.lastName,
    shop: {
      name: payload.shopName,
      address: payload.shopAddress,
      city: payload.shopCity,
      province: payload.shopProvince,
      postalCode: payload.shopPostalCode,
      phoneNumber: payload.shopPhoneNumber,
      email: payload.shopEmail,
      latitude: "",
      longitude: "",
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

function* readCustomerVehicleInfo(
  action: IAuthActionReadCustomerVehicle
): Generator<CallEffect | PutEffect | SelectEffect> {
  const userType = (yield select(AuthSelectors.getUserType)) as UserType | null;
  if (userType === UserType.CUSTOMER) {
    // Add vehicle information to state
    const customerId = (yield select(AuthSelectors.getUserId)) as string;
    const vehicle: IVehicle | null = (yield call(
      getVehicleByCustomerId,
      customerId
    )) as IVehicle | null;
    if (vehicle) {
      yield put({
        type: AuthTypes.SET_CUSTOMER_VEHICLE_INFO,
        payload: vehicle,
      });
    }
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
    takeEvery(AuthTypes.READ_CUSTOMER_VEHICLE_INFO, readCustomerVehicleInfo),
  ]);
}
