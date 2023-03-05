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
          setAppointmentsMap((state) => ({
            ...state,
            ..._appointmentsMap,
          }));
        }
      }
      setLoading(false);
    }
  }, [appointments, appointmentTab, prevAppointmentMap, loading]);

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

  function listAllAppointments() {
    let content: any = [];
    Object.keys(appointmentsMap).forEach((date) => {
      content.push(
        <div key={date}>
          <h4>{date}</h4>
          {listAppointmentCards(date)}
        </div>
      );
    });

    return content;
  }

  const [cancelAppointmentDialog, setCancelAppointmentDialog] = useState(false);

  const hideCancelAppointmentDialog = () => {
    setSubmitted(false);
    setCancelAppointmentDialog(false);
    setCancellationReason("");
  };

  const confirmCancelSelected = (id: string) => {
    setCancelAppointmentDialog(true);
    setCancelledAppointmentId(id);
  };

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

  const deleteProductDialogFooter = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        onClick={hideCancelAppointmentDialog}
      />
      <Button label="Yes" icon="pi pi-check" onClick={cancelAppointment} />
    </div>
  );

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ?? "";

    setCancellationReason(val);

    console.log(cancellationReason);
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
            listAllAppointments()
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
            footer={deleteProductDialogFooter}
            onHide={hideCancelAppointmentDialog}
          >
            <div>
              <i
                className="pi pi-exclamation-triangle"
                style={{ fontSize: "2rem" }}
              />
              <label htmlFor="reason">
                Please enter a reason for cancellation:
              </label>
              <InputText
                id="reason"
                name="reason"
                value={cancellationReason}
                onChange={onInputChange}
                required
                autoFocus
                className={classNames({
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
