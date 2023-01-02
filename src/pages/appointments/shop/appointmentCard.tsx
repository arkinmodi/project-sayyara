import styles from "@styles/pages/appointments/Requests.module.css";
import { NextPage } from "next";
import { Card } from "primereact/card";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { IAppointment } from "../../../types/appointment";

// TODO: pass in information of a specific information, creates the cards with the information and then buttons to cancel, accept, etc.
const AppointmentCard: NextPage = () => {
  const [pendingAppointments, setPendingAppointments] = useState<
    IAppointment[]
  >([]);
  const dispatch = useDispatch();

  return (
    <div className={styles.appointmentRequestsContainer}>
      <Card className={styles.appointmentRequestsCard}></Card>
    </div>
  );
};

export default AppointmentCard;
