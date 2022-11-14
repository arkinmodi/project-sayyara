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
import styles from "../../styles/pages/appointments/Create.module.css";

const Create: NextPage = () => {
  const [dateValue, setDateValue] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date>(
    new Date("2020-01-01T00:00:00")
  );
  const [endTime, setEndTime] = useState<Date>(new Date("2020-01-01T00:00:00"));
  const [item, setItem] = useState<string>("Canned");

  const dispatch = useDispatch();
  const router = useRouter();

  const handleRequestSubmit = (): void => {
    console.log("date: " + dateValue);
    console.log("start time: " + format(startTime, timeFnsFormat));
    console.log("end time: " + format(endTime, timeFnsFormat));
    console.log("item: " + item);
    const start_time = new Date(
      dateValue + "T" + format(startTime, timeFnsFormat)
    );
    const end_time = new Date(dateValue + "T" + format(endTime, timeFnsFormat));

    dispatch({
      type: AppointmentTypes.CREATE_APPOINTMENT,
      payload: { item, start_time, end_time },
    });
  };

  const handleDateChange = useCallback(setDateValue, []);
  const dateFnsFormat = "PPPP";
  const timeFnsFormat = "HH:mm:ss";
  const formatDate = useCallback(
    (date: Date) => format(date, dateFnsFormat),
    []
  );
  const parseDate = useCallback(
    (str: string) => parse(str, dateFnsFormat, new Date()),
    []
  );

  return (
    <div className={styles.createContainer}>
      <Card
        className={styles.createFormCard}
        interactive={false}
        elevation={Elevation.THREE}
      >
        <div className={styles.createFormHeader}>
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
              items={["Canned", "Custom", "Rework"]}
              itemRenderer={(val, itemProps) => {
                return (
                  <MenuItem
                    key={val}
                    text={val}
                    onClick={(elm) => {
                      setItem(elm.target.textContent);
                    }}
                  />
                );
              }}
              onItemSelect={() => {}}
              filterable={false}
            >
              <Button
                text={item}
                rightIcon="caret-down"
                className={styles.createSelectButton}
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
          <div className={styles.createFormTime}>
            <FormGroup label="Start Time" labelInfo="(Required)">
              <TimePicker
                useAmPm={true}
                onChange={(time) => setStartTime(time)}
              />
            </FormGroup>
            <FormGroup label="End Time" labelInfo="(Required)">
              <TimePicker
                useAmPm={true}
                onChange={(time) => setEndTime(time)}
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
