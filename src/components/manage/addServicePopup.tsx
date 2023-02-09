import { createService } from "@redux/actions/serviceAction";
import styles from "@styles/pages/services/Services.module.css";
import classNames from "classnames";
import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeParams } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { DropdownChangeParams } from "primereact/dropdown";
import { InputNumber, InputNumberChangeParams } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  IParts,
  PartCondition,
  PartType,
  ServiceType,
} from "src/types/service";

interface IServicePopupProps {
  serviceType: ServiceType;
  visible: boolean;
  onHideDialog: () => void;
}

interface IAddBasicServiceValues {
  name: string;
  description: string;
  estimatedTime: number;
  totalPrice: number;
  parts: IParts[];
}

interface IAddCustomServiceValues {
  name: string;
  description: string;
  new: boolean;
  used: boolean;
  oem: boolean;
  aftermarket: boolean;
  parts: IParts[];
}

const initialAddBasicServiceValues = {
  name: "",
  description: "",
  estimatedTime: 0,
  totalPrice: 0,
  parts: [],
};

const initialAddCustomServiceValues = {
  name: "",
  description: "",
  new: false,
  used: false,
  oem: false,
  aftermarket: false,
  parts: [],
};

const AddServicePopup = (props: IServicePopupProps) => {
  const { serviceType, visible, onHideDialog } = props;
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState<
    IAddBasicServiceValues | IAddCustomServiceValues
  >(
    serviceType === ServiceType.CANNED
      ? initialAddBasicServiceValues
      : initialAddCustomServiceValues
  );

  useEffect(() => {
    let emptyTemplate;

    if (serviceType === ServiceType.CANNED) {
      emptyTemplate = initialAddBasicServiceValues;
    } else {
      emptyTemplate = initialAddCustomServiceValues;
    }
    setFormValues(emptyTemplate);
  }, [visible, serviceType]);

  const dispatch = useDispatch();

  const onCheckedChange = (e: CheckboxChangeParams, key: string) => {
    const val = e.checked || false;

    setFormValues({
      ...formValues,
      [key as keyof IAddCustomServiceValues]: val,
    });
  };

  const onInputChange = (
    e:
      | DropdownChangeParams
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>,
    key: string
  ) => {
    const val = (e.target && e.target.value) || "";

    if (serviceType == ServiceType.CANNED) {
      setFormValues({
        ...formValues,
        [key as keyof IAddBasicServiceValues]: val,
      });
    } else {
      setFormValues({
        ...formValues,
        [key as keyof IAddCustomServiceValues]: val,
      });
    }
  };

  const onInputNumberChange = (e: InputNumberChangeParams, key: string) => {
    const val = e.value || 0;

    if (serviceType == ServiceType.CANNED) {
      setFormValues({
        ...formValues,
        [key as keyof IAddBasicServiceValues]: val,
      });
    } else {
      setFormValues({
        ...formValues,
        [key as keyof IAddCustomServiceValues]: val,
      });
    }
  };

  const hideDialog = () => {
    setSubmitted(false);
    onHideDialog();
  };

  const saveService = () => {
    setSubmitted(true);
    if (
      serviceType == ServiceType.CANNED &&
      formValues.name != "" &&
      formValues.description != "" &&
      (formValues as IAddBasicServiceValues).estimatedTime > 0 &&
      (formValues as IAddBasicServiceValues).totalPrice > 0
    ) {
      // turn off input validation
      setSubmitted(false);

      dispatch(
        createService({
          name: formValues.name,
          description: formValues.description,
          estimatedTime: Number(
            (formValues as IAddBasicServiceValues).estimatedTime
          ),
          totalPrice: Number((formValues as IAddBasicServiceValues).totalPrice),
          parts: formValues.parts,
          type: serviceType,
        })
      );
      onHideDialog();
    }

    if (
      serviceType == ServiceType.CUSTOM &&
      formValues.name != "" &&
      formValues.description != "" &&
      ((formValues as IAddCustomServiceValues).oem ||
        (formValues as IAddCustomServiceValues).aftermarket) &&
      ((formValues as IAddCustomServiceValues).new ||
        (formValues as IAddCustomServiceValues).used)
    ) {
      var partCondition: PartCondition;
      var partBuild: PartType;

      if (
        (formValues as IAddCustomServiceValues).oem &&
        (formValues as IAddCustomServiceValues).aftermarket
      ) {
        partBuild = PartType.OEM_OR_AFTERMARKET;
      } else if ((formValues as IAddCustomServiceValues).oem) {
        partBuild = PartType.OEM;
      } else {
        partBuild = PartType.AFTERMARKET;
      }

      if (
        (formValues as IAddCustomServiceValues).new &&
        (formValues as IAddCustomServiceValues).used
      ) {
        partCondition = PartCondition.NEW_OR_USED;
      } else if ((formValues as IAddCustomServiceValues).new) {
        partCondition = PartCondition.NEW;
      } else {
        partCondition = PartCondition.USED;
      }

      // turn off input validation
      setSubmitted(false);

      dispatch(
        createService({
          name: formValues.name,
          description: formValues.description,
          estimatedTime: 0,
          totalPrice: 0,
          parts: [
            {
              condition: partCondition,
              build: partBuild,
            },
          ],
          type: serviceType,
        })
      );
      onHideDialog();
    }
  };

  const serviceDialogFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveService}
      />
    </div>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: "450px" }}
      header={
        serviceType === ServiceType.CANNED
          ? "Add Basic Service"
          : "Add Custom Service"
      }
      modal
      className="p-fluid"
      footer={serviceDialogFooter}
      onHide={hideDialog}
    >
      <div className={styles.servicesFormFields}>
        <label htmlFor="name">Name</label>
        <InputText
          id="name"
          value={formValues.name}
          onChange={(e) => onInputChange(e, "name")}
          required
          autoFocus
          className={classNames({
            "p-invalid": submitted && formValues.name == "",
          })}
        />
        {submitted && formValues.name == "" && (
          <small className="p-error">Name required</small>
        )}
      </div>
      <div className={styles.servicesFormFields}>
        <label htmlFor="description">Description</label>
        <InputTextarea
          id="description"
          value={formValues.description}
          onChange={(e) => onInputChange(e, "description")}
          required
          rows={3}
          cols={20}
          className={classNames({
            "p-invalid": submitted && formValues.description == "",
          })}
        />
        {submitted && formValues.description == "" && (
          <small className="p-error">Description required</small>
        )}
      </div>
      {serviceType == ServiceType.CUSTOM ? (
        <div className="col-12">
          {/* Part Condition Dropdown */}
          <div
            className={classNames({
              "p-invalid":
                submitted &&
                !(formValues as IAddCustomServiceValues).new &&
                !(formValues as IAddCustomServiceValues).used,
            })}
          >
            <div className={styles.servicesFormFields}>Part Condition</div>
            <Checkbox
              inputId="new"
              value="new"
              onChange={(e) => onCheckedChange(e, "new")}
              checked={(formValues as IAddCustomServiceValues).new}
            ></Checkbox>
            <label htmlFor="cb1" className="p-checkbox-label">
              New
            </label>
            <Checkbox
              inputId="used"
              value="used"
              onChange={(e) => onCheckedChange(e, "used")}
              checked={(formValues as IAddCustomServiceValues).used}
            ></Checkbox>
            <label htmlFor="cb1" className="p-checkbox-label">
              Used
            </label>
          </div>
          {submitted &&
            !(formValues as IAddCustomServiceValues).new &&
            !(formValues as IAddCustomServiceValues).used && (
              <small className="p-error">Condition required</small>
            )}
          {/* Part Type Dropdown */}
          <div
            className={classNames({
              "p-invalid":
                submitted &&
                !(formValues as IAddCustomServiceValues).oem &&
                !(formValues as IAddCustomServiceValues).aftermarket,
            })}
          >
            <div className={styles.servicesFormFields}>Part Type</div>
            <Checkbox
              inputId="oem"
              value="OEM"
              onChange={(e) => onCheckedChange(e, "oem")}
              checked={(formValues as IAddCustomServiceValues).oem}
            ></Checkbox>
            <label htmlFor="cb1" className="p-checkbox-label">
              OEM
            </label>
            <Checkbox
              inputId="aftermarket"
              value="aftermarket"
              onChange={(e) => onCheckedChange(e, "aftermarket")}
              checked={(formValues as IAddCustomServiceValues).aftermarket}
            ></Checkbox>
            <label htmlFor="cb1" className="p-checkbox-label">
              Aftermarket
            </label>
          </div>
          {submitted &&
            !(formValues as IAddCustomServiceValues).oem &&
            !(formValues as IAddCustomServiceValues).aftermarket && (
              <small className="p-error">Type required</small>
            )}
        </div>
      ) : (
        <div>
          <div className={styles.servicesFormFields}>
            <label htmlFor="estimatedTime">Estimated Duration (hours)</label>
            <InputNumber
              id="estimatedTime"
              value={Number(
                (formValues as IAddBasicServiceValues).estimatedTime
              )}
              min={0}
              maxFractionDigits={1}
              onChange={(e) => onInputNumberChange(e, "estimatedTime")}
              className={classNames({
                "p-invalid":
                  submitted &&
                  (formValues as IAddBasicServiceValues).estimatedTime <= 0,
              })}
            />
            {submitted &&
              (formValues as IAddBasicServiceValues).estimatedTime <= 0 && (
                <small className="p-error">Estimated time required</small>
              )}
          </div>
          <div className={styles.servicesFormFields}>
            <label htmlFor="totalPrice">Price</label>
            <InputNumber
              id="totalPrice"
              value={Number((formValues as IAddBasicServiceValues).totalPrice)}
              min={0}
              onChange={(e) => onInputNumberChange(e, "totalPrice")}
              mode="currency"
              currency="CAD"
              className={classNames({
                "p-invalid":
                  submitted &&
                  (formValues as IAddBasicServiceValues).totalPrice <= 0,
              })}
            />
            {submitted &&
              (formValues as IAddBasicServiceValues).totalPrice <= 0 && (
                <small className="p-error">Price required</small>
              )}
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default AddServicePopup;
