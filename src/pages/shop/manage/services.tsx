import ServiceTypes from "@redux/types/serviceTypes";
import styles from "@styles/pages/services/Services.module.css";
import { NextPage } from "next";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Services: NextPage = () => {
  // const [services, setServices] = useState<IService[]>([]);
  const dispatch = useDispatch();

  const [globalFilter, setGlobalFilter] = useState(null);

  // const services = useSelector(ServiceSelectors.getServices);

  useEffect(() => {
    dispatch({ type: ServiceTypes.READ_SERVICES });
  }, [dispatch]);

  const services = [
    {
      id: "1",
      name: "oil change",
      description: "changes the engine oil",
      estimated_time: 5,
      total_price: "$100",
      parts: {
        quantity: 5,
        cost: 100,
        name: "nails",
        condition: "NEW",
        build: "OEM",
      },
      type: "CANNED",
      shop_id: "1",
    },
    {
      id: "2",
      name: "oil change for fancy car",
      description: "changes the engine oil",
      estimated_time: 5,
      total_price: "$200",
      parts: {
        quantity: 5,
        cost: 100,
        name: "nails",
        condition: "NEW",
        build: "OEM",
      },
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
      <h5 className="mx-0 my-1">Basic Services</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        {/* <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        /> */}
      </span>
    </div>
  );

  return (
    <div className={styles.serviceServicesContainer}>
      <DataTable
        value={services}
        paginator
        // className="p-datatable-customers"
        showGridlines
        rows={10}
        dataKey="id"
        // filters={filters}
        filterDisplay="menu"
        // loading={loading}
        responsiveLayout="scroll"
        globalFilterFields={[
          "name",
          "country.name",
          "representative.name",
          "balance",
          "status",
        ]}
        // header={header}
        emptyMessage="No customers found."
      >
        <Column
          field="serviceType"
          header="Service Type"
          //   filter
          //   filterPlaceholder="Search by name"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="description"
          header="Description"
          //   filter
          //   filterPlaceholder="Search by name"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="partType"
          header="Part Type"
          //   filter
          //   filterPlaceholder="Search by name"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="partCondition"
          header="Part Condition"
          //   filter
          //   filterPlaceholder="Search by name"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="duration"
          header="Duration"
          //   filter
          //   filterPlaceholder="Search by name"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="cost"
          header="Estimated Cost"
          //   filter
          //   filterPlaceholder="Search by name"
          style={{ minWidth: "12rem" }}
        />
      </DataTable>
    </div>
  );
};

export default Services;
