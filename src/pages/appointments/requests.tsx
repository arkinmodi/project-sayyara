import { NextPage } from "next";
import { Button, Card } from "@blueprintjs/core";
import { useState, useEffect } from "react";
import { IAppointment, AppointmentStatus } from "../../types/appointment";
import styles from "../../styles/pages/appointments/AppointmentResponse.module.css";
import { useDispatch, useSelector } from "react-redux";
import AppointmentTypes from "src/redux/types/appointmentTypes";
import { AppointmentSelectors } from "src/redux/selectors/appointmentSelectors";

const Requests: NextPage = () => {
  const [pendingAppointments, setPendingAppointments] = useState<
    IAppointment[]
  >([]);
  const dispatch = useDispatch();

  const appointments = useSelector(AppointmentSelectors.getAppointments);

  useEffect(() => {
    dispatch({ type: AppointmentTypes.READ_APPOINTMENTS });
  }, []);

  useEffect(() => {
    const pendingAppointments = appointments
      .filter(
        (appointment: IAppointment) =>
          appointment.status == AppointmentStatus.PENDING_APPROVAL
      )
      .sort((appointment1: IAppointment, appointment2: IAppointment) => {
        return (
          new Date(appointment1.startTime).getTime() -
          new Date(appointment2.startTime).getTime()
        );
      });
    setPendingAppointments(pendingAppointments);
  }, [appointments]);

  const handleAcceptButtonClick = (appointment: IAppointment): void => {
    const payload = { id: appointment.id, status: AppointmentStatus.ACCEPTED };
    dispatch({ type: AppointmentTypes.SET_APPOINTMENT_STATUS, payload });
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <h2 className={styles.cardHeader}>Appointment Requests</h2>
        {pendingAppointments.length > 0 ? (
          pendingAppointments.map((appointment) => (
            <Card>
              <span>
                <div>Appointment id: {appointment.id}</div>
                <div>
                  Start time:{" "}
                  {String(new Date(appointment.startTime).toLocaleString())}
                </div>
                <div>
                  End time:{" "}
                  {String(new Date(appointment.endTime).toLocaleString())}
                </div>
              </span>
              <span>
                <Button
                  className={styles.acceptButton}
                  intent="primary"
                  onClick={() => handleAcceptButtonClick(appointment)}
                >
                  Accept
                </Button>
              </span>
            </Card>
          ))
        ) : (
          <div className={styles.cardHeader}>No pending appointments</div>
        )}
      </Card>
    </div>
  );
};

export default Requests;
