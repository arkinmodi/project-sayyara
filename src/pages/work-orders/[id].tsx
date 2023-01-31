import { getWorkOrderByIdActionBuilder } from "@redux/actions/workOrderAction";
import { WorkOrderSelectors } from "@redux/selectors/workOrderSelector";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const WorkOrder: NextPage = () => {
  const { query, isReady } = useRouter();
  const { id } = query;

  const dispatch = useDispatch();
  const workOrder = useSelector(WorkOrderSelectors.getWorkOrder);

  useEffect(() => {
    if (typeof id === "string") {
      dispatch(getWorkOrderByIdActionBuilder(id));
    }
  }, [dispatch, id]);

  return (
    <div>
      <h1>Hello World</h1>
      <h2>{id}</h2>
      <p>{JSON.stringify(workOrder)}</p>

      <Link href="/">
        <Button
          className="p-button-secondary"
          icon="pi pi-angle-left"
          label="Back"
          aria-label="Back"
        />
      </Link>

      <WorkOrderEditor />
    </div>
  );
};

const WorkOrderEditor: React.FC<{}> = (props) => {
  const workOrder = useSelector(WorkOrderSelectors.getWorkOrder);
  const [workOrderBody, setWorkOrderBody] = useState(workOrder?.body);

  useEffect(() => {
    if (workOrder) {
      setWorkOrderBody(workOrder.body);
    }
  }, [workOrder]);

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
      style={{ height: "40vh" }}
      value={workOrderBody}
      onTextChange={(e) => setWorkOrderBody(e.htmlValue ?? "")}
      headerTemplate={editorToolbar()}
    />
  );
};

export default WorkOrder;
