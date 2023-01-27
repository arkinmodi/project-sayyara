import { AppointmentSelectors } from "@redux/selectors/appointmentSelectors";
import AppointmentTypes from "@redux/types/appointmentTypes";
import styles from "@styles/pages/appointments/Requests.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppointmentProgress,
  AppointmentStatus,
  IAppointment,
} from "../../../types/appointment";
import AppointmentCard from "./appointmentCard";

const Completed = () => {
  const dispatch = useDispatch();

  const appointments = useSelector(AppointmentSelectors.getAppointments);

  const [completedAppointmentsMap, setCompletedAppointmentsMap] = useState<{
    [key: string]: Array<IAppointment>;
  }>({});

  useEffect(() => {
    dispatch({ type: AppointmentTypes.READ_APPOINTMENTS });
  }, [dispatch]);

  useEffect(() => {
    const pendingAppointments = appointments
      .filter(
        (appointment: IAppointment) =>
          appointment.status == AppointmentStatus.ACCEPTED
      )
      .sort((appointment1: IAppointment, appointment2: IAppointment) => {
        return (
          new Date(appointment1.startTime).getTime() -
          new Date(appointment2.startTime).getTime()
        );
      });

    //put the appointments in a map of lists depending on the date
    var completedAppointmentsMap: { [key: string]: IAppointment[] } = {};

    for (var appointment of pendingAppointments) {
      var date = new Date(appointment.startTime).toDateString();
      if (!(date in completedAppointmentsMap)) {
        completedAppointmentsMap[date] = [];
      }
      completedAppointmentsMap[date]!.push(appointment);
    }
    setCompletedAppointmentsMap(completedAppointmentsMap);
  }, [appointments, setCompletedAppointmentsMap]);

  function listAppointmentCards(date: string) {
    let content: any = [];
    {
      completedAppointmentsMap[date]!.forEach((appointment) => {
        content.push(
          <AppointmentCard
            appointment={appointment}
            appointmentProgress={AppointmentProgress.COMPLETED}
          />
        );
      });
    }

    return content;
  }

  function listAllAppointments() {
    let content: any = [];
    Object.keys(completedAppointmentsMap).forEach((date) => {
      content.push(
        <div>
          <h4>{date}</h4>
          {listAppointmentCards(date)}
        </div>
      );
    });

    return content;
  }

  return (
    <div>
      {Object.entries(completedAppointmentsMap).length > 0 ? (
        listAllAppointments()
      ) : (
        <div className={styles.appointmentRequestsCardText}>
          No completed appointments
        </div>
      )}
    </div>
  );
};

export default Completed;
