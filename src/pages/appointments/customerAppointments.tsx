import { AppointmentStatus, UserType } from "@prisma/client";
import { readCustomerAppointments } from "@redux/actions/appointmentAction";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import { NextPage } from "next";
import { Carousel } from "primereact/carousel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ICustomerAppointment } from "src/types/appointment";

const CustomerAppointments: NextPage = () => {
  const [appointments, setAppointments] = useState<ICustomerAppointment[]>([]);
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
  const customerId =
    userType == UserType.CUSTOMER ? useSelector(AuthSelectors.getUserId) : null;

  useEffect(() => {
    dispatch(readCustomerAppointments());
  }, [dispatch, customerId]);

  useEffect(() => {
    const appointmentsList = appointments.sort(
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
    setScheduledAppointments(inProgressAppointmentsList);

    const pastAppointmentsList = appointmentsList.filter(
      (appointment: ICustomerAppointment) =>
        appointment.status == AppointmentStatus.COMPLETED
    );
    setScheduledAppointments(pastAppointmentsList);
  }, [appointments]);

  const appointmentsCard = (appointment: ICustomerAppointment) => {
    // Need shop name, shop address, serviceName, date, shop phone number, date
    // Call Leon's Get shop by Id
    return (
      <div className="appointment-item">
        <div className="appointment-item-content">
          <div>
            <h2 className="mb-1">{appointment.shopName}</h2>
            <h2 className="mb-1">{appointment.shopAddress}</h2>
            <h4 className="mb-1">{appointment.serviceName}</h4>
            <h4 className="mb-1">{appointment.startTime.toDateString()}</h4>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div>Scheduled Appointments</div>
      <div className="card">
        <Carousel
          value={appointments}
          numVisible={3}
          numScroll={1}
          responsiveOptions={responsiveOptions}
          itemTemplate={appointmentsCard}
        />
      </div>

      <div>In Progress Appointments</div>
      <div className="card">
        <Carousel
          value={appointments}
          numVisible={3}
          numScroll={1}
          responsiveOptions={responsiveOptions}
          itemTemplate={appointmentsCard}
        />
      </div>

      <div>Past Appointments</div>
      <div className="card">
        <Carousel
          value={appointments}
          numVisible={3}
          numScroll={1}
          responsiveOptions={responsiveOptions}
          itemTemplate={appointmentsCard}
        />
      </div>
    </div>
  );
};

export default CustomerAppointments;
