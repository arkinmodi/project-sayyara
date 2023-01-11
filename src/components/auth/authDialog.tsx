import { setIsAuthDialogOpen } from "@redux/actions/authActions";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/components/auth/AuthDialog.module.css";
import { Dialog } from "primereact/dialog";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthDialogType } from "src/types/auth";
import AuthFormTabs from "./authFormTabs";

const AuthDialog = () => {
  const [displayDialog, setDisplayDialog] = useState(false);
  const [dialogType, setDialogType] = useState<AuthDialogType>(
    AuthDialogType.CUSTOMER
  );

  const dispatch = useDispatch();
  const isOpen = useSelector(AuthSelectors.getAuthDialogIsOpen);
  const authDialogType = useSelector(AuthSelectors.getAuthDialogType);
  const isLoggedIn = useSelector(AuthSelectors.getIsLoggedIn);

  /**
   * Hide auth Dialog and reset Dialog state
   */
  const onHide = useCallback(() => {
    setDisplayDialog(false);
    dispatch(
      setIsAuthDialogOpen({
        isAuthDialogOpen: false,
        authDialogType: AuthDialogType.CUSTOMER,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    setDisplayDialog(isOpen);
  }, [isOpen]);

  useEffect(() => {
    setDialogType(authDialogType);
  }, [authDialogType]);

  useEffect(() => {
    if (isLoggedIn) {
      onHide();
    }
  }, [isLoggedIn, onHide]);

  return (
    <div>
      {dialogType != null ? (
        <Dialog
          className={styles.authDialog}
          visible={displayDialog}
          onHide={() => onHide()}
        >
          <AuthFormTabs dialogType={dialogType} />
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};

export default React.memo(AuthDialog);
