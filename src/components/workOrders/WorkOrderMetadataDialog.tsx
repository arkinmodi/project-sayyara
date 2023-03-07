import { AppointmentStatus } from "@prisma/client";
import styles from "@styles/components/workOrders/WorkOrderMetadataDialog.module.css";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { IWorkOrder } from "src/types/workOrder";
import {
  PatchAppointmentByIdBody,
  PatchWorkOrderByIdBody,
} from "src/utils/workOrderUtil";

const WorkOrderMetadataDialog: React.FC<{
  isVisible: boolean;
  onHide: () => void;
  workOrder: IWorkOrder;
  saveWorkOrder: (patch: PatchWorkOrderByIdBody) => Promise<void>;
  saveAppointment: (patch: PatchAppointmentByIdBody) => Promise<void>;
}> = (props) => {
  const { workOrder } = props;

  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [workOrderTitle, setWorkOrderTitle] = useState<string>(workOrder.title);
  const [workOrderAssignedEmployeeEmail, setWorkOrderAssignedEmployeeEmail] =
    useState<string | undefined>(workOrder.employee?.email);
  const [workOrderStatus, setWorkOrderStatus] = useState<
    AppointmentStatus | undefined
  >(workOrder.appointment?.status);

  const handleSave = async () => {
    setIsSaving(true);
    if (
      workOrderTitle !== workOrder.title ||
      workOrderAssignedEmployeeEmail !== workOrder.employee?.email
    ) {
      await props.saveWorkOrder({
        title: workOrderTitle,
        employee_email: workOrderAssignedEmployeeEmail,
      });
    }

    if (workOrderStatus !== workOrder.appointment?.status) {
      await props.saveAppointment({
        status: workOrderStatus,
      });
    }

    setIsSaving(false);
    props.onHide();
  };

  const footer = () => {
    return (
      <div className={styles.workOrderMetadataDialogFooterContainer}>
        <Button
          className={`p-button-success greenButton ${styles.workOrderMetadataDialogFooterContainerButtons}`}
          icon="pi pi-save"
          label="Save"
          aria-label="Save"
          onClick={handleSave}
          disabled={isSaving}
          loading={isSaving}
          loadingIcon="pi pi-spin pi-spinner"
        />
        <Button
          className={`p-button-danger blueButton ${styles.workOrderMetadataDialogFooterContainerButtons}`}
          icon="pi pi-times"
          label="Cancel"
          aria-label="Cancel"
          onClick={props.onHide}
          disabled={isSaving}
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
      <div className={styles.workOrderMetadataDialogContainer}>
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

        <label htmlFor="workOrderStatus">Appointment Status</label>
        <br />
        <Dropdown
          id="workOrderStatus"
          name="status"
          options={Object.values(AppointmentStatus)}
          placeholder={workOrderStatus}
          value={workOrderStatus}
          onChange={(e) => setWorkOrderStatus(e.target.value)}
          className={styles.workOrderMetadataDialogStatusSelector}
        />
      </div>
    </Dialog>
  );
};

export default React.memo(WorkOrderMetadataDialog);
