import AppointmentTypes from "@redux/types/appointmentTypes";
import styles from "@styles/pages/appointments/Requests.module.css";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useDispatch } from "react-redux";
import {
  AppointmentProgress,
  AppointmentStatus,
  IAppointment,
} from "../../../types/appointment";

interface IAppointmentCardProps {
  appointment: IAppointment;
  appointmentProgress: AppointmentProgress;
}

const AppointmentCard = (props: IAppointmentCardProps) => {
  const dispatch = useDispatch();

  const { appointment, appointmentProgress } = props;

  const handleAcceptButtonClick = (appointment: IAppointment): void => {
    const payload = { id: appointment.id, status: AppointmentStatus.ACCEPTED };
    dispatch({ type: AppointmentTypes.SET_APPOINTMENT_STATUS, payload });
  };

  const handleRejectButtonClick = (appointment: IAppointment): void => {
    const payload = { id: appointment.id, status: AppointmentStatus.REJECTED };
    dispatch({ type: AppointmentTypes.SET_APPOINTMENT_STATUS, payload });
  };

  const renderRequestedCardLeft = () => {
    return (
      <div className={styles.textAlignRight}>
        {/* TODO: Link to quote and pass in quote id */}
        <div className={styles.grayText}>View Quote </div>
        <div className={styles.flex}>
          <Button
            label="Reject"
            className={styles.appointmentButtonBlue}
            onClick={() => handleRejectButtonClick(appointment)}
          />
          <Button
            label="Accept"
            className={styles.appointmentButtonGreen}
            onClick={() => handleAcceptButtonClick(appointment)}
          />
        </div>
        <div>Estimated Price:</div>
      </div>
    );
  };

  const renderScheduledCardLeft = () => {
    return (
      <div className={styles.textAlignRight}>
        {/* TODO: Link to quote and pass in quote id */}
        <div className={styles.grayText}>View Quote </div>
        <div className={styles.flex}>
          <Button
            label="Cancel"
            className={styles.appointmentButtonRed}
            onClick={() => handleRejectButtonClick(appointment)}
          />
        </div>
        <div>Estimated Price:</div>
      </div>
    );
  };

  const renderCardLeft = (appointmentProgress: AppointmentProgress) => {
    switch (appointmentProgress) {
      case AppointmentProgress.REQUESTED:
        return renderRequestedCardLeft();
      case AppointmentProgress.SCHEDULED:
        return renderScheduledCardLeft();
      default:
    }
  };

  return (
    <Card
      key={appointment.id.toString()}
      className={styles.appointmentRequestsCard}
    >
      <div className={styles.cardContents}>
        <div>
          <h3>{appointment.serviceType}</h3>
          <div>Customer Name:</div>
          <div>
            Start time:{" "}
            {String(new Date(appointment.startTime).toLocaleString())}
          </div>
          <div>
            End time: {String(new Date(appointment.endTime).toLocaleString())}
          </div>
          {/* <div>Vehicle Make: {appointment.vehicleMake}</div>
          <div>Vehicle Model: {appointment.vehicleModel}</div>
          <div>
            Manufacture Year:{" "}
            {appointment.vehicleManufactureYear.toString()}
          </div> */}
        </div>
        <div>{renderCardLeft(appointmentProgress)}</div>
      </div>
    </Card>
  );
};

export default AppointmentCard;
