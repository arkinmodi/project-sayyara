import ServiceTypes from "@redux/types/serviceTypes";
import styles from "@styles/pages/services/Services.module.css";
import { NextPage } from "next";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { IParts } from "src/types/service";

const Services: NextPage = () => {
  // const [services, setServices] = useState<IService[]>([]);
  const dispatch = useDispatch();

  const [globalFilter, setGlobalFilter] = useState(null);

  // const services = useSelector(ServiceSelectors.getServices);

  useEffect(() => {
    dispatch({ type: ServiceTypes.READ_SERVICES });
    setLoading(false);
  }, [dispatch]);

  const [loading, setLoading] = useState(true);

  const toast = useRef(null);

  const services = [
    {
      id: "1",
      name: "oil change",
      description: "changes the engine oil",
      estimated_time: 5,
      total_price: "$100",
      parts: [
        {
          quantity: 5,
          cost: 100,
          name: "nails",
          condition: "NEW",
          build: "OEM",
        },
      ],
      type: "CANNED",
      shop_id: "1",
    },
    {
      id: "2",
      name: "oil change for fancy car",
      description: "changes the engine oil",
      estimated_time: 5,
      total_price: "$200",
      parts: [
        {
          quantity: 5,
          cost: 100,
          name: "nails",
          condition: "NEW",
          build: "OEM",
        },
      ],
      type: "CANNED",
      shop_id: "1",
    },
  ];

  //   useEffect(() => {
  //     const services = services;

  //     setServices(services);
  //   }, [services, setServices]);

  const header = (
    <div className="table-header">
      <h3 className="mx-0 my-1">Basic Services</h3>
    </div>
  );

  // const onRowExpand = (event) => {
  //   toast.current.show({
  //     severity: "info",
  //     summary: "Product Expanded",
  //     detail: event.data.name,
  //     life: 3000,
  //   });
  // };

  const rowExpansionTemplate = (parts: IParts[]) => {
    return (
      <div className="p-3">
        <h5>Parts</h5>
        <DataTable value={parts} responsiveLayout="scroll">
          <Column field="name" header="Name" sortable></Column>
          <Column field="quantity" header="Quantity" sortable></Column>
          <Column field="cost" header="Cost Per Unit" sortable></Column>
          <Column field="condition" header="Part Condition"></Column>
          <Column field="build" header="Part Type"></Column>
        </DataTable>
      </div>
    );
  };

  // const allowExpansion = (rowData) => {
  //   return rowData.orders.length > 0;
  // };

  return (
    <div className={styles.serviceServicesContainer}>
      {/* Basic Services Table */}
      <DataTable
        value={services}
        paginator
        // className="p-datatable-customers"
        showGridlines
        rows={10}
        dataKey="id"
        // filters={filters}
        filterDisplay="menu"
        loading={loading}
        responsiveLayout="scroll"
        globalFilterFields={["name"]}
        header={header}
        rowExpansionTemplate={rowExpansionTemplate}
        emptyMessage="No services found."
      >
        <Column
          field="name"
          header="Service Name"
          filter
          sortable
          filterPlaceholder="Search by service name"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="description"
          header="Description"
          style={{ minWidth: "12rem" }}
        />
        {/* <Column
          field="parts"
          header="Parts"
          // expander={allowExpansion}
          style={{ minWidth: "12rem" }}
        /> */}
        {/* <Column
          field="partCondition"
          header="Part Condition"
          //   filter
          //   filterPlaceholder="Search by name"
          style={{ minWidth: "12rem" }}
        /> */}
        <Column
          field="estimated_time"
          header="Duration"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="total_price"
          header="Estimated Cost"
          sortable
          style={{ minWidth: "12rem" }}
        />
      </DataTable>
    </div>
  );
};

export default Services;
