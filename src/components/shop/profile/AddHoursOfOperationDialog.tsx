import styles from "@styles/components/shop/profile/AddHoursOfOperationDialog.module.css";
import classNames from "classnames";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { InputSwitch } from "primereact/inputswitch";
import React, { useState } from "react";
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

const defaultIsOpen = true;
const defaultStartTime = "1970-01-01T14:00:00Z";
const defaultEndTime = "1970-01-01T22:00:00Z";

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

  const renderDayForm = (d: string) => {
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
            className={styles.openCalendarInput}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                [day]: { ...formValues[day], openTime: e.value },
              })
            }
            timeOnly
            hourFormat="12"
          />
          <Calendar
            id={`${day}CloseTimeInput`}
            value={formValues[day].closeTime}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                [day]: { ...formValues[day], closeTime: e.value },
              })
            }
            timeOnly
            hourFormat="12"
          />
        </div>
      </div>
    );
  };

  const handleSubmit = () => {
    // TODO: input validation
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
        {Object.keys(formValues).map((day) => renderDayForm(day))}
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

export default React.memo(AddHoursOfOperationDialog);
