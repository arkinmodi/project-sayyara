import {
  getWorkOrderByIdActionBuilder,
  patchWorkOrderByIdActionBuilder,
} from "@redux/actions/workOrderAction";
import { WorkOrderSelectors } from "@redux/selectors/workOrderSelector";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import { TabPanel, TabView } from "primereact/tabview";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

const WorkOrderPage = () => {
  const { query } = useRouter();
  const { id } = query;

  const dispatch = useDispatch();
  const workOrder = useSelector(WorkOrderSelectors.getWorkOrder);

  const [workOrderBody, setWorkOrderBody] = useState(workOrder?.body);
  const [isSaving, setIsSaving] = useState(false);

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
    <div style={{ marginLeft: "1rem", marginRight: "1rem" }}>
      <Head>
        <title>{workOrder?.title ?? "Sayyara"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Link href="/">
          <Button
            className="p-button-secondary"
            icon="pi pi-angle-left"
            label="Back"
            aria-label="Back"
            style={{
              maxHeight: "3rem",
            }}
          />
        </Link>
        <h1 style={{}}>{workOrder?.title ?? ""}</h1>
      </div>

      {workOrder && (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <p>
              <b>Status: </b>
              {workOrder.status}
            </p>
            <p>
              <b>Last Update: </b>
              {formatDate(new Date(workOrder.update_time))}
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
          <div
            style={{
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button label="Edit Metadata" aria-label="Edit Metadata" />
          </div>
        </div>
      )}

      <WorkOrderEditor
        body={workOrderBody ?? ""}
        updateBody={setWorkOrderBody}
      />
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <Button
          className="p-button-success"
          icon="pi pi-save"
          label="Save"
          aria-label="Save"
          onClick={handleSave}
          disabled={isSaving}
          style={{
            width: "10rem",
          }}
        />

        {workOrder && (
          <p>Last Saved: {formatDate(new Date(workOrder.update_time))}</p>
        )}
      </div>
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
      style={{ height: "50vh" }}
      value={body}
      onTextChange={(e) => updateBody(e.htmlValue ?? "")}
      headerTemplate={editorToolbar()}
    />
  );
};

export default WorkOrder;
