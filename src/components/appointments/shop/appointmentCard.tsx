import { setAppointmentStatus } from "@redux/actions/appointmentAction";
import styles from "@styles/pages/appointments/ShopAppointments.module.css";
import classNames from "classnames";
import Router from "next/router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React from "react";
import { useDispatch } from "react-redux";
import { AppointmentStatus, IAppointment } from "../../../types/appointment";

interface IAppointmentCardProps {
  appointment: IAppointment;
  appointmentProgress: AppointmentStatus;
}

const AppointmentCard = (props: IAppointmentCardProps) => {
  const dispatch = useDispatch();

  const { appointment, appointmentProgress } = props;

  const handleButtonClick = (
    appointment: IAppointment,
    status: AppointmentStatus
  ): void => {
    dispatch(setAppointmentStatus({ id: appointment.id, status: status }));
  };

  const renderRequestedCardLeft = () => {
    return (
      <div className={styles.textAlign}>
        {/* TODO: Link to quote and pass in quote id */}
        <div className={styles.grayText}>View Quote </div>
        <div>
          <Button
            label="Reject"
            className={classNames(
              styles.appointmentButtonBlue,
              styles.appointmentCardButton
            )}
            onClick={() =>
              handleButtonClick(appointment, AppointmentStatus.REJECTED)
            }
          />
          <Button
            label="Accept"
            className={classNames(
              styles.appointmentButtonGreen,
              styles.appointmentCardButton
            )}
            onClick={() =>
              handleButtonClick(appointment, AppointmentStatus.ACCEPTED)
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
        {/* TODO: Link to quote and pass in quote id */}
        <div className={styles.grayText}>View Quote </div>
        <div>
          <Button
            label="Cancel"
            className={classNames(
              styles.appointmentButtonRed,
              styles.appointmentCardButton
            )}
            onClick={() =>
              handleButtonClick(appointment, AppointmentStatus.REJECTED)
            }
          />
          <Button
            label="In Progress"
            className={classNames(
              styles.appointmentButtonGreen,
              styles.appointmentCardButton
            )}
            onClick={() =>
              handleButtonClick(appointment, AppointmentStatus.IN_PROGRESS)
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
          onClick={() =>
            handleButtonClick(appointment, AppointmentStatus.COMPLETED)
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
          <div>
            Customer Name:{" "}
            {appointment.customer.first_name +
              " " +
              appointment.customer.last_name}
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
