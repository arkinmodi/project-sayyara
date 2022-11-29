import AppointmentTypes from "@redux/types/appointmentTypes";
import styles from "@styles/pages/appointments/Create.module.css";
import { NextPage } from "next";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ServiceType } from "src/types/service";

const Create: NextPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [serviceType, setServiceType] = useState<ServiceType>(
    ServiceType.CANNED
  );

  const dispatch = useDispatch();

  const handleRequestSubmit = (): void => {
    const startDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      startTime.getHours(),
      startTime.getMinutes(),
      startTime.getSeconds()
    ).toString();
    const endDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      endTime.getHours(),
      endTime.getMinutes(),
      endTime.getSeconds()
    ).toString();

    dispatch({
      type: AppointmentTypes.CREATE_APPOINTMENT,
      payload: { serviceType, startTime: startDate, endTime: endDate },
    });
  };

  return (
    <div className={styles.createAppointmentContainer}>
      <Card className={styles.createAppointmentFormCard}>
        <div className={styles.createAppointmentFormHeader}>
          <i className="pi pi-calendar-plus" style={{ fontSize: "2em" }} />
          <h1>Create an Appointment</h1>
        </div>
        <div>
          <div>
            <h4>Appointment Type (Required)</h4>
            <Dropdown
              value={serviceType}
              placeholder={serviceType}
              options={[
                ServiceType.CANNED,
                ServiceType.CUSTOM,
                ServiceType.REWORK,
              ]}
              onChange={(e) => setServiceType(e.value)}
            />
          </div>
          <div>
            <h4>Appointment Date (Required)</h4>
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value as Date)} // TODO: proper typing
            />
          </div>
          <div>
            <h4>Start Time (Required)</h4>
            <Calendar
              timeOnly
              hourFormat="12"
              value={startTime}
              onChange={(e) => setStartTime(e.value as Date)}
            />
          </div>
          <div>
            <h4>End Time (Required)</h4>
            <Calendar
              timeOnly
              hourFormat="12"
              value={endTime}
              onChange={(e) => setEndTime(e.value as Date)}
            />
          </div>
        </div>
        <Button label="Submit Appointment" onClick={handleRequestSubmit} />
      </Card>
    </div>
  );
};

export default Create;
