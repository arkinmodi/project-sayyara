import { UserType } from "@prisma/client";
import {
  readCustomerVehicleInfo,
  setIsAuthDialogOpen,
  setIsLoggedIn,
  setUserSession,
} from "@redux/actions/authActions";
import {
  getCustomerQuotes,
  getShopQuotes,
  setSelectedChat,
} from "@redux/actions/quoteAction";
import { setShopState } from "@redux/actions/shopActions";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import { initialShopState } from "@redux/state/shop/shopState";
import { initialAuthState } from "@redux/state/user/authState";
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

/**
 * Creates and handles the header found across the entire website
 * Content varies based on login state and user type
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @date 02/12/2023
 * @returns The react component for the header
 */
const Header = () => {
  const { data: session } = useSession();
  const isLoggedIn = useSelector(AuthSelectors.getIsLoggedIn);
  const userType = useSelector(AuthSelectors.getUserType);
  const shopId = useSelector(AuthSelectors.getShopId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userType === UserType.CUSTOMER) {
      dispatch(readCustomerVehicleInfo());
      dispatch(getCustomerQuotes());
    } else if (userType !== null) {
      dispatch(getShopQuotes());
    } else {
      dispatch(setSelectedChat({ id: null }));
    }
  }, [userType]);

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
    {
      return userType === UserType.SHOP_OWNER && shopId
        ? [
            {
              label: "Profile",
              command: () => {
                Router.push(`/shop/${shopId}`);
              },
            },
            {
              label: "Logout",
              command: () => {
                signOut();
              },
            },
          ]
        : [
            {
              label: "Logout",
              command: () => {
                signOut();
              },
            },
          ];
    }
  }, [userType, shopId]);

  // Set global isLoggedIn state based on user session
  useEffect(() => {
    const userData = session?.user;
    if (!isLoggedIn && userData != null) {
      dispatch(setIsLoggedIn({ isLoggedIn: true }));
      // Load user session state
      dispatch(
        setUserSession({
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userType: userData.type,
          shopId: userData.shopId ?? null,
        })
      );
    } else if (isLoggedIn && userData == null) {
      dispatch(setIsLoggedIn({ isLoggedIn: false }));
      // Reset user session state
      dispatch(setUserSession(initialAuthState.session));
      // Reset shop state
      dispatch(setShopState(initialShopState));
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
      {userType === UserType.SHOP_OWNER && shopId ? (
        <Button
          className={styles.customMenuItemButton}
          onClick={() => Router.push(`/shop/${shopId}`)}
        >
          <span className="p-menuitem-text">Shop Profile</span>
        </Button>
      ) : (
        <></>
      )}
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
