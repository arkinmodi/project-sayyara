import { AppointmentSelectors } from "@redux/selectors/appointmentSelectors";
import styles from "@styles/components/chat/ChatTitle.module.css";
import classnames from "classnames";
import { Button } from "primereact/button";
import { InputNumberValueChangeParams } from "primereact/inputnumber";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScheduleMeeting, StartTimeEventEmit } from "react-schedule-meeting";
import { AppointmentStatus, IAppointment } from "src/types/appointment";
import { IAvailabilitiesTime, IShopHoursOfOperation } from "src/types/shop";
import { getAvailabilities, getShopId } from "src/utils/shopUtil";

interface IEditAppointmentTimeProps {
  appointment: IAppointment;
}

const EditAppointmentTime = (props: IEditAppointmentTimeProps) => {
  const { appointment } = props;
  const dispatch = useDispatch();

  const [time, setTime] = useState(0);
  const [availableTimeslots, setAvailableTimeslots] = useState<
    IAvailabilitiesTime[] | []
  >([]);
  const [allowSubmit, setAllowSubmit] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const customerAppointments = useSelector(
    AppointmentSelectors.getAppointments
  );

  useEffect(() => {
    const startDate = new Date(new Date().setHours(0, 0, 0, 0));
    const endDate = new Date(
      new Date(new Date().setDate(startDate.getDate() + 30)).setHours(
        23,
        59,
        59,
        59
      )
    );
    var shopHours: IShopHoursOfOperation | null = null;
    getShopId(appointment.shopId).then((data) => {
      if (data?.hoursOfOperation) {
        shopHours = data.hoursOfOperation;
      }
    });

    getAvailabilities(appointment.shopId, startDate, endDate, shopHours).then(
      (data) => {
        if (data) {
          setAvailableTimeslots(data);
        }
      }
    );
  }, [customerAppointments]);

  const onTimeChange = (e: InputNumberValueChangeParams) => {
    if (e.value) {
      setTime(e.value);
    }
  };

  const onTimeSelect = (e: StartTimeEventEmit) => {
    //TODO: make sure this valueOf stuff works
    const duration =
      appointment.endTime.valueOf() - appointment.startTime.valueOf();
    const startTime = e.startTime;
    const endTime = new Date(e.startTime.getTime() + duration * 60000);

    setStartTime(startTime);
    setEndTime(endTime);
    setAllowSubmit(true);
  };

  const onSubmitAppointment = () => {
    const body = {
      id: appointment.id,
      status: AppointmentStatus.PENDING_APPROVAL,
      startTime: startTime.toString(),
      endTime: endTime.toString(),
    };
    // TODO: Instead of create appointment need to call patchAppointment (might need to create this)
    // dispatch(createAppointment(body));
  };

  return (
    <div className={styles.dialogInputCol}>
      <ScheduleMeeting
        borderRadius={10}
        primaryColor="#436188"
        backgroundColor="#f7f7f7"
        // replace the 0 with the duration of the appointment
        eventDurationInMinutes={Math.ceil(0 * 60)}
        availableTimeslots={availableTimeslots}
        onStartTimeSelect={onTimeSelect}
      />
      <div className={classnames(styles.dialogInputRow, styles.buttonRow)}>
        {/* <Button className="blueButton" label="Back" onClick={goBack} /> */}
        <Button
          className={classnames(styles.dialogButton, "greenButton")}
          label="Schedule Service"
          disabled={!allowSubmit}
          onClick={onSubmitAppointment}
        />
      </div>
    </div>
  );
};

export default EditAppointmentTime;
