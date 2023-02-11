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
import { Fieldset } from "primereact/fieldset";
import React, { useCallback, useEffect, useState } from "react";
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
  const [_numItemVisible, setNumItemVisible] = useState(0);

  /**
   * Carousel resizes items if there are less than numVisible items.
   * To prevent undesirable resizing of cards, we add placeholder cards.
   */
  const addPlaceholderItems = (
    appointments: ICustomerAppointment[],
    numItemVisible: number
  ) => {
    const updatedItems: (ICustomerAppointment | null)[] = [...appointments];
    while (updatedItems.length % numItemVisible !== 0) {
      updatedItems.push(null);
    }

    return updatedItems;
  };

  const getAppointmentsWithPlaceholders = (
    appointments: ICustomerAppointment[]
  ) => {
    const width = window.innerWidth;
    switch (true) {
      case width < 767:
        return addPlaceholderItems(appointments, 1);
      case width > 767 && width < 991:
        return addPlaceholderItems(appointments, 2);
      default:
        return addPlaceholderItems(appointments, 3);
    }
  };

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

  const debounce = (callback: () => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: []) => {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => callback.apply(context, args), wait);
    };
  };

  /**
   * Listen to window size to trigger re-render of carousel.
   * Debounce window resize to prevent overload.
   */
  const handleResize = useCallback(
    debounce(() => {
      const width = window.innerWidth;
      switch (true) {
        case width <= 767:
          setNumItemVisible(1);
          break;
        case width > 767 && width <= 991:
          setNumItemVisible(2);
          break;
        default:
          setNumItemVisible(3);
          break;
      }
    }, 1000),
    []
  );

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);

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

  const appointmentsCard = (appointment: ICustomerAppointment | null) => {
    return (
      <div className={styles.appointmentCarouselCardContainer}>
        {appointment ? (
          <div
            className={styles.appointmentCarouselCard}
            onClick={() =>
              Router.push(
                `/shop/work-orders/${
                  (appointment as ICustomerAppointment).workOrderId
                }`
              )
            }
          >
            <div>
              <h2 className="mb-1">
                {(appointment as ICustomerAppointment).shopName}
              </h2>
              <h2 className="mb-1">
                {(appointment as ICustomerAppointment).shopAddress}
              </h2>
              <h4 className="mb-1">
                {(appointment as ICustomerAppointment).serviceName}
              </h4>
              <h4 className="mb-1">
                {new Date(
                  (appointment as ICustomerAppointment).startTime
                ).toLocaleString()}
              </h4>
              {(appointment as ICustomerAppointment).status ===
              AppointmentStatus.ACCEPTED ? (
                <Button
                  label="Cancel"
                  className={styles.appointmentButtonRed}
                  onClick={(e) =>
                    handleButtonClick(
                      e,
                      appointment as ICustomerAppointment,
                      AppointmentStatus.REJECTED
                    )
                  }
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.appointmentCarouselCardPlaceholder}></div>
        )}
      </div>
    );
  };

  return (
    <div>
      <Fieldset
        className={styles.carouselFieldSet}
        toggleable={true}
        legend="Scheduled Services"
      >
        <div className={styles.appointmentsCarousel}>
          {scheduledAppointments.length > 0 ? (
            <Carousel
              value={getAppointmentsWithPlaceholders(scheduledAppointments)}
              numVisible={3}
              numScroll={1}
              responsiveOptions={responsiveOptions}
              itemTemplate={appointmentsCard}
            />
          ) : (
            <div> No scheduled services.</div>
          )}
        </div>
      </Fieldset>
      <Fieldset
        className={styles.carouselFieldSet}
        toggleable={true}
        legend="In Progress Services"
      >
        <div className={styles.appointmentsCarousel}>
          {inProgressAppointments.length > 0 ? (
            <Carousel
              value={getAppointmentsWithPlaceholders(inProgressAppointments)}
              numVisible={3}
              numScroll={1}
              responsiveOptions={responsiveOptions}
              itemTemplate={appointmentsCard}
            />
          ) : (
            <div> No in progress services.</div>
          )}
        </div>
      </Fieldset>
      <Fieldset
        className={styles.carouselFieldSet}
        toggleable={true}
        legend="Past Services"
      >
        <div className={styles.appointmentsCarousel}>
          {pastAppointments.length > 0 ? (
            <Carousel
              value={getAppointmentsWithPlaceholders(pastAppointments)}
              numVisible={3}
              numScroll={1}
              responsiveOptions={responsiveOptions}
              itemTemplate={appointmentsCard}
            />
          ) : (
            <div> No past services.</div>
          )}
        </div>
      </Fieldset>
    </div>
  );
};

export default React.memo(CustomerAppointments);
