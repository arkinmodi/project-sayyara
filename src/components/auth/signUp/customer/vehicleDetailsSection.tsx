import authStyles from "@styles/components/auth/Auth.module.css";
import classNames from "classnames";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { ChangeEvent, useState } from "react";
import { MAKES_AND_MODELS, VEHICLE_YEARS } from "src/constants/vehicles";
import { IAuthSignUpFormCustomerValues } from "../../types";

interface IUserDetailsSectionProps {
  formValues: IAuthSignUpFormCustomerValues;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDropDownChange: (dropdownParams: DropdownChangeParams) => void;
  handleSubmit: () => void;
  prevStep: () => void;
}

/**
 * Handle the form for vehicle information for customer users
 * Includes vehicle make, model, year, the car's VIN and license plate
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @date 02/10/2023
 * @param {IUserDetailsSectionProps} props - User details section props
 * @returns A react form
 */
const UserDetailsSection = (props: IUserDetailsSectionProps) => {
  const [isVehicleMakeValid, setIsVehicleMakeValid] = useState(true);
  const [isVehicleModelValid, setIsVehicleModelValid] = useState(true);
  const [isVehicleYearValid, setIsVehicleYearValid] = useState(true);
  const [isVinValid, setIsVinValid] = useState(true);
  const [isLicensePlateValid, setIsLicensePlateValid] = useState(true);

  const {
    formValues,
    handleInputChange,
    handleDropDownChange,
    prevStep,
    handleSubmit,
  } = props;

  const validateInputs = () => {
    const isValidVehicleMake = formValues.vehicleMake.length > 0;
    setIsVehicleMakeValid(isValidVehicleMake);

    const isValidVehicleModel = formValues.vehicleModel.length > 0;
    setIsVehicleModelValid(isValidVehicleModel);

    const isValidVehicleYear = formValues.vehicleYear != null;
    setIsVehicleYearValid(isValidVehicleYear);

    const isValidVIN = formValues.vin.length > 0;
    setIsVinValid(isValidVIN);

    const isValidLicensePlate = formValues.licensePlate.length > 0;
    setIsLicensePlateValid(isValidLicensePlate);

    return (
      isValidVehicleMake &&
      isValidVehicleModel &&
      isValidVehicleYear &&
      isValidVIN &&
      isValidLicensePlate
    );
  };

  const handleSubmitButtonClick = () => {
    if (validateInputs()) {
      handleSubmit();
    }
  };

  return (
    <div className={authStyles.authForm}>
      <div className={authStyles.authFormBody}>
        <label htmlFor="authSignUpFormCustomerVehicleMakeDropdown">
          Vehicle Make (Required)
        </label>
        <br />
        <Dropdown
          id="authSignUpFormCustomerVehicleMakeDropdown"
          className={classNames(
            authStyles.authFormDropdown,
            !isVehicleMakeValid ? "p-invalid block" : ""
          )}
          value={formValues.vehicleMake}
          options={Object.keys(MAKES_AND_MODELS)}
          onChange={handleDropDownChange}
          filter
          showClear
          placeholder="Select a make"
          name="vehicleMake"
        />
        <small
          id="vehicleMakeHelp"
          className={!isVehicleMakeValid ? "p-error block" : "p-hidden"}
        >
          Vehicle make is required
        </small>
        <br />
        <label htmlFor="authSignUpFormCustomerVehicleYearDropdown">
          Vehicle Year (Required)
        </label>
        <br />
        <Dropdown
          id="authSignUpFormCustomerVehicleYearDropdown"
          className={classNames(
            authStyles.authFormDropdown,
            !isVehicleYearValid ? "p-invalid block" : ""
          )}
          value={formValues.vehicleYear}
          options={VEHICLE_YEARS}
          optionLabel="label"
          onChange={handleDropDownChange}
          filter
          showClear
          placeholder="Select a year"
          name="vehicleYear"
        />
        <small
          id="vehicleYearHelp"
          className={!isVehicleYearValid ? "p-error block" : "p-hidden"}
        >
          Vehicle year is required
        </small>
        <br />
        <label htmlFor="authSignUpFormCustomerVehicleModelDropdown">
          Vehicle Model (Required)
        </label>
        <br />
        <Dropdown
          id="authSignUpFormCustomerVehicleModelDropdown"
          className={classNames(
            authStyles.authFormDropdown,
            !isVehicleModelValid ? "p-invalid block" : ""
          )}
          value={formValues.vehicleModel}
          options={MAKES_AND_MODELS[formValues.vehicleMake]}
          onChange={handleDropDownChange}
          filter
          showClear
          placeholder="Select a model"
          name="vehicleModel"
        />
        <small
          id="vehicleModelHelp"
          className={!isVehicleModelValid ? "p-error block" : "p-hidden"}
        >
          Vehicle model is required
        </small>
        <br />
        <label htmlFor="authSignUpFormCustomerVinInput">VIN (Required)</label>
        <br />
        <InputText
          id="authSignUpFormCustomerVinInput"
          className={classNames(
            authStyles.authFormInput,
            !isVinValid ? "p-invalid block" : ""
          )}
          value={formValues.vin}
          onChange={handleInputChange}
          name="vin"
          placeholder="VIN"
        />
        <small
          id="vinHelp"
          className={!isVinValid ? "p-error block" : "p-hidden"}
        >
          VIN is required
        </small>
        <br />
        <label htmlFor="authSignUpFormCustomerLicensePlateInput">
          License Plate (Required)
        </label>
        <br />
        <InputText
          id="authSignUpFormCustomerLicensePlateInput"
          placeholder="License Plate"
          className={classNames(
            authStyles.authFormInput,
            !isLicensePlateValid ? "p-invalid block" : ""
          )}
          value={formValues.licensePlate}
          onChange={handleInputChange}
          name="licensePlate"
        />
        <small
          id="licensePlateHelp"
          className={!isVinValid ? "p-error block" : "p-hidden"}
        >
          License plate is required
        </small>
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
          onClick={handleSubmitButtonClick}
        />
      </div>
    </div>
  );
};

export default React.memo(UserDetailsSection);
