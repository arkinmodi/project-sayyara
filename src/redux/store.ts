import { configureStore } from "@reduxjs/toolkit";
import { Store } from "redux";
import { createWrapper, Context } from "next-redux-wrapper";
import createSagaMiddleware, { Task } from "redux-saga";
import { rootSaga } from "./sagas";
import { rootReducer } from "./reducers";

export interface State {}

export interface SagaStore extends Store {
  sagaTask?: Task;
}

export const makeStore = (_context: Context) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware(),
      sagaMiddleware,
    ],
  });

  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

export const wrapper = createWrapper<Store<State>>(makeStore, { debug: false });
