import AuthTypes from "@redux/types/authTypes";
import { getCsrfToken } from "next-auth/react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authStyles from "../../styles/pages/auth/Auth.module.css";
import { ILoginFormValues } from "./types";

const initialLoginFormValues: ILoginFormValues = {
  csrfToken: "",
  email: "",
  password: "",
};

const AuthLoginForm = () => {
  const [formValues, setFormValues] = useState<ILoginFormValues>({
    ...initialLoginFormValues,
  });

  useEffect(() => {
    async function fetchCSRF() {
      try {
        const res = await getCsrfToken();
        if (!!res) {
          setFormValues({ ...formValues, csrfToken: res });
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchCSRF();
  }, []);

  const dispatch = useDispatch();
  const handleLoginButtonClick = (): void => {
    // TODO: validate inputs
    dispatch({ type: AuthTypes.CREATE_LOGIN, payload: formValues });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <div className={authStyles.authForm}>
      <div className={authStyles.authFormBody}>
        <label htmlFor="authLoginFormEmailInput">Email (Required)</label>
        <br />
        <InputText
          id="authLoginFormEmailInput"
          className={authStyles.authFormInput}
          value={formValues.email}
          onChange={handleInputChange}
          name="email"
          placeholder="Email"
        />
        <br />
        <label htmlFor="authLoginFormPasswordInput">Password (Required)</label>
        <br />
        <InputText
          id="authLoginFormPasswordInput"
          type="password"
          placeholder="Password"
          className={authStyles.authFormInput}
          value={formValues.password}
          onChange={handleInputChange}
          name="password"
        />
      </div>
      <div className={authStyles.authFormButtonGroup}>
        <Button
          label="Login"
          className={authStyles.authFormButton}
          onClick={handleLoginButtonClick}
        />
      </div>
    </div>
  );
};

export default React.memo(AuthLoginForm);
