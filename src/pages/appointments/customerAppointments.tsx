import { readCustomerAppointments } from "@redux/actions/appointmentAction";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import { NextPage } from "next";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAppointment } from "src/types/appointment";

const CustomerAppointments: NextPage = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
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

  const customerId = useSelector(AuthSelectors.getUserId);

  useEffect(() => {
    dispatch(readCustomerAppointments());
  }, [dispatch, customerId]);

  const appointmentsCard = (appointment: IAppointment) => {
    // id: string;
    // startTime: Date;
    // endTime: Date;
    // shopId: string;
    // customer: ICustomer;
    // quoteId: string | null;
    // serviceName: string;
    // price: Number;
    // status: AppointmentStatus;
    // workOrderId: string;
    // vehicle: IVehicle;

    // Need shop name, shop address, service description, date, shop phone number, date
    return (
      <div className="appointment-item">
        <div className="appointment-item-content">
          <div>
            <h4 className="mb-1">{appointment.serviceName}</h4>
            <h4 className="mb-1">{appointment.price.toString()}</h4>
            <h4 className="mb-1">{appointment.startTime.toDateString()}</h4>
            <h4 className="mb-1">{appointment.endTime.toDateString()}</h4>

            <div className="car-buttons mt-5">
              <Button
                icon="pi pi-search"
                className="p-button p-button-rounded mr-2"
              />
              <Button
                icon="pi pi-star-fill"
                className="p-button-success p-button-rounded mr-2"
              />
              <Button
                icon="pi pi-cog"
                className="p-button-help p-button-rounded"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/*Scheduled Appointments*/}
      <div className="card">
        <Carousel
          value={appointments}
          numVisible={3}
          numScroll={3}
          responsiveOptions={responsiveOptions}
          itemTemplate={appointmentsCard}
        />
      </div>

      {/*In Progress Appointments*/}
      <div className="card">
        <Carousel
          value={appointments}
          numVisible={3}
          numScroll={3}
          responsiveOptions={responsiveOptions}
          itemTemplate={appointmentsCard}
        />
      </div>

      {/*Past Appointments*/}
      <div className="card">
        <Carousel
          value={appointments}
          numVisible={3}
          numScroll={3}
          responsiveOptions={responsiveOptions}
          itemTemplate={appointmentsCard}
        />
      </div>
    </div>
  );
};

export default CustomerAppointments;
