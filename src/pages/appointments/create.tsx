import {
  Button,
  Card,
  Elevation,
  FormGroup,
  Icon,
  MenuItem,
} from "@blueprintjs/core";
import { TimePicker } from "@blueprintjs/datetime";
import { DateInput2 } from "@blueprintjs/datetime2";
import { Select2 } from "@blueprintjs/select";
import { format, parse } from "date-fns";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import AppointmentTypes from "src/redux/types/appointmentTypes";
import { ServiceType } from "src/types/service";
import styles from "../../styles/pages/appointments/Create.module.css";

const mapServiceType = {
  [ServiceType.CANNED]: "Canned",
  [ServiceType.CUSTOM]: "Custom",
  [ServiceType.REWORK]: "Rework",
};

const dateFnsFormat = "PPPP";
const timeFnsFormat = "HH:mm:ss";

const Create: NextPage = () => {
  const [dateValue, setDateValue] = useState<string | null>(null);
  const [startTimeValue, setStartTimeValue] = useState<Date>(
    new Date("2020-01-01T00:00:00")
  );
  const [endTimeValue, setEndTimeValue] = useState<Date>(
    new Date("2020-01-01T00:00:00")
  );
  const [serviceType, setServiceType] = useState<ServiceType>(
    ServiceType.CANNED
  );

  const dispatch = useDispatch();
  const router = useRouter();

  const handleRequestSubmit = (): void => {
    const startTime = new Date(
      dateValue + "T" + format(startTimeValue, timeFnsFormat)
    ).toString();
    const endTime = new Date(
      dateValue + "T" + format(endTimeValue, timeFnsFormat)
    ).toString();

    dispatch({
      type: AppointmentTypes.CREATE_APPOINTMENT,
      payload: { serviceType, startTime, endTime },
    });
  };

  const handleDateChange = useCallback(setDateValue, []);
  const formatDate = useCallback(
    (date: Date) => format(date, dateFnsFormat),
    []
  );
  const parseDate = useCallback(
    (str: string) => parse(str, dateFnsFormat, new Date()),
    []
  );

  return (
    <div className={styles.createAppointmentContainer}>
      <Card
        className={styles.createAppointmentFormCard}
        interactive={false}
        elevation={Elevation.THREE}
      >
        <div className={styles.createAppointmentFormHeader}>
          <Icon icon="calendar" size={80} />
          <h1>Create an Appointment</h1>
        </div>
        <div>
          <FormGroup
            label="Appointment Type"
            labelInfo="(Required)"
            labelFor="tag-input"
          >
            <Select2
              items={Object.values(mapServiceType)}
              itemRenderer={(val, _itemProps) => {
                return (
                  <MenuItem
                    key={val}
                    text={val}
                    onClick={(elm) => {
                      setServiceType(elm.target.textContent.toUpperCase());
                    }}
                  />
                );
              }}
              onItemSelect={() => {}}
              filterable={false}
            >
              <Button
                text={mapServiceType[serviceType]}
                rightIcon="caret-down"
                className={styles.createAppointmentSelectButton}
              />
            </Select2>
          </FormGroup>
          <FormGroup label="Appointment Date" labelInfo="(Required)">
            <DateInput2
              formatDate={formatDate}
              onChange={(newDate: string | null) => {
                handleDateChange(newDate);
              }}
              parseDate={parseDate}
              placeholder={"Select a date"}
              value={dateValue}
              highlightCurrentDay={true}
            />
          </FormGroup>
          <div className={styles.createAppointmentFormTime}>
            <FormGroup label="Start Time" labelInfo="(Required)">
              <TimePicker
                useAmPm={true}
                onChange={(time) => setStartTimeValue(time)}
              />
            </FormGroup>
            <FormGroup label="End Time" labelInfo="(Required)">
              <TimePicker
                useAmPm={true}
                onChange={(time) => setEndTimeValue(time)}
              />
            </FormGroup>
          </div>
        </div>
        <Button intent="primary" onClick={handleRequestSubmit}>
          Submit Appointment
        </Button>
      </Card>
    </div>
  );
};

export default Create;
