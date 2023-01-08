import authStyles from "@styles/components/auth/Auth.module.css";
import { Button } from "primereact/button";
import React, { useState } from "react";
import { ShopRoles } from "src/types/auth";
import AuthSignUpFormShopEmployee from "./employee/authSignUpFormShopEmployee";
import AuthSignUpFormShopOwner from "./owner/authSignUpFormShopOwner";

const AuthSignUpFormShop = () => {
  const [role, setRole] = useState<ShopRoles | null>(null);

  const resetShopSignUp = () => {
    setRole(null);
  };

  const renderRoleSelectionButtons = () => {
    return (
      <div className={authStyles.authForm}>
        <div className={authStyles.authFormShopRoleButtonGroup}>
          <Button
            className={authStyles.authFormShopRoleButton}
            label="Shop Owner"
            onClick={() => setRole(ShopRoles.SHOP_OWNER)}
          />
          <Button
            className={authStyles.authFormShopRoleButton}
            label="Employee"
            onClick={() => setRole(ShopRoles.EMPLOYEE)}
          />
        </div>
      </div>
    );
  };

  const renderForm = (role: ShopRoles | null) => {
    switch (role) {
      case ShopRoles.EMPLOYEE:
        return <AuthSignUpFormShopEmployee resetShopSignUp={resetShopSignUp} />;
      case ShopRoles.SHOP_OWNER:
        return <AuthSignUpFormShopOwner resetShopSignUp={resetShopSignUp} />;
      default:
        return renderRoleSelectionButtons();
    }
  };

  return renderForm(role);
};

export default React.memo(AuthSignUpFormShop);
