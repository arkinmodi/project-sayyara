import authStyles from "@styles/components/auth/Auth.module.css";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { ChangeEvent } from "react";
import { MAKES_AND_MODELS, VEHICLE_YEARS } from "src/constants/vehicles";
import { IAuthSignUpFormCustomerValues } from "../../types";

interface IUserDetailsSectionProps {
  formValues: IAuthSignUpFormCustomerValues;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDropDownChange: (dropdownParams: DropdownChangeParams) => void;
  handleSubmit: () => void;
  prevStep: () => void;
}

const UserDetailsSection = (props: IUserDetailsSectionProps) => {
  const {
    formValues,
    handleInputChange,
    handleDropDownChange,
    prevStep,
    handleSubmit,
  } = props;

  return (
    <div className={authStyles.authForm}>
      <div className={authStyles.authFormBody}>
        <label htmlFor="authSignUpFormCustomerVehicleMakeDropdown">
          Vehicle Make (Required)
        </label>
        <br />
        <Dropdown
          id="authSignUpFormCustomerVehicleMakeDropdown"
          className={authStyles.authFormDropdown}
          value={formValues.vehicleMake}
          options={Object.keys(MAKES_AND_MODELS)}
          onChange={handleDropDownChange}
          filter
          showClear
          placeholder="Select a make"
          name="vehicleMake"
        />
        <br />
        <label htmlFor="authSignUpFormCustomerVehicleYearDropdown">
          Vehicle Year (Required)
        </label>
        <br />
        <Dropdown
          id="authSignUpFormCustomerVehicleYearDropdown"
          className={authStyles.authFormDropdown}
          value={formValues.vehicleYear}
          options={VEHICLE_YEARS}
          optionLabel="label"
          onChange={handleDropDownChange}
          filter
          showClear
          placeholder="Select a year"
          name="vehicleYear"
        />
        <br />
        <label htmlFor="authSignUpFormCustomerVehicleModelDropdown">
          Vehicle Model (Required)
        </label>
        <br />
        <Dropdown
          id="authSignUpFormCustomerVehicleModelDropdown"
          className={authStyles.authFormDropdown}
          value={formValues.vehicleModel}
          options={MAKES_AND_MODELS[formValues.vehicleMake]}
          onChange={handleDropDownChange}
          filter
          showClear
          placeholder="Select a model"
          name="vehicleModel"
        />
        <br />
        <label htmlFor="authSignUpFormCustomerVinInput">VIN (Required)</label>
        <br />
        <InputText
          id="authSignUpFormCustomerVinInput"
          className={authStyles.authFormInput}
          value={formValues.vin}
          onChange={handleInputChange}
          name="vin"
          placeholder="VIN"
        />
        <br />
        <label htmlFor="authSignUpFormCustomerLicensePlateInput">
          License Plate (Required)
        </label>
        <br />
        <InputText
          id="authSignUpFormCustomerLicensePlateInput"
          placeholder="License Plate"
          className={authStyles.authFormInput}
          value={formValues.licensePlate}
          onChange={handleInputChange}
          name="licensePlate"
        />
      </div>
      <div className={authStyles.authFormButtonGroup}>
        <Button
          label="Back"
          className={authStyles.authFormButtonMinimal}
          onClick={prevStep}
        />
        <Button
          label="Submit"
          className={authStyles.authFormButton}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default React.memo(UserDetailsSection);
