import AppointmentTypes from "@redux/types/appointmentTypes";
import styles from "@styles/pages/appointments/Requests.module.css";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useDispatch } from "react-redux";
import { AppointmentStatus, IAppointment } from "../../../types/appointment";

interface IAppointmentCardProps {
  appointment: IAppointment;
}

const AppointmentInProgressCard = (props: IAppointmentCardProps) => {
  const dispatch = useDispatch();

  const handleRejectButtonClick = (appointment: IAppointment): void => {
    const payload = { id: appointment.id, status: AppointmentStatus.REJECTED };
    dispatch({ type: AppointmentTypes.SET_APPOINTMENT_STATUS, payload });
  };

  return (
    <Card
      key={props.appointment.id.toString()}
      className={styles.appointmentRequestsCard}
    >
      <div>
        <div className={styles.floatLeft}>
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

          <div>Vehicle Make: {props.appointment.vehicleMake}</div>
          <div>Vehicle Model: {props.appointment.vehicleModel}</div>
          <div>
            Manufacture Year:{" "}
            {props.appointment.vehicleManufactureYear.toString()}
          </div>
        </div>

        <div className={styles.floatRight}>
          {/* TODO: link to work order */}
          <Button
            label="Work Order"
            className={styles.appointmentRequestsRejectButton}
          />
        </div>
      </div>
    </Card>
  );
};

export default AppointmentInProgressCard;
