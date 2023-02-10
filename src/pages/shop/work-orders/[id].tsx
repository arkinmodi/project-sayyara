import WorkOrderEditor from "@components/workOrders/WorkOrderEditor";
import WorkOrderMetadataDialog from "@components/workOrders/WorkOrderMetadataDialog";
import { UserType } from "@prisma/client";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/pages/WorkOrders.module.css";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IWorkOrder } from "src/types/workOrder";
import {
  getWorkOrderById,
  patchWorkOrderById,
  PatchWorkOrderByIdBody,
} from "src/utils/workOrderUtil";

const WorkOrder: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [workOrder, setWorkOrder] = useState<IWorkOrder | undefined>(undefined);

  const toastRef = useRef<Toast>(null);

  const handleTabChange = (idx: number) => {
    if (idx !== 1) {
      router.push("/shop/dashboard");
    }
  };

  const showErrorToast = (msg: string) => {
    if (toastRef.current) {
      toastRef.current.show({
        sticky: true,
        severity: "error",
        summary: "Error",
        detail: msg,
      });
    }
  };

  const updateWorkOrder = async (patch: PatchWorkOrderByIdBody) => {
    if (typeof id === "string") {
      await patchWorkOrderById(id, patch).then((res) => {
        if (res.success) {
          setWorkOrder(res.data);
        } else {
          showErrorToast(res.data.message);
        }
      });
    } else {
      showErrorToast("Invalid Work Order ID.");
    }
  };

  useEffect(() => {
    if (typeof id === "string") {
      getWorkOrderById(id).then((res) => {
        if (res.success) {
          setWorkOrder(res.data);
        } else {
          showErrorToast(res.data.message);
        }
      });
    }
  }, [id]);

  return (
    <div>
      <TabView activeIndex={1} onTabChange={(e) => handleTabChange(e.index)}>
        <TabPanel header="Quotes"></TabPanel>
        <TabPanel header="Service Requests">
          {workOrder === undefined ? (
            // TODO: Create skeleton
            <></>
          ) : (
            <WorkOrderPage
              workOrder={workOrder}
              saveWorkOrder={updateWorkOrder}
            />
          )}
        </TabPanel>
      </TabView>
      <Toast ref={toastRef} position="top-right" />
    </div>
  );
};

const WorkOrderPage: React.FC<{
  workOrder: IWorkOrder;
  saveWorkOrder: (patch: PatchWorkOrderByIdBody) => Promise<void>;
}> = (props) => {
  const { workOrder } = props;

  const router = useRouter();

  const userType = useSelector(AuthSelectors.getUserType);

  const [workOrderBody, setWorkOrderBody] = useState<string>(workOrder.body);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditMetaDataDialogVisible, setIsEditMetaDataDialogVisible] =
    useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("resize", () =>
      setIsMobile(window.innerWidth <= 600)
    );
  });

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

  const handleSave = async () => {
    setIsSaving(true);
    await props.saveWorkOrder({ body: workOrderBody });
    setIsSaving(false);
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
            className="p-button-secondary blueButton"
            icon="pi pi-angle-left"
            label="Back"
            aria-label="Back"
            onClick={() => router.push("/")}
          />
        )}
        <h1>{workOrder.title}</h1>
      </div>

      {workOrder && (
        <div>
          <div className={styles.workOrderMetadataContainer}>
            <p>
              <b>Status: </b>
              {workOrder.appointment?.status}
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
              <b>Appointment Time: </b>
              {`${
                workOrder.appointment?.startTime === undefined
                  ? "Unknown Start Time"
                  : formatDate(new Date(workOrder.appointment?.startTime))
              } to ${
                workOrder.appointment?.endTime === undefined
                  ? "Unknown End Time"
                  : formatDate(new Date(workOrder.appointment?.endTime))
              }`}
            </p>
            <p>
              <b>Assigned to: </b>
              {workOrder.employee
                ? `${workOrder.employee.firstName} ${workOrder.employee.lastName}`
                : "Unassigned"}
            </p>
          </div>
          {userType === UserType.CUSTOMER ? (
            <></>
          ) : (
            <div
              className={styles.workOrderMetadataContainerEditButtonContainer}
            >
              <Button
                className={`${styles.workOrderMetadataContainerEditButton} blueButton`}
                label="Edit Metadata"
                aria-label="Edit Metadata"
                onClick={handleHideEditMetaDataDialog}
              />
            </div>
          )}
        </div>
      )}

      <WorkOrderEditor
        body={workOrderBody ?? ""}
        updateBody={setWorkOrderBody}
      />
      {userType === UserType.CUSTOMER ? (
        <></>
      ) : (
        <div className={styles.workOrderSaveContainer}>
          <Button
            className={`p-button-success greenButton ${styles.workOrderSaveContainerSaveButton}`}
            icon="pi pi-save"
            label="Save"
            aria-label="Save"
            onClick={handleSave}
            disabled={isSaving}
            loading={isSaving}
            loadingIcon="pi pi-spin pi-spinner"
          />

          {workOrder && (
            <p>Last Saved: {formatDate(new Date(workOrder.updateTime))}</p>
          )}
        </div>
      )}
      <WorkOrderMetadataDialog
        isVisible={isEditMetaDataDialogVisible}
        onHide={handleHideEditMetaDataDialog}
        workOrder={workOrder}
        saveWorkOrder={props.saveWorkOrder}
      />
    </div>
  );
};

export default WorkOrder;
