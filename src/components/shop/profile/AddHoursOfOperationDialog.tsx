import styles from "@styles/components/shop/profile/AddHoursOfOperationDialog.module.css";
import classNames from "classnames";
import { Button } from "primereact/button";
import { Calendar, CalendarChangeParams } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import { useEffect, useState } from "react";
import { IShop, IShopHoursOfOperation } from "src/types/shop";
import { patchShop } from "src/utils/shopUtil";

interface IAddHoursOfOperationDialog {
  visible: boolean;
  onHide: () => void;
  shopId: string;
  shop: IShop;
  updateShop: (shop: IShop) => void;
}

interface IFormValues {
  monday: {
    isOpen: boolean;
    openTime: Date;
    closeTime: Date;
  };
  tuesday: {
    isOpen: boolean;
    openTime: Date;
    closeTime: Date;
  };
  wednesday: {
    isOpen: boolean;
    openTime: Date;
    closeTime: Date;
  };
  thursday: {
    isOpen: boolean;
    openTime: Date;
    closeTime: Date;
  };
  friday: {
    isOpen: boolean;
    openTime: Date;
    closeTime: Date;
  };
  saturday: {
    isOpen: boolean;
    openTime: Date;
    closeTime: Date;
  };
  sunday: {
    isOpen: boolean;
    openTime: Date;
    closeTime: Date;
  };
}

