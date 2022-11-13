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

const RequestAppointment: NextPage = () => {
  const [dateValue, setDateValue] = useState<string>("");
  const [item, setItem] = useState<string>("");
  const [items, setItems] = useState<string[]>([]);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleRequestSubmit = (): void => {
    console.log("date: " + dateValue + " items: " + items);
    dispatch({
      types: AppointmentTypes.CREATE_APPOINTMENT,
      payload: items.push(dateValue),
    });
  };

  const handleDateChange = useCallback(setDateValue, []);
  const dateFnsFormat = "PPPPp";
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
          <h1>Request an Appointment</h1>
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
          <FormGroup label="Appointment Time" labelInfo="(Required)">
            <DateInput2
              formatDate={formatDate}
              onChange={(newDate: string) => {
                handleDateChange(newDate);
              }}
              parseDate={parseDate}
              placeholder={"Select a date and time"}
              value={dateValue}
              highlightCurrentDay={true}
              disableTimezoneSelect={true}
              timePrecision={"minute"}
            />
          </FormGroup>
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

export default RequestAppointment;
