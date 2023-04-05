import styles from "@styles/components/auth/AuthDialog.module.css";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";
import { AuthDialogType } from "src/types/auth";
import AuthLoginForm from "./authLoginForm";
import AuthSignUpFormCustomer from "./signUp/customer/authSignUpFormCustomer";
import AuthSignUpFormShop from "./signUp/shop/authSignUpFormShop";

interface IAuthFormTabsProps {
  dialogType: AuthDialogType;
}

/**
 * Creates the react tabs that toggle between signing up and logging in for the dialog
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @date 01/09/2023
 * @param {IAuthFormTabsProps} props - Authentication form tabs props
 * @returns A primereact tab component
 */
const AuthFormTabs = (props: IAuthFormTabsProps) => {
  return (
    <div className={styles.authTabViewContainer}>
      <TabView>
        <TabPanel header="Login">
          <AuthLoginForm />
        </TabPanel>
        <TabPanel header="Sign Up">
          {props.dialogType == AuthDialogType.CUSTOMER ? (
            <AuthSignUpFormCustomer />
          ) : (
            <AuthSignUpFormShop />
          )}
        </TabPanel>
      </TabView>
    </div>
  );
};

export default React.memo(AuthFormTabs);
