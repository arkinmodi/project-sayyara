import { patchWorkOrderByIdActionBuilder } from "@redux/actions/workOrderAction";
import { WorkOrderSelectors } from "@redux/selectors/workOrderSelector";
import styles from "@styles/components/workOrders/WorkOrderMetadataDialog.module.css";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const WorkOrderMetadataDialog: React.FC<{
  isVisible: boolean;
  onHide: () => void;
}> = (props) => {
  const { query } = useRouter();
  const { id } = query;

  const dispatch = useDispatch();
  const workOrder = useSelector(WorkOrderSelectors.getWorkOrder);

  const [workOrderTitle, setWorkOrderTitle] = useState<string | undefined>(
    workOrder?.title
  );
  const [workOrderAssignedEmployeeEmail, setWorkOrderAssignedEmployeeEmail] =
    useState<string | undefined>(workOrder?.employee?.email);

  useEffect(() => {
    if (workOrder) {
      setWorkOrderTitle(workOrder.title);
      if (workOrder.employee) {
        setWorkOrderAssignedEmployeeEmail(workOrder.employee.email);
      }
    }
  }, [workOrder]);

  const handleSave = () => {
    if (typeof id === "string") {
      dispatch(
        patchWorkOrderByIdActionBuilder(id, {
          title: workOrderTitle,
          employee_email: workOrderAssignedEmployeeEmail,
        })
      );
    }

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
