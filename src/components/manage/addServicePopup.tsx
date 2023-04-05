import { createService } from "@redux/actions/serviceAction";
import styles from "@styles/pages/services/Services.module.css";
import classNames from "classnames";
import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeParams } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { DropdownChangeParams } from "primereact/dropdown";
import {
  InputNumber,
  InputNumberValueChangeParams,
} from "primereact/inputnumber";
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

/**
 * Creates and handles the pop up for adding a service
 * Pop up is for both basic and custom services
 * Form information includes name, description, estimated time, and price for basic
 * Form information includes name, description, part condition and part type for custom
 *
 * @author Joy Xiao <34189744+joyxiao99@users.noreply.github.com>
 * @date 02/09/2023
 * @param {IServicePopupProps} props - Service pop up props
 * @returns A primereact dialog for adding a service
 */
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

  const onCheckedChange = (e: CheckboxChangeParams) => {
    const val = e.checked ?? false;

    setFormValues({
      ...formValues,
      [e.target.name]: val,
    });
  };

  const onInputChange = (
    e:
      | DropdownChangeParams
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const val = e.target.value ?? "";

    setFormValues({
      ...formValues,
      [e.target.name]: val,
    });
  };

  const onInputNumberChange = (e: InputNumberValueChangeParams) => {
    const val = e.value ?? 0;
    const key: string = e.target.name;
    setFormValues({
      ...formValues,
      [key]: val,
    });
  };

  const hideDialog = () => {
    setSubmitted(false);
    onHideDialog();
  };

  const saveService = () => {
    setSubmitted(true);
    if (
      serviceType === ServiceType.CANNED &&
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
      serviceType === ServiceType.CUSTOM &&
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
          name="name"
          onChange={onInputChange}
          required
          autoFocus
          className={classNames({
            "p-invalid": submitted && formValues.name.length === 0,
          })}
        />
        {submitted && formValues.name.length === 0 && (
          <small className="p-error">Name required</small>
        )}
      </div>
      <div className={styles.servicesFormFields}>
        <label htmlFor="description">Description</label>
        <InputTextarea
          id="description"
          value={formValues.description}
          name="description"
          onChange={onInputChange}
          required
          rows={3}
          cols={20}
          className={classNames({
            "p-invalid": submitted && formValues.description.length === 0,
          })}
        />
        {submitted && formValues.description.length === 0 && (
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
              name="new"
              onChange={onCheckedChange}
              checked={(formValues as IAddCustomServiceValues).new}
            ></Checkbox>
            <label htmlFor="cb1" className="p-checkbox-label">
              New
            </label>
            <Checkbox
              className={styles.customServiceCheckbox}
              inputId="used"
              value="used"
              name="used"
              onChange={onCheckedChange}
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
              value="oem"
              name="oem"
              onChange={onCheckedChange}
              checked={(formValues as IAddCustomServiceValues).oem}
            ></Checkbox>
            <label htmlFor="cb1" className="p-checkbox-label">
              OEM
            </label>
            <Checkbox
              className={styles.customServiceCheckbox}
              inputId="aftermarket"
              value="aftermarket"
              name="aftermarket"
              onChange={onCheckedChange}
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
            <label htmlFor="estimatedTime">Estimated Duration (Hours)</label>
            <InputNumber
              id="estimatedTime"
              value={Number(
                (formValues as IAddBasicServiceValues).estimatedTime
              )}
              min={0}
              name="estimatedTime"
              maxFractionDigits={1}
              onValueChange={onInputNumberChange}
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
              name="totalPrice"
              onValueChange={onInputNumberChange}
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