interface IOperatingTimeValid {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

const defaultIsOpen = true;
const defaultStartTime = "1970-01-01T14:00:00Z";
const defaultEndTime = "1970-01-01T22:00:00Z";
const initialOperatingTimeValid = {
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
  sunday: true,
};

const AddHoursOfOperationDialog = (props: IAddHoursOfOperationDialog) => {
  const { visible, onHide, shopId, shop, updateShop } = props;

  const existingHoursOfOperation = shop.hoursOfOperation;
  const initialFormValues: IFormValues =
    existingHoursOfOperation != null
      ? {
          monday: {
            isOpen: existingHoursOfOperation.monday.isOpen,
            openTime: new Date(existingHoursOfOperation.monday.openTime),
            closeTime: new Date(existingHoursOfOperation.monday.closeTime),
          },
          tuesday: {
            isOpen: existingHoursOfOperation.tuesday.isOpen,
            openTime: new Date(existingHoursOfOperation.tuesday.openTime),
            closeTime: new Date(existingHoursOfOperation.tuesday.closeTime),
          },
          wednesday: {
            isOpen: existingHoursOfOperation.wednesday.isOpen,
            openTime: new Date(existingHoursOfOperation.wednesday.openTime),
            closeTime: new Date(existingHoursOfOperation.wednesday.closeTime),
          },
          thursday: {
            isOpen: existingHoursOfOperation.thursday.isOpen,
            openTime: new Date(existingHoursOfOperation.thursday.openTime),
            closeTime: new Date(existingHoursOfOperation.thursday.closeTime),
          },
          friday: {
            isOpen: existingHoursOfOperation.friday.isOpen,
            openTime: new Date(existingHoursOfOperation.friday.openTime),
            closeTime: new Date(existingHoursOfOperation.friday.closeTime),
          },
          saturday: {
            isOpen: existingHoursOfOperation.saturday.isOpen,
            openTime: new Date(existingHoursOfOperation.saturday.openTime),
            closeTime: new Date(existingHoursOfOperation.saturday.closeTime),
          },
          sunday: {
            isOpen: existingHoursOfOperation.sunday.isOpen,
            openTime: new Date(existingHoursOfOperation.sunday.openTime),
            closeTime: new Date(existingHoursOfOperation.sunday.closeTime),
          },
        }
      : {
          monday: {
            isOpen: defaultIsOpen,
            openTime: new Date(defaultStartTime),
            closeTime: new Date(defaultEndTime),
          },
          tuesday: {
            isOpen: defaultIsOpen,
            openTime: new Date(defaultStartTime),
            closeTime: new Date(defaultEndTime),
          },
          wednesday: {
            isOpen: defaultIsOpen,
            openTime: new Date(defaultStartTime),
            closeTime: new Date(defaultEndTime),
          },
          thursday: {
            isOpen: defaultIsOpen,
            openTime: new Date(defaultStartTime),
            closeTime: new Date(defaultEndTime),
          },
          friday: {
            isOpen: defaultIsOpen,
            openTime: new Date(defaultStartTime),
            closeTime: new Date(defaultEndTime),
          },
          saturday: {
            isOpen: defaultIsOpen,
            openTime: new Date(defaultStartTime),
            closeTime: new Date(defaultEndTime),
          },
          sunday: {
            isOpen: defaultIsOpen,
            openTime: new Date(defaultStartTime),
            closeTime: new Date(defaultEndTime),
          },
        };

  const [formValues, setFormValues] = useState<IFormValues>(initialFormValues);
  const [operatingTimeValid, setOperatingTimeValid] =
    useState<IOperatingTimeValid>(initialOperatingTimeValid);
  /**
   * We need this state change listener because React does not re-render the DOM after change in object (or non-primitive) state values
   */
  const [validationUpdateListener, setValidationUpdateListener] = useState(0);
  const [formUpdateListener, setFormUpdateListener] = useState(0);

  useEffect(() => {
    if (shop.hoursOfOperation != null) {
      const existingHoursOfOperation = shop.hoursOfOperation;
      setFormValues({
        monday: {
          isOpen: existingHoursOfOperation.monday.isOpen,
          openTime: new Date(existingHoursOfOperation.monday.openTime),
          closeTime: new Date(existingHoursOfOperation.monday.closeTime),
        },
        tuesday: {
          isOpen: existingHoursOfOperation.tuesday.isOpen,
          openTime: new Date(existingHoursOfOperation.tuesday.openTime),
          closeTime: new Date(existingHoursOfOperation.tuesday.closeTime),
        },
        wednesday: {
          isOpen: existingHoursOfOperation.wednesday.isOpen,
          openTime: new Date(existingHoursOfOperation.wednesday.openTime),
          closeTime: new Date(existingHoursOfOperation.wednesday.closeTime),
        },
        thursday: {
          isOpen: existingHoursOfOperation.thursday.isOpen,
          openTime: new Date(existingHoursOfOperation.thursday.openTime),
          closeTime: new Date(existingHoursOfOperation.thursday.closeTime),
        },
        friday: {
          isOpen: existingHoursOfOperation.friday.isOpen,
          openTime: new Date(existingHoursOfOperation.friday.openTime),
          closeTime: new Date(existingHoursOfOperation.friday.closeTime),
        },
        saturday: {
          isOpen: existingHoursOfOperation.saturday.isOpen,
          openTime: new Date(existingHoursOfOperation.saturday.openTime),
          closeTime: new Date(existingHoursOfOperation.saturday.closeTime),
        },
        sunday: {
          isOpen: existingHoursOfOperation.sunday.isOpen,
          openTime: new Date(existingHoursOfOperation.sunday.openTime),
          closeTime: new Date(existingHoursOfOperation.sunday.closeTime),
        },
      });
    }
  }, [shop]);

  useEffect(() => {}, [formUpdateListener]);

  const renderDayForm = (
    d: string,
    operatingTimeValid: IOperatingTimeValid,
    formValues: IFormValues
  ) => {
    const day = d as keyof IShopHoursOfOperation;
    return (
      <div key={day}>
        <div
          className={classNames(
            "blueText",
            styles.addHoursOfOperationDialogDayText
          )}
        >{`${day.charAt(0).toUpperCase() + day.slice(1)}`}</div>
        <div className={styles.addHoursOfOperationDialogFormLabel}>
          {formValues[day].isOpen ? "Open" : "Closed"}
        </div>
        <InputSwitch
          id={`${day}IsOpenSwitch`}
          checked={formValues[day].isOpen}
          onChange={(e) =>
            setFormValues({
              ...formValues,
              [day]: { ...formValues[day], isOpen: e.value },
            })
          }
        />
        <br />
        <div className={styles.addHoursOfOperationDialogFormLabel}>
          Set Open & Close Time:
        </div>
        <div className={styles.operatingTimeContainer}>
          <Calendar
            id={`${day}OpenTimeInput`}
            value={formValues[day].openTime}
            className={classNames(
              styles.openCalendarInput,
              !operatingTimeValid[day] ? "p-invalid" : ""
            )}
            onChange={(e) => handleOpenTimeInputChange(e, day)}
            timeOnly
            hourFormat="12"
          />
          <Calendar
            id={`${day}CloseTimeInput`}
            className={!operatingTimeValid[day] ? "p-invalid" : ""}
            value={formValues[day].closeTime}
            onChange={(e) => handleCloseTimeInputChange(e, day)}
            timeOnly
            hourFormat="12"
          />
        </div>
        <small
          id="timeHelp"
          className={
            !operatingTimeValid[day] && validationUpdateListener != null
              ? "p-error block"
              : "p-hidden"
          }
        >
          Invalid: open time cannot be after close time
        </small>
      </div>
    );
  };

  const handleOpenTimeInputChange = (e: CalendarChangeParams, d: string) => {
    const day = d as keyof IShopHoursOfOperation;
    const value = e.value;

    const updatedFormValues = {
      ...formValues,
      [day]: { ...formValues[day], openTime: value },
    };

    setFormValues((formValues) => {
      return Object.assign(formValues, updatedFormValues);
    });

    setFormUpdateListener((formUpdateListener + 1) % 2);
  };

  const handleCloseTimeInputChange = (e: CalendarChangeParams, d: string) => {
    const day = d as keyof IShopHoursOfOperation;
    const value = e.value;

    const updatedFormValues = {
      ...formValues,
      [day]: { ...formValues[day], closeTime: value },
    };

    setFormValues((formValues) => {
      return Object.assign(formValues, updatedFormValues);
    });

    setFormUpdateListener((formUpdateListener + 1) % 2);
  };

  const validateInputs = () => {
    const updatedOperatingTimeValid = {
      ...operatingTimeValid,
    };

    Object.keys(formValues).forEach((day) => {
      if (
        /**
         * String comparison of time should work here as timezone is restricted to UTC with precision 0.
         * See hoursOfOperationSchema for more details.
         */
        formValues[day as keyof IFormValues].openTime.toLocaleTimeString(
          "en-US",
          { hour: "numeric", minute: "numeric", hour12: false }
        ) >
        formValues[day as keyof IFormValues].closeTime.toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }
        )
      ) {
        updatedOperatingTimeValid[day as keyof IOperatingTimeValid] = false;
      } else {
        updatedOperatingTimeValid[day as keyof IOperatingTimeValid] = true;
      }
    });

