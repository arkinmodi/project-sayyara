import AppointmentTypes from "@redux/types/appointmentTypes";
import styles from "@styles/pages/appointments/Requests.module.css";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppointmentStatus, IAppointment } from "../../../types/appointment";

interface IAppointmentCardProps {
  appointment: IAppointment;
}

const AppointmentCard = (props: IAppointmentCardProps) => {
  const [pendingAppointments, setPendingAppointments] = useState<
    IAppointment[]
  >([]);
  const dispatch = useDispatch();

  const handleAcceptButtonClick = (appointment: IAppointment): void => {
    const payload = { id: appointment.id, status: AppointmentStatus.ACCEPTED };
    dispatch({ type: AppointmentTypes.SET_APPOINTMENT_STATUS, payload });
  };

  const handleRejectButtonClick = (appointment: IAppointment): void => {
    const payload = { id: appointment.id, status: AppointmentStatus.REJECTED };
    dispatch({ type: AppointmentTypes.SET_APPOINTMENT_STATUS, payload });
  };

  return (
    <Card
      key={props.appointment.id.toString()}
      className={styles.appointmentRequestsCard}
    >
      <div className={styles.cardContents}>
        <div>
          <h3>{props.appointment.serviceType}</h3>
          <div>Customer Name:</div>
          <div>
            Start time:{" "}
            {String(new Date(props.appointment.startTime).toLocaleString())}
          </div>
          <div>
            End time:{" "}
            {String(new Date(props.appointment.endTime).toLocaleString())}
          </div>
          {/* <div>Vehicle Make: {props.appointment.vehicleMake}</div>
          <div>Vehicle Model: {props.appointment.vehicleModel}</div>
          <div>
            Manufacture Year:{" "}
            {props.appointment.vehicleManufactureYear.toString()}
          </div> */}
        </div>

        <div className={styles.textAlignRight}>
          {/* TODO: Link to quote and pass in quote id */}
          <div className={styles.grayText}>View Quote </div>
          <div className={styles.flex}>
            <Button
              label="Reject"
              className={styles.appointmentRequestsRejectButton}
              onClick={() => handleRejectButtonClick(props.appointment)}
            />
            <Button
              label="Accept"
              className={styles.appointmentRequestsAcceptButton}
              onClick={() => handleAcceptButtonClick(props.appointment)}
            />
          </div>
          <div>Estimated Price:</div>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCard;
