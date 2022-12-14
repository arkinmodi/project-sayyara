import type { NextPage } from "next";
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { ScrollPanel } from "primereact/scrollpanel";
import { useEffect, useState } from "react";

const workOrders = [
  {
    id: (Math.random() + 1).toString(36).substring(7),
    title: "Work Order 1",
    createTime: new Date("2022-11-09T04:00:00.000Z"),
    updateTime: new Date("2023-11-09T04:00:00.000Z"),
    customerName: "Customer Name",
    customerEmail: "customer@example.com",
    vehicleMake: "Ford",
    vehicleModel: "F150",
    vehicleYear: "2022",
    employeeName: "Employee Name",
    body: "idk some text",
  },
  {
    id: (Math.random() + 1).toString(36).substring(7),
    title: "Work Order 2",
    createTime: new Date("2022-11-09T04:00:00.000Z"),
    updateTime: new Date("2023-11-09T04:00:00.000Z"),
    customerName: "Customer Name",
    customerEmail: "customer@example.com",
    vehicleMake: "Ford",
    vehicleModel: "F150",
    vehicleYear: "2022",
    employeeName: "Employee Name",
    body: "idk some text 2",
  },
];

type WorkOrderType = typeof workOrders[0];

const formatDate = (date: Date) => {
  const pad = (n: number) => `${n}`.padStart(2, "0");

  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const year = pad(date.getFullYear());
  const hour = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${month}/${day}/${year} ${hour}:${minutes}`;
};

const WorkOrders: NextPage = () => {
  const [activeWorkOrder, setActiveWorkOrder] = useState<
    WorkOrderType | undefined
  >();

  const updateWorkOrderBody = async (body: string) => {
    setActiveWorkOrder((order) => {
      if (order) return { ...order, body };
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  // const allWorkOrders = useSelector(WorkOrderSelectors.getAllWorkOrders);
  // const activeWorkOrder2 = useSelector(WorkOrderSelectors.getActiveWorkOrder);

  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch({ type: "WORK_ORDERS_BY_SHOP_ID", payload: { shopId: "12345" } });
  // }, [dispatch]);

  // console.log(allWorkOrders, activeWorkOrder2);

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <WorkOrderLeftNav
        workOrders={workOrders}
        setActiveWorkOrder={setActiveWorkOrder}
      />
      {activeWorkOrder && (
        <WorkOrderEditor
          workOrder={activeWorkOrder}
          updateWorkOrder={updateWorkOrderBody}
        />
      )}
    </div>
  );
};

const WorkOrderLeftNav: React.FC<{
  workOrders: WorkOrderType[];
  setActiveWorkOrder: (order: WorkOrderType) => void;
}> = (props) => {
  const [search, setSearch] = useState("");
  const [displayWorkOrders, setDisplayWorkOrders] = useState(props.workOrders);

  const handleSearch = (query: string) => {
    setSearch(query);
    setDisplayWorkOrders(
      props.workOrders.filter((order) =>
        order.title.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <div style={{ width: "20vw", margin: "1rem" }}>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          style={{ width: "20vw" }}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search"
        />
      </span>
      <ScrollPanel style={{ width: "100%", height: "90vh" }}>
        {displayWorkOrders.map((order) => (
          <div key={order.id} onClick={() => props.setActiveWorkOrder(order)}>
            <h1>{order.title}</h1>
            <p>
              <i>Last Updated: {formatDate(order.updateTime)}</i>
            </p>
            <p>
              {order.customerName} {"<"}
              {order.customerEmail}
              {">"}
            </p>
          </div>
        ))}
      </ScrollPanel>
    </div>
  );
};

const WorkOrderEditor: React.FC<{
  workOrder: WorkOrderType;
  updateWorkOrder: (body: string) => void;
}> = (props) => {
  const { workOrder } = props;

  const [workOrderBody, setWorkOrderBody] = useState(
    workOrder ? workOrder.body : ""
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(
    () => setWorkOrderBody(workOrder ? workOrder.body : ""),
    [workOrder]
  );

  if (!workOrder) return <ProgressSpinner />;

  const updateDate = formatDate(workOrder.updateTime);

  const handleSave = async () => {
    setIsSaving((v) => !v);
    await props.updateWorkOrder(workOrderBody);
    setIsSaving((v) => !v);
  };

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        margin: "1rem",
      }}
    >
      <h1 style={{ margin: 0 }}>{workOrder.title}</h1>
      <p>
        <i>Last Updated On: {updateDate}</i>
      </p>
      <p>
        <b>Customer: </b>
        {workOrder.customerName} {"<"}
        {workOrder.customerEmail}
        {">"}
      </p>
      <p>
        <b>Vehicle: </b>
        {workOrder.vehicleYear} {workOrder.vehicleMake} {workOrder.vehicleModel}
      </p>
      <p>
        <b>Assigned Employee: </b>
        {workOrder.employeeName}
      </p>

      <Button
        className="p-button-success"
        label="Save"
        aria-label="Save"
        onClick={handleSave}
      />

      <Editor
        style={{ height: "40vh" }}
        value={workOrderBody}
        onTextChange={(e) => setWorkOrderBody(e.htmlValue ?? "")}
        headerTemplate={editorToolbar()}
      />

      <p style={{ alignSelf: "flex-end" }}>
        <i>{isSaving ? "saving..." : "saved"}</i>
      </p>
    </div>
  );
};

export default WorkOrders;
