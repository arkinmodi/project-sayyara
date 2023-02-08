import { createService } from "@redux/actions/serviceAction";
import styles from "@styles/pages/services/Services.module.css";
import classNames from "classnames";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/InputTextarea";
import { useEffect, useState } from "react";
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
  estimated_time: number;
  total_price: number;
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
  estimated_time: 0,
  total_price: 0,
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
  }, [visible]);

  const dispatch = useDispatch();

  const onCheckedChange = (key: string) => {
    let _formValues = { ...formValues };
    _formValues[`${key}`] = !_formValues[`${key}`];

    setFormValues(_formValues);
  };

  const onInputChange = (e: any, key: string) => {
    const val = (e.target && e.target.value) || "";
    let _formValues = { ...formValues };
    _formValues[`${key}`] = val;

    setFormValues(_formValues);
  };

  const onInputNumberChange = (e: any, key: string) => {
    const val = e.value || 0;
    let _formValues = { ...formValues };
    _formValues[`${key}`] = val;

    setFormValues(_formValues);
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
      formValues.total_price > 0
    ) {
      dispatch(
        createService({
          name: formValues.name,
          description: formValues.description,
          estimated_time: formValues.estimated_time,
          total_price: formValues.total_price,
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
      (formValues.oem || formValues.aftermarket) &&
      (formValues.new || formValues.used)
    ) {
      var partCondition: PartCondition;
      var partBuild: PartType;

      if (formValues.oem && formValues.aftermarket) {
        partBuild = PartType.OEM_AND_AFTERMARKET;
      } else if (formValues.oem) {
        partBuild = PartType.OEM;
      } else {
        partBuild = PartType.AFTERMARKET;
      }

      if (formValues.new && formValues.used) {
        partCondition = PartCondition.NEW_AND_USED;
      } else if (formValues.new) {
        partCondition = PartCondition.NEW;
      } else {
        partCondition = PartCondition.USED;
      }

      dispatch(
        createService({
          name: formValues.name,
          description: formValues.description,
          estimated_time: 0,
          total_price: 0,
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
                submitted && formValues.new == "" && formValues.used == "",
            })}
          >
            <div className={styles.servicesFormFields}>Part Condition</div>
            <Checkbox
              inputId="new"
              value="new"
              onChange={(e) => onCheckedChange("new")}
              checked={formValues.new}
            ></Checkbox>
            <label htmlFor="cb1" className="p-checkbox-label">
              New
            </label>
            <Checkbox
              inputId="used"
              value="used"
              onChange={(e) => onCheckedChange("used")}
              checked={formValues.used}
            ></Checkbox>
            <label htmlFor="cb1" className="p-checkbox-label">
              Used
            </label>
          </div>
          {submitted && formValues.new == "" && formValues.used == "" && (
            <small className="p-error">Condition required</small>
          )}
          {/* Part Type Dropdown */}
          <div
            className={classNames({
              "p-invalid":
                submitted &&
                formValues.oem == "" &&
                formValues.aftermarket == "",
            })}
          >
            <div className={styles.servicesFormFields}>Part Type</div>
            <Checkbox
              inputId="oem"
              value="OEM"
              onChange={(e) => onCheckedChange("oem")}
              checked={formValues.oem}
            ></Checkbox>
            <label htmlFor="cb1" className="p-checkbox-label">
              OEM
            </label>
            <Checkbox
              inputId="aftermarket"
              value="aftermarket"
              onChange={(e) => onCheckedChange("aftermarket")}
              checked={formValues.aftermarket}
            ></Checkbox>
            <label htmlFor="cb1" className="p-checkbox-label">
              Aftermarket
            </label>
          </div>
          {submitted &&
            formValues.oem == "" &&
            formValues.aftermarket == "" && (
              <small className="p-error">Type required</small>
            )}
        </div>
      ) : (
        <div className={styles.servicesFormFields}>
          <label htmlFor="total_price">Price</label>
          <InputNumber
            id="description"
            value={formValues.total_price}
            onChange={(e) => onInputNumberChange(e, "total_price")}
            required
            mode="currency"
            currency="CAD"
            className={classNames({
              "p-invalid": submitted && formValues.total_price <= 0,
            })}
          />
          {submitted && formValues.total_price <= 0 && (
            <small className="p-error">Price required</small>
          )}
        </div>
      )}
    </Dialog>
  );
};

export default AddServicePopup;
