import styles from "@styles/components/workOrders/WorkOrderMetadataDialog.module.css";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { IWorkOrder } from "src/types/workOrder";
import { PatchWorkOrderByIdBody } from "src/utils/workOrderUtil";

const WorkOrderMetadataDialog: React.FC<{
  isVisible: boolean;
  onHide: () => void;
  workOrder: IWorkOrder;
  saveWorkOrder: (patch: PatchWorkOrderByIdBody) => Promise<void>;
}> = (props) => {
  const { workOrder } = props;

  const [workOrderTitle, setWorkOrderTitle] = useState<string>(workOrder.title);
  const [workOrderAssignedEmployeeEmail, setWorkOrderAssignedEmployeeEmail] =
    useState<string | undefined>(workOrder.employee?.email);

  const handleSave = async () => {
    await props.saveWorkOrder({
      title: workOrderTitle,
      employee_email: workOrderAssignedEmployeeEmail,
    });

    props.onHide();
  };

  const footer = () => {
    return (
      <div>
        <Button
          className={`p-button-success ${styles.workOrderMetadataDialogFooterContainerButtons}`}
          icon="pi pi-save"
          label="Save"
          aria-label="Save"
          onClick={handleSave}
        />
        <Button
          className={`p-button-danger ${styles.workOrderMetadataDialogFooterContainerButtons}`}
          icon="pi pi-times"
          label="Cancel"
          aria-label="Cancel"
          onClick={props.onHide}
        />
      </div>
    );
  };

  return (
    <Dialog
      visible={props.isVisible}
      onHide={props.onHide}
      footer={footer}
      header="Edit Metadata"
    >
      <div>
        <label htmlFor="workOrderTitle">Title</label>
        <br />
        <InputText
          id="workOrderTitle"
          name="title"
          placeholder={workOrderTitle}
          value={workOrderTitle}
          onChange={(e) => setWorkOrderTitle(e.target.value)}
          className={styles.workOrderMetadataDialogTitleTextBox}
        />
        <br />

        <label htmlFor="workOrderAssignedEmployee">
          Assigned Employee (Email)
        </label>
        <br />
        <InputText
          id="workOrderAssignedEmployee"
          name="assignedEmployee"
          placeholder={workOrderAssignedEmployeeEmail}
          value={workOrderAssignedEmployeeEmail}
          onChange={(e) => setWorkOrderAssignedEmployeeEmail(e.target.value)}
          className={styles.workOrderMetadataDialogEmployeeEmailTextBox}
        />
        <br />
      </div>
    </Dialog>
  );
};

export default React.memo(WorkOrderMetadataDialog);
