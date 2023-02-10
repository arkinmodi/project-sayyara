import styles from "@styles/components/shop/profile/RequestServiceDialog.module.css";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import { IService } from "src/types/service";
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
  const [selectedService, setSelectedService] = useState("");

  const onServiceChange = (e: { value: any }) => {
    setSelectedService(e.value);
  };

  return (
    <div>
      <Dialog
        visible={visible}
        onHide={() => onHide()}
        header={shop.name}
        draggable={false}
        style={{ width: "50vw" }}
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
          <Button className={styles.dialogButton}>Request a Service</Button>
        </div>
      </Dialog>
    </div>
  );
};

export default React.memo(RequestServiceDialog);
