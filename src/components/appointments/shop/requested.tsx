import { AppointmentSelectors } from "@redux/selectors/appointmentSelectors";
import AppointmentTypes from "@redux/types/appointmentTypes";
import styles from "@styles/pages/appointments/Requests.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppointmentStatus, IAppointment } from "../../../types/appointment";
import AppointmentCard from "./appointmentCard";

const Requested = () => {
  const dispatch = useDispatch();

  const appointments = useSelector(AppointmentSelectors.getAppointments);

  const [pendingAppointmentsMap, setPendingAppointmentsMap] = useState<{
    [key: string]: Array<IAppointment>;
  }>({});

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
    var pendingAppointmentsMap: { [key: string]: IAppointment[] } = {};

    for (var appointment of pendingAppointments) {
      var date = new Date(appointment.startTime).toDateString();
      if (!(date in pendingAppointmentsMap)) {
        pendingAppointmentsMap[date] = [];
      }
      pendingAppointmentsMap[date]!.push(appointment);
      console.log(appointment);
    }
    setPendingAppointmentsMap(pendingAppointmentsMap);
    console.log(pendingAppointmentsMap);
  }, [appointments, setPendingAppointmentsMap]);

  function listAppointmentCards(date: string) {
    let content: any = [];
    {
      pendingAppointmentsMap[date]!.forEach((appointment) => {
        content.push(<AppointmentCard appointment={appointment} />);
      });
    }

    return content;
  }

  function listAllAppointments() {
    let content: any = [];
    Object.keys(pendingAppointmentsMap).forEach((date) => {
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
      {console.log(pendingAppointmentsMap)}
      {Object.entries(pendingAppointmentsMap).length > 0 ? (
        listAllAppointments()
      ) : (
        <div className={styles.appointmentRequestsCardText}>
          No pending appointments
        </div>
      )}
    </div>
  );
};

export default Requested;
