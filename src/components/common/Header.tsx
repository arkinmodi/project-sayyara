import { UserType } from "@prisma/client";
import {
  setIsAuthDialogOpen,
  setIsLoggedIn,
  setUserType,
} from "@redux/actions/authActions";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/components/common/Header.module.css";
import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Router from "next/router";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import logo from "public/logo.png";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthDialogType } from "src/types/auth";
import AuthDialog from "../auth/authDialog";

const Header = () => {
  const { data: session } = useSession();
  const isLoggedIn = useSelector(AuthSelectors.getIsLoggedIn);
  const userType = useSelector(AuthSelectors.getUserType);
  const dispatch = useDispatch();

  /**
   * Handle navbar button clicks to open auth dialog
   */
  const openAuthDialog = useCallback(
    (type: AuthDialogType) => {
      dispatch(
        setIsAuthDialogOpen({ isAuthDialogOpen: true, authDialogType: type })
      );
    },
    [dispatch]
  );

  const generalItems: MenuItem[] = React.useMemo(() => {
    return [
      // Add general menu items
    ];
  }, []);

  const generalShopItems = React.useMemo(() => {
    return [
      {
        label: "Service Requests",
        command: () => {
          Router.push("/shop/dashboard");
        },
      },
      {
        label: "Manage Shop",
        command: () => {
          Router.push("/shop/manage");
        },
      },
    ];
  }, []);

  const generalCustomerItems = React.useMemo(() => {
    return [
      {
        label: "Browse",
        command: () => {
          Router.push("/");
        },
      },
      {
        label: "My Service Requests",
        command: () => {
          Router.push("/dashboard");
        },
      },
    ];
  }, []);

  const mobileMenuItems = React.useMemo(() => {
    return [
      {
        label: "Login",
        command: () => {
          openAuthDialog(AuthDialogType.CUSTOMER);
        },
      },
      {
        label: "Are you a shop?",
        command: () => {
          openAuthDialog(AuthDialogType.SHOP);
        },
      },
    ];
  }, [openAuthDialog]);

  const mobileMenuItemsLoggedIn = React.useMemo(() => {
    return [
      {
        label: "Logout",
        command: () => {
          signOut();
        },
      },
    ];
  }, []);

  // Set global isLoggedIn state based on user session
  useEffect(() => {
    const userData = session?.user;
    if (!isLoggedIn && userData != null) {
      dispatch(setIsLoggedIn({ isLoggedIn: true }));
      // Load user session state
      if (Object.values(UserType).includes(userData?.type)) {
        dispatch(
          setUserType({
            userType: userData?.type,
          })
        );
      }
    } else if (isLoggedIn && userData == null) {
      dispatch(setIsLoggedIn({ isLoggedIn: false }));
      // Reset user session state
      dispatch(setUserType({ userType: undefined }));
    }
  }, [session?.user, isLoggedIn, dispatch]);

  const start = (
    <Image
      src={logo}
      alt="Sayyara Logo"
      height={logo.height * 0.75}
      width={logo.width * 0.75}
      onClick={() => Router.push("/")}
    />
  );

  const end = !isLoggedIn ? (
    <div>
      <Button
        label="Login"
        className={classNames(styles.loginBtn, "blueText")}
        onClick={() => openAuthDialog(AuthDialogType.CUSTOMER)}
      />
      <Button
        label="Are you a shop?"
        className={styles.shopLoginBtn}
        onClick={() => openAuthDialog(AuthDialogType.SHOP)}
      />
    </div>
  ) : (
    <div>
      <Button
        label="Logout"
        className={classNames(styles.loginBtn, "blueText")}
        onClick={() => signOut()}
      />
    </div>
  );

  const getMenuItems = React.useMemo(() => {
    if (isLoggedIn) {
      if (userType === UserType.CUSTOMER) {
        return generalItems.concat(generalCustomerItems);
      } else if (
        userType === UserType.EMPLOYEE ||
        userType === UserType.SHOP_OWNER
      ) {
        return generalItems.concat(generalShopItems);
      }
    }
    return generalItems;
  }, [
    isLoggedIn,
    userType,
    generalItems,
    generalCustomerItems,
    generalShopItems,
  ]);

  const getMobileMenuItems = React.useMemo(() => {
    if (isLoggedIn) {
      return getMenuItems.concat(mobileMenuItemsLoggedIn);
    } else {
      return getMenuItems.concat(mobileMenuItems);
    }
  }, [isLoggedIn, getMenuItems, mobileMenuItemsLoggedIn, mobileMenuItems]);

  return (
    <div>
      {/* Desktop Nav Bar */}
      <Menubar
        className={classNames(styles.menuBar, styles.desktop)}
        start={start}
        model={getMenuItems}
        end={end}
      />
      {/* Mobile Nav Bar */}
      <Menubar
        className={classNames(styles.menuBar, styles.mobile)}
        start={start}
        model={getMobileMenuItems}
      />
      <AuthDialog />
    </div>
  );
};

export default React.memo(Header);
