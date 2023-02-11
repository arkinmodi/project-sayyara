import { UserType } from "@prisma/client";
import {
  readAppointments,
  setAppointmentStatus,
} from "@redux/actions/appointmentAction";
import { AppointmentSelectors } from "@redux/selectors/appointmentSelectors";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/pages/appointments/CustomerAppointments.module.css";
import Router from "next/router";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ICustomerAppointment } from "src/types/appointment";
import { AppointmentStatus } from "../../../types/appointment";

const CustomerAppointments = () => {
  const appointments = useSelector(AppointmentSelectors.getAppointments);
  const [inProgressAppointments, setInProgressAppointments] = useState<
    ICustomerAppointment[]
  >([]);
  const [scheduledAppointments, setScheduledAppointments] = useState<
    ICustomerAppointment[]
  >([]);
  const [pastAppointments, setPastAppointments] = useState<
    ICustomerAppointment[]
  >([]);

  const responsiveOptions = [
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: "991px",
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: "767px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const dispatch = useDispatch();
  const userType = useSelector(AuthSelectors.getUserType);
  const userId = useSelector(AuthSelectors.getUserId);
  const customerId = userType == UserType.CUSTOMER ? userId : null;

  useEffect(() => {
    if (customerId) {
      dispatch(readAppointments({ id: customerId }));
    }
  }, [dispatch, customerId]);

  useEffect(() => {
    const appointmentValues = Object.values(appointments);
    const appointmentsList = appointmentValues.sort(
      (
        appointment1: ICustomerAppointment,
        appointment2: ICustomerAppointment
      ) => {
        return (
          new Date(appointment1.startTime).getTime() -
          new Date(appointment2.startTime).getTime()
        );
      }
    );

    const scheduledAppointmentsList = appointmentsList.filter(
      (appointment: ICustomerAppointment) =>
        appointment.status == AppointmentStatus.ACCEPTED
    );
    setScheduledAppointments(scheduledAppointmentsList);

    const inProgressAppointmentsList = appointmentsList.filter(
      (appointment: ICustomerAppointment) =>
        appointment.status == AppointmentStatus.IN_PROGRESS
    );
    setInProgressAppointments(inProgressAppointmentsList);

    const pastAppointmentsList = appointmentsList.filter(
      (appointment: ICustomerAppointment) =>
        appointment.status == AppointmentStatus.COMPLETED
    );
    setPastAppointments(pastAppointmentsList);
  }, [appointments]);

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    appointment: ICustomerAppointment,
    status: AppointmentStatus
  ): void => {
    e.stopPropagation();
    dispatch(setAppointmentStatus({ id: appointment.id, status: status }));
  };

  const appointmentsCard = (appointment: ICustomerAppointment) => {
    return (
      <div
        className={styles.appointmentCarouselCard}
        onClick={() =>
          Router.push(`/shop/work-orders/${appointment.workOrderId}`)
        }
      >
        <div>
          <h2 className="mb-1">{appointment.shopName}</h2>
          <h2 className="mb-1">{appointment.shopAddress}</h2>
          <h4 className="mb-1">{appointment.serviceName}</h4>
          <h4 className="mb-1">
            {new Date(appointment.startTime).toLocaleString()}
          </h4>
          {appointment.status === AppointmentStatus.ACCEPTED ? (
            <Button
              label="Cancel"
              className={styles.appointmentButtonRed}
              onClick={(e) =>
                handleButtonClick(e, appointment, AppointmentStatus.REJECTED)
              }
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>Scheduled Appointments</h2>
      <div className={styles.appointmentsCarousel}>
        <Carousel
          value={scheduledAppointments}
          numVisible={3}
          numScroll={1}
          responsiveOptions={responsiveOptions}
          itemTemplate={appointmentsCard}
        />
      </div>

      <h2>In Progress Appointments</h2>
      <div className={styles.appointmentsCarousel}>
        <Carousel
          value={inProgressAppointments}
          numVisible={3}
          numScroll={1}
          responsiveOptions={responsiveOptions}
          itemTemplate={appointmentsCard}
        />
      </div>

      <h2>Past Appointments</h2>
      <div className={styles.appointmentsCarousel}>
        <Carousel
          value={pastAppointments}
          numVisible={3}
          numScroll={1}
          responsiveOptions={responsiveOptions}
          itemTemplate={appointmentsCard}
        />
      </div>
    </div>
  );
};

export default React.memo(CustomerAppointments);
