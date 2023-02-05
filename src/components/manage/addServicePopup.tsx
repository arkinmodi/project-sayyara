import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/InputTextarea";
import { useState } from "react";
import { IParts, ServiceType } from "src/types/service";

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

  const onSubmit = () => {
    setSubmitted(true);
    onHideDialog();
  };

  const openServicePopup = () => {
    if (serviceType === ServiceType.CANNED) {
      setFormValues(initialAddCustomServiceValues);
    } else {
      setFormValues(initialAddBasicServiceValues);
    }
  };

  const onCheckedChange = (e: any, key: string) => {
    let _formValues = { ...formValues };
    console.log(_formValues);
    _formValues[`${key}`] = !_formValues[`${key}`];

    setFormValues(_formValues);
  };

  const onInputChange = (e: any, key: string) => {
    const val = (e.target && e.target.value) || "";
    let _formValues = { ...formValues };
    _formValues[`${key}`] = val;

    setFormValues(_formValues);
    console.log(formValues);
  };

  const onInputNumberChange = (e, key) => {
    const val = e.value || 0;
    let _formValues = { ...formValues };
    _formValues[`${key}`] = val;

    setFormValues(_formValues);
  };

  const hideDialog = () => {
    setSubmitted(false);
    onHideDialog();
  };

  const saveProduct = () => {
    setSubmitted(true);
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
        onClick={saveProduct}
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
      <div className="field">
        <label htmlFor="name">Name</label>
        <InputText
          id="name"
          value={formValues.name}
          onChange={(e) => onInputChange(e, "name")}
          required
          autoFocus
          // className={classNames({ "p-invalid": submitted && !product.name })}
        />
        {/* {submitted && !product.name && (
          <small className="p-error">Name is required.</small>
        )} */}
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <InputTextarea
          id="description"
          value={formValues.description}
          onChange={(e) => onInputChange(e, "description")}
          required
          rows={3}
          cols={20}
        />
      </div>
      {serviceType == ServiceType.CUSTOM ? (
        <div className="col-12">
          <div>Part Type</div>
          <Checkbox
            inputId="oem"
            value="OEM"
            onChange={(e) => onCheckedChange(e, "oem")}
            checked={formValues.oem}
          ></Checkbox>
          <label htmlFor="cb1" className="p-checkbox-label">
            OEM
          </label>
          <Checkbox
            inputId="aftermarket"
            value="aftermarket"
            onChange={(e) => onCheckedChange(e, "aftermarket")}
            checked={formValues.aftermarket}
          ></Checkbox>
          <label htmlFor="cb1" className="p-checkbox-label">
            Aftermarket
          </label>
          <div>Part Condition</div>
          <Checkbox
            inputId="new"
            value="new"
            onChange={(e) => onCheckedChange(e, "new")}
            checked={formValues.new}
          ></Checkbox>
          <label htmlFor="cb1" className="p-checkbox-label">
            New
          </label>
          <Checkbox
            inputId="used"
            value="used"
            onChange={(e) => onCheckedChange(e, "used")}
            checked={formValues.used}
          ></Checkbox>
          <label htmlFor="cb1" className="p-checkbox-label">
            Used
          </label>
        </div>
      ) : (
        <div className="col-12"></div>
      )}
      <div className="formgrid grid">
        <div className="field col">
          <label htmlFor="price">Price</label>
          <InputNumber
            id="price"
            value={formValues.price}
            onValueChange={(e) => onInputNumberChange(e, "price")}
            mode="currency"
            currency="CAD"
            locale="en-US"
          />
        </div>
        <div className="field col">
          <label htmlFor="quantity">Quantity</label>
          <InputNumber
            id="quantity"
            value={formValues.quantity}
            onValueChange={(e) => onInputNumberChange(e, "quantity")}
            integeronly
          />
        </div>
      </div>
    </Dialog>
  );
};

export default AddServicePopup;
