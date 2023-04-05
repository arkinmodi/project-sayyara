import { usePrevious } from "@components/hooks/usePrevious";
import { setCancelAppointment } from "@redux/actions/appointmentAction";
import { readShopAppointments } from "@redux/actions/shopActions";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import { ShopSelectors } from "@redux/selectors/shopSelector";
import styles from "@styles/pages/appointments/ShopAppointments.module.css";
import classNames from "classnames";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppointmentStatus, IAppointment } from "../../../types/appointment";
import AppointmentCard from "./appointmentCard";

interface IAppointmentsProps {
  appointmentTab: AppointmentStatus;
  toggleActiveTab: () => void;
}

/**
 * Renders the entire service requests tab for shop users
 * Also includes all the success and failure toasts
 *
 * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
 * @date 03/08/2023
 * @param {IAppointmentsProps} props - Appointment props
 * @returns A react component containing all the service requests and tabs displayed for shop users
 */
const ShopAppointments = (props: IAppointmentsProps) => {
  const dispatch = useDispatch();

  const appointments = useSelector(ShopSelectors.getShopAppointments);

  const { appointmentTab, toggleActiveTab } = props;

  const [appointmentsMap, setAppointmentsMap] = useState<{
    [key: string]: Array<IAppointment>;
  }>({});

  const [loading, setLoading] = useState(true);

  const [cancellationReason, setCancellationReason] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const [cancelledAppointmentId, setCancelledAppointmentId] = useState<
    string | null
  >(null);

  const prevAppointmentMap = usePrevious(appointmentsMap);

  const shopId = useSelector(AuthSelectors.getShopId);

  const toast = useRef<Toast>(null);

  /**
   * Handles display of a success toast, depending on appointment status
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 03/05/2023
   * @param {AppointmentStatus} status - Appointment status
   * @returns A toast displayed based on appointment status
   */
  const showToast = (status: AppointmentStatus) => {
    if (toast.current) {
      switch (status) {
        case AppointmentStatus.ACCEPTED:
          toast.current.show({
            severity: "success",
            detail: "Appointment accepted",
            sticky: true,
          });
          break;
        case AppointmentStatus.IN_PROGRESS:
          toast.current.show({
            severity: "success",
            detail: "Appointment moved to in progress",
            sticky: true,
          });
          break;
        case AppointmentStatus.COMPLETED:
          toast.current.show({
            severity: "success",
            detail: "Appointment completed",
            sticky: true,
          });
          break;
        case AppointmentStatus.REJECTED:
          toast.current.show({
            severity: "info",
            detail: "Appointment rejected",
            sticky: true,
          });
          break;
        case AppointmentStatus.CANCELLED:
          toast.current.show({
            severity: "info",
            detail: "Appointment cancelled",
            sticky: true,
          });
          break;
        default:
          return;
      }
    }
  };

  useEffect(() => {
    if (shopId != null) {
      dispatch(readShopAppointments());
    }
  }, [dispatch, shopId]);

  useEffect(() => {
    if (appointments != null) {
      const appointmentsList = [...appointments]
        .filter(
          (appointment: IAppointment) => appointment.status == appointmentTab
        )
        .sort((appointment1: IAppointment, appointment2: IAppointment) => {
          return (
            new Date(appointment1.startTime).getTime() -
            new Date(appointment2.startTime).getTime()
          );
        });

      //put the appointments in a map of lists depending on the date
      var _appointmentsMap: { [key: string]: IAppointment[] } = {};

      if (appointmentsList != null) {
        for (var appointment of appointmentsList) {
          var date = new Date(appointment.startTime).toDateString();
          if (!(date in _appointmentsMap)) {
            _appointmentsMap[date] = [];
          }
          _appointmentsMap[date]!.push(appointment);
        }

        if (
          !prevAppointmentMap ||
          JSON.stringify(prevAppointmentMap) != JSON.stringify(_appointmentsMap)
        ) {
          setAppointmentsMap(_appointmentsMap);
        }
      }

      setLoading(false);
    }
  }, [appointments, appointmentTab, prevAppointmentMap, loading]);

  /**
   * Lists all appointment cards
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 01/30/2023
   * @param {string} date - Date
   * @returns A list of AppointmentCard components
   */
  function listAppointmentCards(date: string) {
    let content: any = [];
    {
      appointmentsMap[date]!.forEach((appointment) => {
        content.push(
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            appointmentProgress={appointmentTab}
            showToast={showToast}
            toggleActiveTab={toggleActiveTab}
            onOpenCancelDialog={confirmCancelSelected}
          />
        );
      });
    }

    return content;
  }

  /**
   * Handles the situation when there are no appointments of a specific appointment status
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 03/05/2023
   * @returns A string stating there are no appointments
   */
  function noAppointmentsText() {
    switch (appointmentTab) {
      case AppointmentStatus.PENDING_APPROVAL:
        return `No requested appointments.`;
      case AppointmentStatus.ACCEPTED:
        return `No scheduled appointments.`;
      case AppointmentStatus.IN_PROGRESS:
        return `No in progress appointments.`;
      case AppointmentStatus.COMPLETED:
        return `No completed appointments.`;
      case AppointmentStatus.CANCELLED:
        return `No cancelled appointments.`;
      default:
        return `No appointments.`;
    }
  }

  /**
   * Lists all appointments in sorted order by date (closest to furthest)
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 03/08/2023
   * @param {Array<IAppointment>} appointmentsMap - A map of appointments, with the key value being the date
   * @returns A react component of the list of appointments
   */
  function listAllAppointments(appointmentsMap: {
    [key: string]: Array<IAppointment>;
  }) {
    let content: any = [];
    Object.keys(appointmentsMap).forEach((date) => {
      content.push(
        <div key={date}>
          <h4>
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "full",
            }).format(new Date(date))}
          </h4>
          {listAppointmentCards(date)}
        </div>
      );
    });

    return content;
  }

  const [cancelAppointmentDialog, setCancelAppointmentDialog] = useState(false);

  // Handles hiding the cancel appointment dialog
  const hideCancelAppointmentDialog = () => {
    setSubmitted(false);
    setCancelAppointmentDialog(false);
    setCancellationReason("");
  };

  /**
   * Checks if selected appointment has had the cancel button clicked
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 03/05/2023
   * @param {string} id - Appointment ID
   */
  const confirmCancelSelected = (id: string) => {
    setCancelAppointmentDialog(true);
    setCancelledAppointmentId(id);
  };

  /**
   * Handles cancellation of an appointment
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
      showToast(AppointmentStatus.CANCELLED);
    }
  };

  const cancelAppointmentDialogFooter = (
    <div>
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
   * Handles changes to the form field for cancellation reason
   *
   * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
   * @date 03/05/2023
   * @param {ChangeEvent<HTMLInputElement>} e - React change event
   */
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ?? "";

    setCancellationReason(val);
  };

  return (
    <div>
      {loading ? (
        <div className={styles.loadingSpinner}>
          <ProgressSpinner strokeWidth="3" fill="var(--surface-ground)" />
          <h2>Loading service requests...</h2>
        </div>
      ) : (
        <div>
          <Toast ref={toast} />
          {Object.entries(appointmentsMap).length > 0 ? (
            listAllAppointments(appointmentsMap)
          ) : (
            <div className={styles.noAppointmentsText}>
              {noAppointmentsText()}
            </div>
          )}
          <Dialog
            visible={cancelAppointmentDialog}
            style={{ width: "32rem" }}
            breakpoints={{ "960px": "75vw", "641px": "90vw" }}
            header="Confirm Cancellation"
            modal
            footer={cancelAppointmentDialogFooter}
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
      )}
    </div>
  );
};

export default ShopAppointments;
