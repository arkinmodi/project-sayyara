import styles from "@styles/components/shop/profile/RequestServiceDialog.module.css";
import classNames from "classnames";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import { IService, ServiceType } from "src/types/service";
import { IShop } from "src/types/shop";

interface IRequestServiceDialog {
  visible: boolean;
  onHide: () => void;
  shopId: string;
  shop: IShop;
  basicServices: IService[];
  customServices: IService[];
}

const RequestServiceDialog = (props: IRequestServiceDialog) => {
  const { visible, onHide, shopId, shop, basicServices, customServices } =
    props;
  const allServices = [...basicServices, ...customServices];
  const [selectedService, setSelectedService] = useState<string | IService>("");

  const onServiceChange = (e: { value: any }) => {
    setSelectedService(e.value);
  };

  const displayButton = () => {
    if (typeof selectedService === "string") {
      return "Schedule Service";
    } else {
      return selectedService.type === ServiceType.CANNED
        ? "Schedule Service"
        : "Proceed to Quote";
    }
  };

  const onSubmit = () => {
    // Create appointment, or create quote, based on service type
    // Submit information to redux then route
  };

  return (
    <div>
      <Dialog
        visible={visible}
        onHide={() => onHide()}
        header={shop.name}
        draggable={false}
        className={styles.requestDialog}
      >
        <div className={styles.dialogContainer}>
          <h3>Request a Service</h3>
          <Dropdown
            className={styles.dialogDropdown}
            value={selectedService}
            options={allServices}
            onChange={onServiceChange}
            optionLabel="name"
          />
          <Button
            className={classNames(styles.dialogButton, "blueButton")}
            disabled={selectedService === ""}
            onClick={onSubmit}
          >
            {displayButton()}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default React.memo(RequestServiceDialog);
