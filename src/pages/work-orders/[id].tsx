import {
  getWorkOrderByIdActionBuilder,
  patchWorkOrderByIdActionBuilder,
} from "@redux/actions/workOrderAction";
import { WorkOrderSelectors } from "@redux/selectors/workOrderSelector";
import styles from "@styles/pages/WorkOrders.module.css";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { TabPanel, TabView } from "primereact/tabview";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { WorkOrderStatus } from "src/types/workOrder";

const WorkOrder: NextPage = () => {
  const router = useRouter();

  const handleTabChange = (idx: number) => {
    if (idx !== 1) {
      router.push("/");
    }
  };

  return (
    <div>
      <TabView activeIndex={1} onTabChange={(e) => handleTabChange(e.index)}>
        <TabPanel header="Quotes"></TabPanel>
        <TabPanel header="Service Requests">
          <WorkOrderPage />
        </TabPanel>
      </TabView>
    </div>
  );
};

const WorkOrderPage: React.FC<{}> = () => {
  const router = useRouter();
  const { id } = router.query;

  const dispatch = useDispatch();
  const workOrder = useSelector(WorkOrderSelectors.getWorkOrder);

  const [workOrderBody, setWorkOrderBody] = useState<string | undefined>(
    workOrder?.body
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditMetaDataDialogVisible, setIsEditMetaDataDialogVisible] =
    useState<boolean>(false);

  useEffect(() => {
    if (typeof id === "string") {
      dispatch(getWorkOrderByIdActionBuilder(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (workOrder) {
      setWorkOrderBody(workOrder.body);
    }
  }, [workOrder]);

  useEffect(() => {
    window.addEventListener("resize", () =>
      setIsMobile(window.innerWidth <= 600)
    );
  });

  const handleSave = () => {
    if (typeof id === "string") {
      setIsSaving(true);
      dispatch(
        patchWorkOrderByIdActionBuilder(id, {
          body: workOrderBody,
        })
      );
      setIsSaving(false);
    }
  };

  const handleHideEditMetaDataDialog = () => {
    setIsEditMetaDataDialogVisible(!isEditMetaDataDialogVisible);
  };

  const formatDate = (date: Date) => {
    const pad = (n: number) => `${n}`.padStart(2, "0");

    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const year = pad(date.getFullYear());
    const hour = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${month}/${day}/${year} ${hour}:${minutes}:${seconds}`;
  };

  return (
    <div className={styles.workOrderPageContainer}>
      <Head>
        <title>
          {workOrder !== null ? `Work Order - ${workOrder.title}` : "Sayyara"}
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.workOrderTitleContainer}>
        {isMobile ? (
          <Button
            className="p-button-secondary p-button-text"
            icon="pi pi-angle-left"
            onClick={() => router.push("/")}
          />
        ) : (
          <Button
            className="p-button-secondary"
            icon="pi pi-angle-left"
            label="Back"
            aria-label="Back"
            onClick={() => router.push("/")}
          />
        )}
        <h1>{workOrder?.title ?? ""}</h1>
      </div>

      {workOrder && (
        <div>
          <div className={styles.workOrderMetadataContainer}>
            <p>
              <b>Status: </b>
              {workOrder.status}
            </p>
            <p>
              <b>Last Update: </b>
              {formatDate(new Date(workOrder.updateTime))}
            </p>
            <p>
              <b>Customer: </b>
              {`${workOrder.customer.first_name} ${workOrder.customer.last_name}`}
            </p>
            <p>
              <b>Customer Email: </b>
              {workOrder.customer.email}
            </p>
            <p>
              <b>Customer Phone Number: </b>
              {workOrder.customer.phone_number}
            </p>
            <p>
              <b>Vehicle: </b>
              {`${workOrder.vehicle.year} ${workOrder.vehicle.make} ${workOrder.vehicle.model}`}
            </p>
            <p>
              <b>Vehicle VIN: </b>
              {workOrder.vehicle.vin}
            </p>
            <p>
              <b>Assigned to: </b>
              {workOrder.employee
                ? `${workOrder.employee.firstName} ${workOrder.employee.lastName}`
                : "Unassigned"}
            </p>
          </div>
          <div className={styles.workOrderMetadataContainerEditButtonContainer}>
            <Button
              className={styles.workOrderMetadataContainerEditButton}
              label="Edit Metadata"
              aria-label="Edit Metadata"
              onClick={handleHideEditMetaDataDialog}
            />
          </div>
        </div>
      )}

      <WorkOrderEditor
        body={workOrderBody ?? ""}
        updateBody={setWorkOrderBody}
      />
      <div className={styles.workOrderSaveContainer}>
        <Button
          className={`p-button-success ${styles.workOrderSaveContainerSaveButton}`}
          icon="pi pi-save"
          label="Save"
          aria-label="Save"
          onClick={handleSave}
          disabled={isSaving}
          loading={isSaving}
          loadingIcon="pi pi-spin pi-sun"
        />

        {workOrder && (
          <p>Last Saved: {formatDate(new Date(workOrder.updateTime))}</p>
        )}
      </div>
      <MetadataDialog
        isVisible={isEditMetaDataDialogVisible}
        onHide={handleHideEditMetaDataDialog}
      />
    </div>
  );
};

const WorkOrderEditor: React.FC<{
  body: string;
  updateBody: (body: string) => void;
}> = (props) => {
  const { body, updateBody } = props;

  const editorToolbar = () => {
    return (
      <div>
        <span className="ql-formats">
          <select className="ql-header" defaultValue="0">
            <option value="1">Heading</option>
            <option value="2">Subheading</option>
            <option value="0">Normal</option>
          </select>
          <select className="ql-font">
            <option></option>
            <option value="serif"></option>
            <option value="monospace"></option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold" aria-label="Bold"></button>
          <button className="ql-italic" aria-label="Italic"></button>
          <button className="ql-underline" aria-label="Underline"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-color"></select>
          <select className="ql-background"></select>
        </span>
        <span className="ql-formats">
          <button
            type="button"
            className="ql-list"
            value="ordered"
            aria-label="Ordered List"
          ></button>
          <button
            type="button"
            className="ql-list"
            value="bullet"
            aria-label="Unordered List"
          ></button>
        </span>
        <span className="ql-formats">
          <button
            type="button"
            className="ql-clean"
            aria-label="Remove Styles"
          ></button>
        </span>
      </div>
    );
  };

  return (
    <Editor
      // Moving this to CSS file breaks it
      style={{ height: "50vh" }}
      value={body}
      onTextChange={(e) => updateBody(e.htmlValue ?? "")}
      headerTemplate={editorToolbar()}
    />
  );
};

const MetadataDialog: React.FC<{
  isVisible: boolean;
  onHide: () => void;
}> = (props) => {
  const { query } = useRouter();
  const { id } = query;

  const dispatch = useDispatch();
  const workOrder = useSelector(WorkOrderSelectors.getWorkOrder);

  const [workOrderStatus, setWorkOrderStatus] = useState<
    WorkOrderStatus | undefined
  >(workOrder?.status);
  const [workOrderTitle, setWorkOrderTitle] = useState<string | undefined>(
    workOrder?.title
  );
  const [workOrderAssignedEmployeeEmail, setWorkOrderAssignedEmployeeEmail] =
    useState<string | undefined>(workOrder?.employee?.email);

  useEffect(() => {
    if (workOrder) {
      setWorkOrderStatus(workOrder.status);
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
          status: workOrderStatus,
        })
      );
    }

    props.onHide();
  };

  const handleWorkOrderStatusUpdate = (status: string) => {
    if (status === "Pending") {
      setWorkOrderStatus(WorkOrderStatus.PENDING);
    } else if (status === "In Progress") {
      setWorkOrderStatus(WorkOrderStatus.IN_PROGRESS);
    } else if (status === "Completed") {
      setWorkOrderStatus(WorkOrderStatus.COMPLETED);
    }
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

        <label htmlFor="workOrderStatus">Status</label>
        <br />
        <Dropdown
          id="workOrderStatus"
          name="status"
          options={["Pending", "In Progress", "Completed"]}
          placeholder={workOrderStatus}
          value={workOrderStatus}
          onChange={(e) => handleWorkOrderStatusUpdate(e.target.value)}
          className={styles.workOrderMetadataDialogStatusSelector}
        />
      </div>
    </Dialog>
  );
};

export default WorkOrder;
