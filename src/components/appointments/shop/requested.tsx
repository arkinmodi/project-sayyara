import { AppointmentSelectors } from "@redux/selectors/appointmentSelectors";
import AppointmentTypes from "@redux/types/appointmentTypes";
import styles from "@styles/pages/appointments/Requests.module.css";
import { Card } from "primereact/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppointmentStatus, IAppointment } from "../../../types/appointment";
import AppointmentCard from "./appointmentCard";

const Requested = () => {
  const [pendingAppointments, setPendingAppointments] = useState<
    IAppointment[]
  >([]);
  const dispatch = useDispatch();

  const appointments = useSelector(AppointmentSelectors.getAppointments);

  useEffect(() => {
    dispatch({ type: AppointmentTypes.READ_APPOINTMENTS });
  }, [dispatch]);

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
  }, [appointments, setPendingAppointments]);

  return (
    <div className={styles.appointmentRequestsContainer}>
      <Card className={styles.appointmentRequestsCard}>
        <h2 className={styles.appointmentRequestsCardText}>
          Appointment Requests
        </h2>
        {pendingAppointments.length > 0 ? (
          pendingAppointments.map((appointment) => (
            <AppointmentCard appointment={appointment} />
          ))
        ) : (
          <div className={styles.appointmentRequestsCardText}>
            No pending appointments
          </div>
        )}
      </Card>
    </div>
  );
};

export default Requested;
