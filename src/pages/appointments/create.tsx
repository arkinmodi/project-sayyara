import requestStyles from "../../styles/pages/appointments/Request.module.css";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { DateInput2 } from "@blueprintjs/datetime2";
import { format, parse } from "date-fns";
import { useCallback, useState } from "react";
import {
  Button,
  Card,
  Elevation,
  FormGroup,
  Icon,
  MenuItem,
} from "@blueprintjs/core";
import { MultiSelect2 } from "@blueprintjs/select";
import { useDispatch } from "react-redux";
import AppointmentTypes from "../../redux/types/appointmentTypes";
import { TimePicker } from "@blueprintjs/datetime";

const Create: NextPage = () => {
  const [dateValue, setDateValue] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date>(
    new Date("2020-01-01T00:00:00")
  );
  const [endTime, setEndTime] = useState<Date>(new Date("2020-01-01T00:00:00"));
  const [item, setItem] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleRequestSubmit = (): void => {
    console.log("date: " + dateValue);
    console.log("start time: " + format(startTime, timeFnsFormat));
    console.log("end time: " + format(endTime, timeFnsFormat));
    console.log("items: " + items);
  };

  const handleDateChange = useCallback(setDateValue, []);
  const dateFnsFormat = "PPPP";
  const timeFnsFormat = "p";
  const formatDate = useCallback(
    (date: Date) => format(date, dateFnsFormat),
    []
  );
  const parseDate = useCallback(
    (str: string) => parse(str, dateFnsFormat, new Date()),
    []
  );

  return (
    <div className={requestStyles.requestContainer}>
      <Card
        className={requestStyles.requestFormCard}
        interactive={false}
        elevation={Elevation.THREE}
      >
        <div className={requestStyles.requestFormHeader}>
          <Icon icon="calendar" size={80} />
          <h1>Create an Appointment</h1>
        </div>
        <div className={requestStyles.requestForm}>
          <FormGroup
            label="Appointment Type"
            labelInfo="(Required)"
            labelFor="tag-input"
          >
            <MultiSelect2
              items={["Canned", "Custom", "Rework"]}
              onItemSelect={() => {}}
              selectedItems={items}
              tagRenderer={(item) => item}
              activeItem={item}
              itemRenderer={(val, itemProps) => {
                return (
                  <MenuItem
                    key={val}
                    text={val}
                    onClick={(elm) => {
                      setItem(elm.target.textContent);
                      setItems((items) => {
                        return [...items, elm.target.textContent];
                      });
                    }}
                  />
                );
              }}
              onRemove={(item) => {
                setItems((items) => items.filter((elm) => elm !== item));
              }}
            />
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
          <div className={requestStyles.requestFormTime}>
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
        <Button
          intent="primary"
          className={requestStyles.requestFormButton}
          onClick={handleRequestSubmit}
        >
          Submit Appointment
        </Button>
      </Card>
    </div>
  );
};

export default Create;