    setOperatingTimeValid((operatingTimeValid) => {
      return Object.assign(operatingTimeValid, updatedOperatingTimeValid);
    });

    const valid = Object.keys(updatedOperatingTimeValid)
      .map((day) => {
        return operatingTimeValid[day as keyof IOperatingTimeValid];
      })
      .every((isValidTime) => isValidTime === true);

    setValidationUpdateListener((validationUpdateListener + 1) % 2);
    return valid;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      patchShop(shopId, {
        ...shop,
        hoursOfOperation: {
          ...formValues,
          monday: {
            ...formValues.monday,
            openTime: formValues.monday.openTime.toISOString(),
            closeTime: formValues.monday.closeTime.toISOString(),
          },
          tuesday: {
            ...formValues.tuesday,
            openTime: formValues.tuesday.openTime.toISOString(),
            closeTime: formValues.tuesday.closeTime.toISOString(),
          },
          wednesday: {
            ...formValues.wednesday,
            openTime: formValues.wednesday.openTime.toISOString(),
            closeTime: formValues.wednesday.closeTime.toISOString(),
          },
          thursday: {
            ...formValues.thursday,
            openTime: formValues.thursday.openTime.toISOString(),
            closeTime: formValues.thursday.closeTime.toISOString(),
          },
          friday: {
            ...formValues.friday,
            openTime: formValues.friday.openTime.toISOString(),
            closeTime: formValues.friday.closeTime.toISOString(),
          },
          saturday: {
            ...formValues.saturday,
            openTime: formValues.saturday.openTime.toISOString(),
            closeTime: formValues.saturday.closeTime.toISOString(),
          },
          sunday: {
            ...formValues.sunday,
            openTime: formValues.sunday.openTime.toISOString(),
            closeTime: formValues.sunday.closeTime.toISOString(),
          },
        },
      }).then((shop) => {
        if (shop) {
          updateShop(shop);
        }
      });
      onHide();
    }
  };

  return (
    <Dialog visible={visible} onHide={() => onHide()}>
      <div className={styles.addHoursOfOperationDialogContainer}>
        <div
          className={classNames(
            "blueText",
            styles.addHoursOfOperationDialogTitle
          )}
        >
          Edit Hours of Operation
        </div>
        {Object.keys(formValues).map((day) =>
          renderDayForm(day, operatingTimeValid, formValues)
        )}
        <Button
          className={styles.submitHoursOfOperationButton}
          onClick={() => handleSubmit()}
        >
          Update
        </Button>
      </div>
    </Dialog>
  );
};

export default AddHoursOfOperationDialog;
