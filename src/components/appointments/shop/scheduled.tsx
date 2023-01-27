import { AppointmentSelectors } from "@redux/selectors/appointmentSelectors";
import AppointmentTypes from "@redux/types/appointmentTypes";
import styles from "@styles/pages/appointments/Requests.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppointmentStatus, IAppointment } from "../../../types/appointment";
import AppointmentCard from "./appointmentCard";

const Scheduled = () => {
  const dispatch = useDispatch();

  const appointments = useSelector(AppointmentSelectors.getAppointments);

  const [scheduledAppointmentMap, setScheduledAppointmentMap] = useState<{
    [key: string]: Array<IAppointment>;
  }>({});

  useEffect(() => {
    dispatch({ type: AppointmentTypes.READ_APPOINTMENTS });
  }, [dispatch]);

  useEffect(() => {
    const scheduledAppointments = appointments
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
    var scheduledAppointmentMap: { [key: string]: IAppointment[] } = {};

    for (var appointment of scheduledAppointments) {
      var date = new Date(appointment.startTime).toDateString();
      if (!(date in scheduledAppointmentMap)) {
        scheduledAppointmentMap[date] = [];
      }
      scheduledAppointmentMap[date]!.push(appointment);
    }
    setScheduledAppointmentMap(scheduledAppointmentMap);
  }, [appointments, setScheduledAppointmentMap]);

  function listAppointmentCards(date: string) {
    let content: any = [];
    {
      scheduledAppointmentMap[date]!.forEach((appointment) => {
        content.push(
          <AppointmentCard
            appointment={appointment}
            appointmentProgress={AppointmentStatus.ACCEPTED}
          />
        );
      });
    }

    return content;
  }

  function listAllAppointments() {
    let content: any = [];
    Object.keys(scheduledAppointmentMap).forEach((date) => {
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
      {Object.entries(scheduledAppointmentMap).length > 0 ? (
        listAllAppointments()
      ) : (
        <div className={styles.appointmentRequestsCardText}>
          No scheduled appointments
        </div>
      )}
    </div>
  );
};

export default Scheduled;
