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
