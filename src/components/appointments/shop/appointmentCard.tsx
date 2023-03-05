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

const AppointmentCard = (props: IAppointmentCardProps) => {
  const dispatch = useDispatch();

  const {
    appointment,
    appointmentProgress,
    showToast,
    toggleActiveTab,
    onOpenCancelDialog,
  } = props;

  const hideDialog = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.stopPropagation();
    onOpenCancelDialog(appointment.id);
  };

  const handleButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    appointment: IAppointment,
    status: AppointmentStatus
  ): void => {
    e.stopPropagation();
    showToast(status);
    dispatch(setAppointmentStatus({ id: appointment.id, status: status }));
  };

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
            onClick={(e) => hideDialog(e)}
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
              {`Customer Name: ${appointment.customer.first_name} ${appointment.customer.last_name}`}
            </b>
          </div>
          <div>Customer Phone Number: {appointment.customer.phone_number}</div>
          <div>
            Start time: {new Date(appointment.startTime).toLocaleString()}
          </div>
          <div>
            End time: {String(new Date(appointment.endTime).toLocaleString())}
          </div>
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
