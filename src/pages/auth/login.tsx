import AuthTypes from "@redux/types/authTypes";
import { getServerAuthSession } from "@server/common/getServerAuthSession";
import authStyles from "@styles/pages/auth/Auth.module.css";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getCsrfToken } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";

interface ILoginFormValues {
  csrfToken: "";
  email: string;
  password: string;
}

const initialLoginFormValues: ILoginFormValues = {
  csrfToken: "",
  email: "",
  password: "",
};

const Login: NextPage = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [formValues, setFormValues] = useState<ILoginFormValues>({
    ...initialLoginFormValues,
    csrfToken,
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignUpButtonClick = () => {
    const href = {
      pathname: "/auth/register",
      query: { callbackUrl: router.query.callbackUrl },
    };
    router.push(href);
  };

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
    <div className={authStyles.authContainer}>
      <Card className={authStyles.authFormCard}>
        <div className={authStyles.authFormCardHeader}>
          <i className="pi pi-user" style={{ fontSize: "2em" }} />
          <h1>Login</h1>
        </div>
        <div className={authStyles.authForm}>
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
          <label htmlFor="authLoginFormPasswordInput">
            Password (Required)
          </label>
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
          <div className={authStyles.authFormButtonGroup}>
            <Button
              label="Login"
              className={authStyles.authFormButton}
              onClick={handleLoginButtonClick}
            />
            <Button
              label="Sign Up"
              className={authStyles.authFormButton}
              onClick={handleSignUpButtonClick}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const callbackUrl = context.query.callbackUrl;
  const session = await getServerAuthSession(context);

  if (session && !Array.isArray(callbackUrl)) {
    return {
      redirect: {
        destination: callbackUrl ?? "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
};

export default Login;
