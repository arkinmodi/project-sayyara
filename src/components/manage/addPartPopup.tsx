import { setService } from "@redux/actions/serviceAction";
import classNames from "classnames";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { IService, PartCondition, PartType } from "src/types/service";

interface IPartPopupProps {
  service: IService;
  visible: boolean;
  onHideDialog: () => void;
}

interface IAddPartsValues {
  name: string;
  cost: number;
  quantity: number;
  condition: string;
  build: string;
}

const initialPartValues = {
  name: "",
  cost: 0,
  quantity: 0,
  condition: "",
  build: "",
};

const AddPartPopup = (props: IPartPopupProps) => {
  const { service, visible, onHideDialog } = props;
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] =
    useState<IAddPartsValues>(initialPartValues);
  const dispatch = useDispatch();

  useEffect(() => {
    setFormValues(initialPartValues);
  }, [visible]);

  const openPartPopup = () => {
    setFormValues(initialPartValues);
  };

  const onInputChange = (e: any, key: string) => {
    const val = (e.target && e.target.value) || "";
    let _formValues = { ...formValues };
    _formValues[`${key}`] = val;

    setFormValues(_formValues);
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

  const savePart = () => {
    setSubmitted(true);
    if (
      formValues.name != "" &&
      formValues.cost > 0 &&
      formValues.quantity > 0 &&
      formValues.condition != "" &&
      formValues.build != ""
    ) {
      let newParts = [...service.parts];
      newParts.push(formValues);

      dispatch(
        setService({
          serviceId: service.id,
          patch: {
            parts: newParts,
          },
        })
      );
      onHideDialog();
    }
  };

  const partDialogFooter = (
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
        onClick={savePart}
      />
    </div>
  );

  const parts_condition = [
    { label: "NEW", value: PartCondition.NEW },
    { label: "USED", value: PartCondition.USED },
  ];

  const parts_type = [
    { label: "OEM", value: PartType.OEM },
    { label: "AFTERMARKET", value: PartType.AFTER_MARKET },
  ];

  return (
    <Dialog
      visible={visible}
      style={{ width: "450px" }}
      header={`Add part for ${service.name}`}
      modal
      className="p-fluid"
      footer={partDialogFooter}
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
          className={classNames({
            "p-invalid": submitted && formValues.name == "",
          })}
        />
        {submitted && formValues.name == "" && (
          <small className="p-error">Name required</small>
        )}
      </div>
      <div className="formgrid grid">
        <div className="field col">
          <label htmlFor="cost">Cost Per Part</label>
          <InputNumber
            id="cost"
            value={formValues.cost}
            onValueChange={(e) => onInputNumberChange(e, "cost")}
            mode="currency"
            currency="CAD"
            locale="en-US"
            className={classNames({
              "p-invalid": submitted && formValues.cost <= 0,
            })}
          />
          {submitted && formValues.cost <= 0 && (
            <small className="p-error">Cost required</small>
          )}
        </div>
        <div className="field col">
          <label htmlFor="quantity">Quantity</label>
          <InputNumber
            id="quantity"
            value={formValues.quantity}
            onValueChange={(e) => onInputNumberChange(e, "quantity")}
            className={classNames({
              "p-invalid": submitted && formValues.quantity <= 0,
            })}
          />
          {submitted && formValues.quantity <= 0 && (
            <small className="p-error">Quantity required</small>
          )}
        </div>
      </div>
      <div>Part Condition</div>
      <Dropdown
        value={formValues.condition}
        options={parts_condition}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => onInputChange(e, "condition")}
        placeholder={
          formValues.condition == ""
            ? "Select a condition"
            : formValues.condition
        }
        itemTemplate={(option) => {
          return (
            <span
              className={`product-badge status-${option.value.toLowerCase()}`}
            >
              {option.label}
            </span>
          );
        }}
        className={classNames({
          "p-invalid": submitted && formValues.condition == "",
        })}
      />
      {submitted && formValues.condition == "" && (
        <small className="p-error">Condition required</small>
      )}
      <div>Part Type</div>
      <Dropdown
        value={formValues.build}
        options={parts_type}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => onInputChange(e, "build")}
        placeholder={
          formValues.build == "" ? "Select a type" : formValues.build
        }
        itemTemplate={(option) => {
          return (
            <span
              className={`product-badge status-${option.value.toLowerCase()}`}
            >
              {option.label}
            </span>
          );
        }}
        className={classNames({
          "p-invalid": submitted && formValues.build == "",
        })}
      />
      {submitted && formValues.build == "" && (
        <small className="p-error">Type required</small>
      )}
    </Dialog>
  );
};

export default AddPartPopup;
