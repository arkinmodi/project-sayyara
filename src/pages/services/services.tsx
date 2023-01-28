import { AppointmentSelectors } from "@redux/selectors/appointmentSelectors";
import AppointmentTypes from "@redux/types/appointmentTypes";
import styles from "@styles/pages/appointments/Services.module.css";
import { NextPage } from "next";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IService } from "src/types/service";

const Services: NextPage = () => {
  const [services, setServices] = useState<IService[]>([]);
  const dispatch = useDispatch();

  const [globalFilter, setGlobalFilter] = useState(null);

  const appointments = useSelector(AppointmentSelectors.getAppointments);

  useEffect(() => {
    dispatch({ type: AppointmentTypes.READ_APPOINTMENTS });
  }, [dispatch]);

  //   useEffect(() => {
  //     const services = appointments;

  //     setServices(services);
  //   }, [services, setServices]);

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Basic Services</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  return (
    <div className={styles.appointmentServicesContainer}>
      <DataTable
        value={appointments}
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
