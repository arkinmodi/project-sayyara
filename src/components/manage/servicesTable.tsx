import { UserType } from "@prisma/client";
import { deleteService, setService } from "@redux/actions/serviceAction";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import { ShopSelectors } from "@redux/selectors/shopSelector";
import styles from "@styles/pages/services/Services.module.css";
import { Button } from "primereact/button";
import { Column, ColumnBodyOptions } from "primereact/column";
import {
  DataTable,
  DataTableExpandedRows,
  DataTableRowEditCompleteParams,
} from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IParts,
  IService,
  PartCondition,
  PartType,
  ServiceType,
} from "src/types/service";
import AddPartPopup from "./addPartPopup";
import AddServicePopup from "./addServicePopup";

interface IServiceProps {
  serviceType: ServiceType;
  services: IService[];
  isLoading: boolean;
}

const ServicesTable = (props: IServiceProps) => {
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | undefined
  >(undefined);
  const [addServiceDialogVisible, setAddServiceDialogVisible] = useState(false);
  const [addPartDialogVisible, setAddPartDialogVisible] = useState(false);
  const [serviceOnButtonClick, setServiceOnButtonClick] =
    useState<IService | null>(null);

  const { serviceType, services, isLoading } = props;
  const toast = useRef(null);
  const userType = useSelector(AuthSelectors.getUserType);

  const serviceList = useSelector(ShopSelectors.getShopServices);
  const dispatch = useDispatch();

  const hideAddServiceDialog = () => {
    setAddServiceDialogVisible(false);
  };

  const hideAddPartDialog = () => {
    setAddPartDialogVisible(false);
    setServiceOnButtonClick(null);
  };

  const serviceTableHeader = () => {
    return (
      <div className={styles.servicesTableHeader}>
        <h2 className="mx-0 my-1">
          {serviceType === ServiceType.CANNED
            ? "Basic Services"
            : "Custom Services"}
        </h2>
        <Button
          label={
            serviceType === ServiceType.CANNED
              ? "Add Basic Service"
              : "Add Custom Service"
          }
          icon="pi pi-plus"
          className={styles.addServiceButtonGreen}
          onClick={() => {
            setAddServiceDialogVisible(true);
          }}
        />
      </div>
    );
  };

  const rowExpansionTemplate = (serviceData: IService) => {
    const parts = serviceData.parts;
    return (
      <div className={styles.partsTable}>
        <div className={styles.servicesTableHeader}>
          <h2>Parts</h2>
          <Button
            label={"Add Part"}
            icon="pi pi-plus"
            className={styles.addServiceButtonGreen}
            onClick={() => {
              setServiceOnButtonClick(serviceData);
              setAddPartDialogVisible(true);
            }}
          />
        </div>
        {parts.length > 0 ? (
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
            <Column
              field="quantity"
              header="Quantity"
              editor={(options) => quantityEditor(options)}
              sortable
            ></Column>
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
              body={(data, props) => (
                <div>
                  <Button
                    icon="pi pi-trash"
                    className="p-button-text p-button-danger p-button-rounded"
                    onClick={() =>
                      handleDeletePartButton(data, props, serviceData)
                    }
                  />
                </div>
              )}
              className={styles.servicesTableDeleteButton}
            ></Column>
          </DataTable>
        ) : (
          <div></div>
        )}
      </div>
    );
  };

  const onPartsRowEditComplete = (
    params: DataTableRowEditCompleteParams,
    serviceData: IService
  ) => {
    let { newData, index } = params;

    let newParts = [...serviceData.parts];
    newParts[index] = newData;

    dispatch(
      setService({
        serviceId: serviceData.id,
        patch: {
          parts: newParts,
        },
      })
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

  const textEditor = (options: any) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  const quantityEditor = (options: any) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e: { value: any }) => options.editorCallback(e.value)}
      />
    );
  };

  const onServiceRowEditComplete = (e: any) => {
    let { newData } = e;
    dispatch(
      setService({
        serviceId: newData.id,
        patch: {
          name: newData.name,
          description: newData.description,
          estimated_time: newData.estimated_time,
          total_price: newData.total_price,
          parts: newData.parts,
        },
      })
    );
  };

  const deleteButton = (service: IService) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-trash"
          className="p-button-text p-button-danger p-button-rounded"
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

  const handleDeletePartButton = (
    parts: IParts,
    props: ColumnBodyOptions,
    serviceData: IService
  ) => {
    let newParts = [...serviceData.parts];
    newParts.splice(props.rowIndex, 1);
    dispatch(
      setService({ serviceId: serviceData.id, patch: { parts: newParts } })
    );
  };

  return (
    <div className={styles.serviceServicesContainer}>
      <Toast ref={toast} />
      <DataTable
        value={services}
        paginator
        showGridlines
        stripedRows
        rows={10}
        dataKey="id"
        size="small"
        filterDisplay="menu"
        loading={isLoading}
        responsiveLayout="scroll"
        globalFilterFields={["name"]}
        header={serviceTableHeader}
        rowExpansionTemplate={(data) => rowExpansionTemplate(data)}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
        emptyMessage="No services found."
        editMode="row"
        onRowEditComplete={onServiceRowEditComplete}
      >
        <Column
          expander={true}
          style={{
            display: serviceType === ServiceType.CANNED ? "table-cell" : "none",
          }}
        />
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
          editor={(options) => quantityEditor(options)}
          style={{
            display: serviceType === ServiceType.CANNED ? "table-cell" : "none",
          }}
        />
        <Column
          field="total_price"
          header="Estimated Cost"
          editor={(options) => priceEditor(options)}
          sortable
          style={{
            display: serviceType === ServiceType.CANNED ? "table-cell" : "none",
          }}
        />
        <Column
          rowEditor
          headerStyle={{ minWidth: "4rem" }}
          bodyStyle={{ textAlign: "center" }}
          style={{
            display: userType === UserType.SHOP_OWNER ? "table-cell" : "none",
          }}
        ></Column>
        <Column
          body={deleteButton}
          className={styles.servicesTableDeleteButton}
          style={{
            display: userType === UserType.SHOP_OWNER ? "table-cell" : "none",
          }}
        ></Column>
      </DataTable>
      <AddServicePopup
        serviceType={serviceType}
        visible={addServiceDialogVisible}
        onHideDialog={hideAddServiceDialog}
      />
      {serviceOnButtonClick != null ? (
        <AddPartPopup
          visible={addPartDialogVisible}
          onHideDialog={hideAddPartDialog}
          service={serviceOnButtonClick}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default React.memo(ServicesTable);
