import { AppointmentSelectors } from "@redux/selectors/appointmentSelectors";
import AppointmentTypes from "@redux/types/appointmentTypes";
import styles from "@styles/pages/appointments/Requests.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppointmentStatus, IAppointment } from "../../../types/appointment";
import AppointmentCard from "./appointmentCard";

const InProgress = () => {
  const dispatch = useDispatch();

  const appointments = useSelector(AppointmentSelectors.getAppointments);

  const [inProgressAppointmentsMap, setInProgressAppointmentsMap] = useState<{
    [key: string]: Array<IAppointment>;
  }>({});

  useEffect(() => {
    dispatch({ type: AppointmentTypes.READ_APPOINTMENTS });
  }, [dispatch]);

  useEffect(() => {
    const inProgressAppointments = appointments
      .filter(
        (appointment: IAppointment) =>
          appointment.status == AppointmentStatus.IN_PROGRESS
      )
      .sort((appointment1: IAppointment, appointment2: IAppointment) => {
        return (
          new Date(appointment1.startTime).getTime() -
          new Date(appointment2.startTime).getTime()
        );
      });

    console.log(inProgressAppointments);
    //put the appointments in a map of lists depending on the date
    var inProgressAppointmentsMap: { [key: string]: IAppointment[] } = {};

    for (var appointment of inProgressAppointments) {
      var date = new Date(appointment.startTime).toDateString();
      if (!(date in inProgressAppointmentsMap)) {
        inProgressAppointmentsMap[date] = [];
      }
      inProgressAppointmentsMap[date]!.push(appointment);
    }
    setInProgressAppointmentsMap(inProgressAppointmentsMap);
  }, [appointments, setInProgressAppointmentsMap]);

  function listAppointmentCards(date: string) {
    let content: any = [];
    {
      inProgressAppointmentsMap[date]!.forEach((appointment) => {
        content.push(
          <AppointmentCard
            appointment={appointment}
            appointmentProgress={AppointmentStatus.IN_PROGRESS}
          />
        );
      });
    }

    return content;
  }

  function listAllAppointments() {
    let content: any = [];
    Object.keys(inProgressAppointmentsMap).forEach((date) => {
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
      {Object.entries(inProgressAppointmentsMap).length > 0 ? (
        listAllAppointments()
      ) : (
        <div className={styles.appointmentRequestsCardText}>
          No in progress appointments
        </div>
      )}
    </div>
  );
};

export default InProgress;
