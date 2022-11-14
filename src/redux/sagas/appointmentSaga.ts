import { all, call, CallEffect, PutEffect, takeEvery } from "redux-saga/effects";
import { IAppointmentActionCreateAppointment } from "../actions/appointmentActions";
import AppointmentTypes from "../types/appointmentTypes";

function* postRequest(body: any): Generator<boolean> {
    fetch("", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
        },
        body: JSON.stringify(body),
    }).then((res) => {
        if (res.status === 200) {
            return true;
        } else {
            return false;
        }
    })
}

function* createAppointment(
    action: IAppointmentActionCreateAppointment
): Generator<CallEffect | PutEffect> {
    const payload = action.payload;
    const body = {
        types: payload.types,
        date: payload.date,
    };
    yield call(postRequest, body);
}

export function* appointmentSaga() {
    yield all([takeEvery(AppointmentTypes.CREATE_APPOINTMENT, createAppointment)])
}