import { AuthSelectors } from "@redux/selectors/authSelectors";
import AuthTypes from "@redux/types/authTypes";
import styles from "@styles/components/auth/AuthDialog.module.css";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthDialogType } from "src/types/auth";
import AuthFormTabs from "./authFormTabs";

const AuthDialog = () => {
  const [displayDialog, setDisplayDialog] = useState(false);
  const [dialogType, setDialogType] = useState<AuthDialogType | undefined>(
    undefined
  );

  const dispatch = useDispatch();
  const isOpen = useSelector(AuthSelectors.getAuthDialogIsOpen);
  const authDialogType = useSelector(AuthSelectors.getAuthDialogType);
  const isLoggedIn = useSelector(AuthSelectors.getIsLoggedIn);

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
  }, [isLoggedIn]);

  /**
   * Hide auth Dialog and reset Dialog state
   */
  const onHide = () => {
    setDisplayDialog(false);
    dispatch({
      type: AuthTypes.SET_IS_AUTH_DIALOG_OPEN,
      payload: { isAuthDialogOpen: false, AuthDialogType: undefined },
    });
  };

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
