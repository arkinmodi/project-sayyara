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

    //put the appointments in a map of lists depending on the date
    const pendingAppointmentsMap = Map<String, Array<IAppointment>>;
    for (var appointment of pendingAppointments) {
      //TODO: Might have to change this depending on the format that the date is saved
      var date = new Date(appointment.startTime.toISOString().substring(0, 10))
        pendingAppointments[0].set(date, appointment)
      );
      var appointment1 = pendingAppointments[0];
    }
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
