import VehicleTypes from "@redux/types/vehicleTypes";
import {
  all,
  call,
  CallEffect,
  PutEffect,
  takeEvery,
} from "redux-saga/effects";
import { IVehicle } from "src/types/vehicle";

function getVehicleById(): Promise<IVehicle[]> {
  return fetch(`/api/vehicle/{id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 200) {
      return res.json().then((data) => {
        const vehicle = data.map((vehicle: IVehicle) => {
          return {
            id: vehicle.id,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            vin: vehicle.vin,
            license_plate: vehicle.license_plate,
          };
        });
        return vehicle;
      });
    } else {
      // TODO: check and handle errors
      return [];
    }
  });
}

function* readVehicleById(): Generator<CallEffect | PutEffect> {
  const appointments = yield call(getVehicleById);
  //   yield put({
  //     type: AppointmentTypes.SET_APPOINTMENTS,
  //     payload: { appointments },
  //   });
}

export function* appointmentSaga() {
  yield all([takeEvery(VehicleTypes.READ_VEHICLE_BY_ID, readVehicleById)]);
}
