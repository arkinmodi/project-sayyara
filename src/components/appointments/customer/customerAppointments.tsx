import { UserType } from "@prisma/client";
import {
  readAppointments,
  setCancelAppointment,
} from "@redux/actions/appointmentAction";
import { AppointmentSelectors } from "@redux/selectors/appointmentSelectors";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/pages/appointments/CustomerAppointments.module.css";
import classNames from "classnames";
import Router from "next/router";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { ICustomerAppointment } from "src/types/appointment";
import { AppointmentStatus } from "../../../types/appointment";
import EditAppointmentDialog from "./editAppointmentDialog";

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

/**
 * Renders the appointments for a customer
 * Found in the route: /dashboard or My Service Requests > Service Requests
 * Contains the details of each appointment, such as their scheduled times, progression
 * of appointment (requested, accepted, in progress, past, rejected/cancelled)
 *
 * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
 * @date 03/08/2023
 * @returns A react component displaying the appointments of a customer
 */
const CustomerAppointments = () => {
  const appointments = useSelector(AppointmentSelectors.getAppointments);
  const [requestedAppointments, setRequestedAppointments] = useState<
    ICustomerAppointment[]
  >([]);
  const [inProgressAppointments, setInProgressAppointments] = useState<
    ICustomerAppointment[]
  >([]);
  const [scheduledAppointments, setScheduledAppointments] = useState<
    ICustomerAppointment[]
  >([]);
  const [pastAppointments, setPastAppointments] = useState<
    ICustomerAppointment[]
  >([]);
  const [rejectedOrCancelledAppointments, setRejectedOrCancelledAppointments] =
    useState<ICustomerAppointment[]>([]);
  const [_numItemVisible, setNumItemVisible] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<ICustomerAppointment | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelAppointmentDialog, setCancelAppointmentDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cancelledAppointmentId, setCancelledAppointmentId] = useState<
    string | null
  >(null);
  const toast = useRef<Toast>(null);

  /**
   * Carousel resizes items if there are less than numVisible items.
   * To prevent undesirable resizing of cards, we add placeholder cards.
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 02/11/2023
   * @param {ICustomerAppointment[]} appointments - A list of appointments
   * @param {number} numItemVisible - The number of appointments visible in the carousel
   * @returns An updated list of appointments
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

  /**
   * Renders the list of appointments for each carousel, with added placeholders
   * to prevent undesirable resizing
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 02/11/2023
   * @param {ICustomerAppointment[]} appointments - A list of appointments
   * @returns A list of updated appointments
   */
  const getAppointmentsWithPlaceholders = (
    appointments: ICustomerAppointment[]
  ) => {
    const width = window.outerWidth;
    switch (true) {
      case width > 767 && width <= 991:
        return addPlaceholderItems(appointments, 2);
      case width > 991:
        return addPlaceholderItems(appointments, 3);
      default:
        return appointments;
    }
  };

  const dispatch = useDispatch();
  const userType = useSelector(AuthSelectors.getUserType);
  const userId = useSelector(AuthSelectors.getUserId);
  const customerId = userType == UserType.CUSTOMER ? userId : null;

  useEffect(() => {
    if (customerId) {
      dispatch(readAppointments({ id: customerId }));
    }
  }, [dispatch, customerId]);

  /**
   * Debounces resizing window to prevent overload
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 02/11/2023
   * @param callback - Memoized function to debounce
   * @param {number} wait - Wait time between reloads in milliseconds
   * @returns A function with a timeout
   */
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
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 02/11/2023
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
  }, [handleResize]);

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

    const requestedAppointmentsList = appointmentsList.filter(
      (appointment: ICustomerAppointment) =>
        appointment.status == AppointmentStatus.PENDING_APPROVAL
    );
    setRequestedAppointments(requestedAppointmentsList);

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

    const rejectedOrCancelledAppointmentsList = appointmentsList.filter(
      (appointment: ICustomerAppointment) =>
        appointment.status == AppointmentStatus.CANCELLED ||
        appointment.status == AppointmentStatus.REJECTED
    );
    setRejectedOrCancelledAppointments(rejectedOrCancelledAppointmentsList);
  }, [appointments]);

  // Renders toast is toast is visible
  const showToast = () => {
    if (toast.current) {
      toast.current.show({
        severity: "info",
        detail: "Appointment cancelled",
        sticky: true,
      });
    }
  };

  /**
   * Function to format dates
   * Format to the form: MMM DD, YYYY, HH:MM AM/PM
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 03/08/2023
   * @param {Date} d - Date to be formatted
   * @param {boolean} showSeconds - Flag to show seconds
   * @returns A formatted date
   */
  const formatDate = (d: Date, showSeconds: boolean = false) => {
    return new Intl.DateTimeFormat("en-us", {
      dateStyle: "medium",
      timeStyle: showSeconds ? "medium" : "short",
    }).format(d);
  };

  /**
   * Handles cancellation of an appointment
   * Displays cancellation toast
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 03/05/2023
   */
  const cancelAppointment = () => {
    setSubmitted(true);
    if (cancellationReason.length > 0 && cancelledAppointmentId != null) {
      dispatch(
        setCancelAppointment({
          id: cancelledAppointmentId,
          reason: cancellationReason,
        })
      );
      setCancelAppointmentDialog(false);
      showToast();
    }
  };

  // Hides cancel appointment dialog
  const hideCancelAppointmentDialog = () => {
    setSubmitted(false);
    setCancelAppointmentDialog(false);
    setCancellationReason("");
  };

  /**
   * Handles the button click of cancelling an appointment
   * Opens the cancel appointment dialog
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 03/05/2023
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e - React mouse event
   * @param {string} id - Appointment ID
   */
  const cancelAppointmentDialogFooter = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    setCancelAppointmentDialog(true);
    setCancelledAppointmentId(id);
  };

  const deleteProductDialogFooter = (
    <div className={styles.buttonsDivStyle}>
      <Button
        className={"blueButton"}
        label="No"
        icon="pi pi-times"
        onClick={hideCancelAppointmentDialog}
      />
      <Button
        className={"greenButton"}
        label="Yes"
        icon="pi pi-check"
        onClick={cancelAppointment}
      />
    </div>
  );

  /**
   * Handles input changes in the cancellation reason field
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 03/05/2023
   * @param {ChangeEvent<HTMLInputElement>} e - React change event
   */
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ?? "";
    setCancellationReason(val);
  };

  /**
   * Handles the button click of editing an appointment
   * Opens the edit appointment dialog
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 03/08/2023
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e - React mouse event
   * @param {ICustomerAppointment} appointment - Appointment object
   */
  const openEditAppointmentDialog = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    appointment: ICustomerAppointment
  ) => {
    e.stopPropagation();
    setSelectedAppointment(appointment);
    setOpenEditDialog(true);
  };

  // Hides edit appointment dialog
  const closeEditAppointmentDialog = () => {
    setOpenEditDialog(false);
  };

  /**
   * Renders an appointment card for a specific appointment
   * Contains shop name and address, service name, and appointment time
   * Routes to the specific appointment's work order
   * Contains buttons to edit or cancel the appointment, depending on the status of the appointment
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 03/08/2023
   * @param {ICustomerAppointment | null} appointment - Appointment object
   * @returns A react component for a customer appointment
   */
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
              <h4
                className="mb-1"
                style={{
                  display:
                    appointment.status === AppointmentStatus.CANCELLED
                      ? "block"
                      : "none",
                }}
              >
                {`Cancellation Reason: ${
                  (appointment as ICustomerAppointment).cancellationReason
                    ? (appointment as ICustomerAppointment).cancellationReason
                    : "cancelled"
                }`}
              </h4>
              <h4
                className="mb-1"
                style={{
                  display:
                    appointment.status === AppointmentStatus.REJECTED
                      ? "block"
                      : "none",
                }}
              >
                Service Request Rejected
              </h4>
              <h2
                className="mb-1"
                style={{
                  display:
                    appointment.status === AppointmentStatus.CANCELLED ||
                    appointment.status === AppointmentStatus.REJECTED
                      ? "none"
                      : "block",
                }}
              >
                {(appointment as ICustomerAppointment).shopAddress}
              </h2>
              <h4 className="mb-1">
                {(appointment as ICustomerAppointment).serviceName}
              </h4>
              <h4 className="mb-1">
                {`${formatDate(
                  new Date(appointment.startTime)
                )} to ${formatDate(new Date(appointment.endTime))}`}
              </h4>
              {(appointment as ICustomerAppointment).status ===
                AppointmentStatus.ACCEPTED ||
              (appointment as ICustomerAppointment).status ===
                AppointmentStatus.PENDING_APPROVAL ? (
                <div className={styles.buttonsDivStyle}>
                  <Button
                    label="Cancel"
                    className={styles.appointmentButtonRed}
                    onClick={(e) =>
                      cancelAppointmentDialogFooter(e, appointment.id)
                    }
                  />
                  <Button
                    label="Edit"
                    className={styles.appointmentButtonBlue}
                    onClick={(e) =>
                      openEditAppointmentDialog(
                        e,
                        appointment as ICustomerAppointment
                      )
                    }
                  />
                </div>
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
      <Toast ref={toast} />
      <Accordion multiple={true} activeIndex={[0, 1, 2, 3, 4]}>
        <AccordionTab header="Requested Services">
          <div className={styles.appointmentsCarousel}>
            {requestedAppointments.length > 0 ? (
              <Carousel
                value={getAppointmentsWithPlaceholders(requestedAppointments)}
                numVisible={3}
                numScroll={1}
                responsiveOptions={responsiveOptions}
                itemTemplate={appointmentsCard}
              />
            ) : (
              <div> No requested services.</div>
            )}
          </div>
        </AccordionTab>
        <AccordionTab header="Scheduled Services">
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
        </AccordionTab>
        <AccordionTab header="In Progress Services">
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
        </AccordionTab>
        <AccordionTab header="Past Services">
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
        </AccordionTab>
        <AccordionTab header="Rejected/Cancelled Services">
          <div className={styles.appointmentsCarousel}>
            {rejectedOrCancelledAppointments.length > 0 ? (
              <Carousel
                value={getAppointmentsWithPlaceholders(
                  rejectedOrCancelledAppointments
                )}
                numVisible={3}
                numScroll={1}
                responsiveOptions={responsiveOptions}
                itemTemplate={appointmentsCard}
              />
            ) : (
              <div> No rejected or cancelled services.</div>
            )}
          </div>
        </AccordionTab>
      </Accordion>
      <div
        style={{
          display:
            openEditDialog && selectedAppointment != null ? "block" : "none",
        }}
      >
        <EditAppointmentDialog
          appointment={selectedAppointment!!}
          visible={openEditDialog}
          onHide={closeEditAppointmentDialog}
        />
      </div>
      <Dialog
        visible={cancelAppointmentDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm Cancellation"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideCancelAppointmentDialog}
      >
        <div className={styles.cancelInputText}>
          <label className={styles.cancelInputBox} htmlFor="reason">
            Please enter a reason for cancellation:
          </label>
          <InputText
            id="reason"
            name="reason"
            value={cancellationReason}
            onChange={onInputChange}
            required
            autoFocus
            className={classNames(styles.cancelInputBox, {
              "p-invalid": submitted && cancellationReason === "",
            })}
          />
          {submitted && cancellationReason === "" && (
            <small className="p-error">Cancellation reason required</small>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default React.memo(CustomerAppointments);
