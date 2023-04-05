import { setAppointmentStatus } from "@redux/actions/appointmentAction";
import { setSelectedChat } from "@redux/actions/quoteAction";
import styles from "@styles/pages/appointments/ShopAppointments.module.css";
import classNames from "classnames";
import { default as Router } from "next/router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React from "react";
import { useDispatch } from "react-redux";
import { AppointmentStatus, IAppointment } from "../../../types/appointment";

interface IAppointmentCardProps {
  appointment: IAppointment;
  appointmentProgress: AppointmentStatus;
  showToast: (status: AppointmentStatus) => void;
  toggleActiveTab: () => void;
  onOpenCancelDialog: (id: string) => void;
}

/**
 * Renders the appointment card for a shop user
 * Contains details including the service, customer name, contact details, and car information
 * as well as appointment times
 * Also includes buttons to change appointment status
 *
 * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 03/08/2023
 * @param {IAppointmentCardProps} props - Appointment card props
 * @returns A react component for an appointment
 */
const AppointmentCard = (props: IAppointmentCardProps) => {
  const dispatch = useDispatch();

  const {
    appointment,
    appointmentProgress,
    showToast,
    toggleActiveTab,
    onOpenCancelDialog,
  } = props;

  /**
   * Handles opening of the dialog related to cancelling an appointment
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 03/05/2023
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e - React mouse event
   */
  const openDialog = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.stopPropagation();
    onOpenCancelDialog(appointment.id);
  };

  /**
   * Handles the button to move the appointment to the next appointment status
   * Next appointment depends on the specific button
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 01/30/2023
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} e - React mouse event
   * @param {IAppointment} appointment - Appointment object
   * @param {AppointmentStatus} status - Appointment status
   */
  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    appointment: IAppointment,
    status: AppointmentStatus
  ): void => {
    e.stopPropagation();
    showToast(status);
    dispatch(setAppointmentStatus({ id: appointment.id, status: status }));
  };

  /**
   * Handles user click of "view quote"
   * Redirects to the related quote
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 02/13/2023
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e - React mouse event
   * @param {IAppointment} appointment - Appointment object
   */
  const viewQuoteClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    appointment: IAppointment
  ): void => {
    e.stopPropagation();
    if (appointment.quoteId) {
      dispatch(setSelectedChat({ id: appointment.quoteId }));
    }
    toggleActiveTab();
  };

  /**
   * Function to format dates
   * Format to the form: MMM DD, YYYY, HH:MM AM/PM
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 03/08/2023
   * @param {Date} d - Date to be formatted
   * @param {boolean} showSeconds - Boolean flag to show seconds in format
   * @returns Formatted date
   */
  const formatDate = (d: Date, showSeconds: boolean = false) => {
    return new Intl.DateTimeFormat("en-us", {
      dateStyle: "medium",
      timeStyle: showSeconds ? "medium" : "short",
    }).format(d);
  };

  /**
   * Handles rendering the requested services' right components
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 01/30/2023
   * @returns A react component containing the buttons and text
   */
  const renderRequestedCardLeft = () => {
    return (
      <div className={styles.textAlign}>
        <div
          className={styles.grayText}
          style={{
            display:
              appointment.quoteId == null || appointment.quoteId === ""
                ? "none"
                : "block",
          }}
          onClick={(e) => viewQuoteClick(e, appointment)}
        >
          View Quote
        </div>
        <div>
          <Button
            label="Reject"
            className={classNames(
              styles.appointmentButtonBlue,
              styles.appointmentCardButton
            )}
            onClick={(e) =>
              handleButtonClick(e, appointment, AppointmentStatus.REJECTED)
            }
          />
          <Button
            label="Accept"
            className={classNames(
              styles.appointmentButtonGreen,
              styles.appointmentCardButton
            )}
            onClick={(e) =>
              handleButtonClick(e, appointment, AppointmentStatus.ACCEPTED)
            }
          />
        </div>
        <div>Estimated Price: ${appointment.price.toFixed(2).toString()}</div>
      </div>
    );
  };

  /**
   * Handles rendering the scheduled services' right components
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 01/30/2023
   * @returns A react component containing the buttons and text
   */
  const renderScheduledCardLeft = () => {
    return (
      <div className={styles.textAlign}>
        <div
          className={styles.grayText}
          style={{
            display:
              appointment.quoteId == null || appointment.quoteId === ""
                ? "none"
                : "block",
          }}
          onClick={(e) => viewQuoteClick(e, appointment)}
        >
          View Quote
        </div>
        <div>
          <Button
            label="Cancel"
            className={classNames(
              styles.appointmentButtonRed,
              styles.appointmentCardButton
            )}
            onClick={(e) => openDialog(e)}
          />
          <Button
            label="In Progress"
            className={classNames(
              styles.appointmentButtonGreen,
              styles.appointmentCardButton
            )}
            onClick={(e) =>
              handleButtonClick(e, appointment, AppointmentStatus.IN_PROGRESS)
            }
          />
        </div>
        <div>Estimated Price: ${appointment.price.toFixed(2).toString()}</div>
      </div>
    );
  };

  /**
   * Handles rendering the in progress services' right components
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 01/30/2023
   * @returns A react component containing the buttons and text
   */
  const renderInProgressCardLeft = () => {
    return (
      <div className={styles.textAlign}>
        <Button
          label="Complete"
          className={classNames(
            styles.appointmentButtonGreen,
            styles.appointmentCardButton
          )}
          onClick={(e) =>
            handleButtonClick(e, appointment, AppointmentStatus.COMPLETED)
          }
        />
      </div>
    );
  };

  /**
   * Renders the services' right components
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 01/30/2023
   * @param appointmentProgress
   * @returns A react component containing the buttons and text
   */
  const renderCardLeft = (appointmentProgress: AppointmentStatus) => {
    switch (appointmentProgress) {
      case AppointmentStatus.PENDING_APPROVAL:
        return renderRequestedCardLeft();
      case AppointmentStatus.ACCEPTED:
        return renderScheduledCardLeft();
      case AppointmentStatus.IN_PROGRESS:
        return renderInProgressCardLeft();
      default:
    }
  };

  return (
    <Card
      className={styles.appointmentCard}
      onClick={() =>
        Router.push(`/shop/work-orders/${appointment.workOrderId}`)
      }
    >
      <div className={styles.cardContents}>
        <div>
          <h3 className={styles.serviceNameHeaderText}>
            {appointment.serviceName}
          </h3>
          <h4
            style={{
              display:
                appointment.status === AppointmentStatus.CANCELLED
                  ? "block"
                  : "none",
            }}
          >
            Cancellation Reason: {appointment.cancellationReason}
          </h4>
          <div>
            <b>
              {`Customer Name: ${appointment.customer.firstName} ${appointment.customer.lastName}`}
            </b>
          </div>
          <div>Customer Phone Number: {appointment.customer.phoneNumber}</div>
          <div>Start time: {formatDate(new Date(appointment.startTime))}</div>
          <div>End time: {formatDate(new Date(appointment.endTime))}</div>
          <br />
          <div>Vehicle Make: {appointment.vehicle?.make}</div>
          <div>Vehicle Model: {appointment.vehicle?.model}</div>
          <div>Manufacture Year: {appointment.vehicle?.year.toString()}</div>
        </div>
        <div>{renderCardLeft(appointmentProgress)}</div>
      </div>
    </Card>
  );
};

export default React.memo(AppointmentCard);
