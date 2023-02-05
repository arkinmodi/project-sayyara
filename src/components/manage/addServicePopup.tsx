import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { IParts, ServiceType } from "src/types/service";

interface IServicePopupProps {
  serviceType: ServiceType;
  visible: boolean;
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
  parts_condition_new: boolean;
  parts_condition_used: boolean;
  parts_type_oem: boolean;
  parts_type_aftermarket: boolean;
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
  parts_condition_new: false,
  parts_condition_used: false,
  parts_type_oem: false,
  parts_type_aftermarket: false,
};

const AddServicePopup = (props: IServicePopupProps) => {
  const { serviceType, visible } = props;
  const [serviceDialog, setServiceDialog] = useState(visible);
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
    setServiceDialog(false);
  };

  const openServicePopup = () => {
    if (serviceType === ServiceType.CANNED) {
      setFormValues(initialAddCustomServiceValues);
    } else {
      setFormValues(initialAddBasicServiceValues);
    }
    setServiceDialog(true);
  };

  // const onCategoryChange = (e) => {
  //   let _product = { ...product };
  //   _product["category"] = e.value;
  //   setFormValues(_product);
  // };

  // const onInputChange = (e: { target: { value: any; }; }, name: any) => {
  //   const val = (e.target && e.target.value) || "";
  //   let _formValues = { ...formValues };
  //   _formValues[`${name}`] = val;

  //   setFormValues(_formValues);
  // };

  // const onInputNumberChange = (e, name) => {
  //   const val = e.value || 0;
  //   let _formValues = { ...formValues };
  //   _formValues[`${name}`] = val;

  //   setFormValues(_formValues);
  // };

  const hideDialog = () => {
    setSubmitted(false);
    setServiceDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);
    //close the dialog
    setServiceDialog(false);
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
      visible={serviceDialog}
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
          // onChange={(e) => onInputChange(e, "name")}
          required
          autoFocus
          // className={classNames({ "p-invalid": submitted && !product.name })}
        />
        {/* {submitted && !product.name && (
          <small className="p-error">Name is required.</small>
        )} */}
      </div>
      {/* <div className="field">
        <label htmlFor="description">Description</label>
        <InputTextarea
          id="description"
          value={product.description}
          onChange={(e) => onInputChange(e, "description")}
          required
          rows={3}
          cols={20}
        />
      </div>

      <div className="field">
        <label className="mb-3">Category</label>
        <div className="formgrid grid">
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="category1"
              name="category"
              value="Accessories"
              onChange={onCategoryChange}
              checked={product.category === "Accessories"}
            />
            <label htmlFor="category1">Accessories</label>
          </div>
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="category2"
              name="category"
              value="Clothing"
              onChange={onCategoryChange}
              checked={product.category === "Clothing"}
            />
            <label htmlFor="category2">Clothing</label>
          </div>
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="category3"
              name="category"
              value="Electronics"
              onChange={onCategoryChange}
              checked={product.category === "Electronics"}
            />
            <label htmlFor="category3">Electronics</label>
          </div>
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="category4"
              name="category"
              value="Fitness"
              onChange={onCategoryChange}
              checked={product.category === "Fitness"}
            />
            <label htmlFor="category4">Fitness</label>
          </div>
        </div>
      </div>

      <div className="formgrid grid">
        <div className="field col">
          <label htmlFor="price">Price</label>
          <InputNumber
            id="price"
            value={product.price}
            onValueChange={(e) => onInputNumberChange(e, "price")}
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>
        <div className="field col">
          <label htmlFor="quantity">Quantity</label>
          <InputNumber
            id="quantity"
            value={product.quantity}
            onValueChange={(e) => onInputNumberChange(e, "quantity")}
            integeronly
          />
        </div>
      </div> */}
    </Dialog>
  );
};

export default AddServicePopup;
