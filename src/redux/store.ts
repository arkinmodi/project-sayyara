import { configureStore } from "@reduxjs/toolkit";
import { Context, createWrapper } from "next-redux-wrapper";
import { Store } from "redux";
import createSagaMiddleware, { Task } from "redux-saga";
import { rootReducer } from "./reducers/rootReducer";
import { rootSaga } from "./sagas/rootSaga";
import { initialShopState, IShopState } from "./state/shop/shopState";
import {
  IAppointmentsState,
  initialAppointmentsState,
} from "./state/user/appointmentState";
import { IAuthState, initialAuthState } from "./state/user/authState";
import {
  ICreateAppointmentState,
  initialCreateAppointmentState,
} from "./state/user/createAppointmentState";

/**
 * Note: next-redux-wrapper automatically creates the store instances and ensures they all have the same state
 */

interface SagaStore extends Store {
  sagaTask?: Task;
}

export interface RootState {
  auth: IAuthState;
  appointments: IAppointmentsState;
  createAppointments: ICreateAppointmentState;
  shop: IShopState;
}

const initialState = {
  auth: initialAuthState,
  appointments: initialAppointmentsState,
  createAppointments: initialCreateAppointmentState,
  shop: initialShopState,
};

export const makeStore = (_context: Context) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      sagaMiddleware,
    ],
    preloadedState: initialState,
  });

  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export const wrapper = createWrapper(makeStore);
