import { deleteService, setService } from "@redux/actions/serviceAction";
import { readShopServices } from "@redux/actions/shopActions";
import { ShopSelectors } from "@redux/selectors/shopSelector";
import styles from "@styles/pages/services/Services.module.css";
import { NextPage } from "next";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTableExpandedRows,
  DataTableRowEditCompleteParams,
} from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IService,
  PartCondition,
  PartType,
  ServiceType,
} from "src/types/service";

const Services: NextPage = () => {
  const [services, setServices] = useState<IService[]>([]);
  const dispatch = useDispatch();

  const serviceList = useSelector(ShopSelectors.getShopServices);

  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | undefined
  >(undefined);

  useEffect(() => {
    dispatch(readShopServices());
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (serviceList) {
      setServices(serviceList);
    }
  }, [serviceList]);

  const [loading, setLoading] = useState(true);

  const toast = useRef(null);

  const servicesData: IService[] = [
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
          condition: PartCondition.NEW,
          build: PartType.OEM,
        },
      ],
      type: ServiceType.CANNED,
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
          condition: PartCondition.NEW,
          build: PartType.OEM,
        },
        {
          quantity: 5,
          cost: 100,
          name: "nails2",
          condition: PartCondition.NEW,
          build: PartType.OEM,
        },
      ],
      type: ServiceType.CANNED,
      shop_id: "1",
    },
  ];

  const basicServicesHeader = (
    <div className="table-header">
      <h3 className="mx-0 my-1">Basic Services</h3>
    </div>
  );

  const customServicesHeader = (
    <div className="table-header">
      <h3 className="mx-0 my-1">Custom Services</h3>
    </div>
  );

  const rowExpansionTemplate = (serviceData: IService) => {
    const parts = serviceData.parts;
    return (
      <div className={styles.partsTable}>
        <h2>Parts</h2>
        <DataTable
          value={parts}
          responsiveLayout="scroll"
          paginator
          showGridlines
          stripedRows
          rows={5}
          size="small"
          dataKey="name"
          editMode="row"
          onRowEditComplete={(params) => {
            onPartsRowEditComplete(params, serviceData);
          }}
        >
          <Column
            field="name"
            header="Name"
            editor={(options) => textEditor(options)}
            sortable
          ></Column>
          <Column field="quantity" header="Quantity" sortable></Column>
          <Column
            field="cost"
            header="Cost Per Unit"
            editor={(options) => priceEditor(options)}
            sortable
          ></Column>
          <Column
            field="condition"
            header="Condition"
            editor={(options) => partsConditionEditor(options)}
          ></Column>
          <Column
            field="build"
            header="Type"
            editor={(options) => partsTypeEditor(options)}
          ></Column>
          <Column
            rowEditor
            headerStyle={{ width: "10%", minWidth: "4rem" }}
            bodyStyle={{ textAlign: "center" }}
          ></Column>
          <Column
            body={deleteButton}
            style={{ minWidth: "4rem", textAlign: "center" }}
          ></Column>
        </DataTable>
      </div>
    );
  };

  const onPartsRowEditComplete = (
    params: DataTableRowEditCompleteParams,
    serviceData: IService
  ) => {
    let { newData, index } = params;

    serviceData.parts[index] = newData;

    dispatch(setService({ serviceId: serviceData.id, patch: serviceData }));
  };

  const textEditor = (options: any) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const parts_condition = [
    { label: "NEW", value: PartCondition.NEW },
    { label: "USED", value: PartCondition.USED },
  ];

  const partsConditionEditor = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        options={parts_condition}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a condition"
        itemTemplate={(option) => {
          return (
            <span
              className={`product-badge status-${option.value.toLowerCase()}`}
            >
              {option.label}
            </span>
          );
        }}
      />
    );
  };

  const parts_type = [
    { label: "OEM", value: PartType.OEM },
    { label: "AFTERMARKET", value: PartType.AFTER_MARKET },
  ];

  const partsTypeEditor = (options: any) => {
    return (
      <Dropdown
        value={options.value}
        options={parts_type}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Select a type"
        itemTemplate={(option) => {
          return (
            <span
              className={`product-badge status-${option.value.toLowerCase()}`}
            >
              {option.label}
            </span>
          );
        }}
      />
    );
  };

  const priceEditor = (options: any) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e: { value: any }) => options.editorCallback(e.value)}
        mode="currency"
        currency="CAD"
        locale="en-US"
      />
    );
  };

  const allowExpansion = (service: IService) => {
    return service.parts.length > 0;
  };

  const onServiceRowEditComplete = (e: any) => {
    let { newData, index } = e;
    if (services.length > index) {
      dispatch(setService({ serviceId: services[index]!.id, patch: newData }));
    }
  };

  const deleteButton = (service: IService) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-text p-button-danger p-button-rounded"
          // call the delete saga pass in the id
          onClick={() => handleDeleteServiceButton(service)}
        />
      </React.Fragment>
    );
  };

  const handleDeleteServiceButton = (service: IService) => {
    deleteServiceEvent(service.id);
  };

  const deleteServiceEvent = (serviceId: string) => {
    dispatch(deleteService({ serviceId: serviceId }));
  };

  return (
    <div className={styles.serviceServicesContainer}>
      <Toast ref={toast} />
      <DataTable
        value={servicesData}
        paginator
        showGridlines
        stripedRows
        rows={10}
        dataKey="id"
        size="small"
        filterDisplay="menu"
        loading={loading}
        responsiveLayout="scroll"
        globalFilterFields={["name"]}
        header={basicServicesHeader}
        rowExpansionTemplate={(data) => rowExpansionTemplate(data)}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
        emptyMessage="No services found."
        editMode="row"
        onRowEditComplete={onServiceRowEditComplete}
      >
        <Column expander={allowExpansion} style={{ width: "3em" }} />
        <Column
          field="name"
          header="Service Name"
          filter
          sortable
          filterPlaceholder="Search"
          style={{ minWidth: "4rem" }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="description"
          header="Description"
          style={{ minWidth: "8rem" }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="estimated_time"
          header="Duration"
          style={{ minWidth: "4rem" }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="total_price"
          header="Estimated Cost"
          editor={(options) => priceEditor(options)}
          sortable
          style={{ minWidth: "4rem" }}
        />
        <Column
          rowEditor
          headerStyle={{ minWidth: "4rem" }}
          bodyStyle={{ textAlign: "center" }}
        ></Column>
        <Column
          body={deleteButton}
          style={{ minWidth: "4rem", textAlign: "center" }}
        ></Column>
      </DataTable>
    </div>
  );
};

export default Services;
