import styles from "@styles/pages/WorkOrders.module.css";
import { Skeleton } from "primereact/skeleton";
import React from "react";

/**
 * A skeleton for work orders to be loaded when data has not been retrieved
 *
 * @author Arkin Modi <16737086+arkinmodi@users.noreply.github.com>
 * @date 02/28/2023
 * @returns A work order skeleton component
 */
const WorkOrderSkeleton = () => {
  return (
    <div className={styles.workOrderPageContainer}>
      <div className={styles.workOrderTitleContainer}>
        <Skeleton height="3rem" />
      </div>
      <br />
      <div>
        <div className={styles.workOrderMetadataContainer}>
          <Skeleton height="1rem" />
          <br />
          <Skeleton height="1rem" />
          <br />
          <Skeleton height="1rem" />
          <br />
          <Skeleton height="1rem" />
        </div>
      </div>
      <br />
      <Skeleton height="50vh" />
    </div>
  );
};
export default React.memo(WorkOrderSkeleton);
