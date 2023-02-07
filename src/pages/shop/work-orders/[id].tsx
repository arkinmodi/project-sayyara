import WorkOrderEditor from "@components/workOrders/WorkOrderEditor";
import WorkOrderMetadataDialog from "@components/workOrders/WorkOrderMetadataDialog";
import { UserType } from "@prisma/client";
import {
  getWorkOrderByIdActionBuilder,
  patchWorkOrderByIdActionBuilder,
} from "@redux/actions/workOrderAction";
import { WorkOrderSelectors } from "@redux/selectors/workOrderSelector";
import { getServerAuthSession } from "@server/common/getServerAuthSession";
import styles from "@styles/pages/WorkOrders.module.css";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { TabPanel, TabView } from "primereact/tabview";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const WorkOrder: NextPage = () => {
  const router = useRouter();
  const workOrderError = useSelector(WorkOrderSelectors.getWorkOrderError);

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

  useEffect(() => {
    if (workOrderError) {
      showErrorToast(workOrderError.message);
    }
  }, [workOrderError]);

  return (
    <div>
      <TabView activeIndex={1} onTabChange={(e) => handleTabChange(e.index)}>
        <TabPanel header="Quotes"></TabPanel>
        <TabPanel header="Service Requests">
          <WorkOrderPage />
        </TabPanel>
      </TabView>
      <Toast ref={toastRef} position="top-right" />
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
      <WorkOrderMetadataDialog
        isVisible={isEditMetaDataDialogVisible}
        onHide={handleHideEditMetaDataDialog}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  if (session && session.user.type === UserType.CUSTOMER) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default WorkOrder;
