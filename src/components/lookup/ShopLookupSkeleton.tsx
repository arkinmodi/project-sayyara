import styles from "@styles/Home.module.css";
import classNames from "classnames";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Panel } from "primereact/panel";
import { Skeleton } from "primereact/skeleton";
import React from "react";

/**
 * The shop lookup skeleton, rendered when the page is waiting for data from the database
 *
 * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
 * @date 03/18/2023
 * @returns A react component of the shop lookup skeleton
 */
const ShopLookupSkeleton = () => {
  const rows = Array.from({ length: 6 });

  /**
   * Template for a skeleton of a shop in the shop lookup
   *
   * @author Timothy Choy <32019738+TimChoy@users.noreply.github.com>
   * @date 03/18/2023
   * @returns React component of a shop skeleton
   */
  const bodyTemplate = () => {
    return (
      <div className={styles.bodySkeleton}>
        <Skeleton
          className={styles.bodyIconSkeleton}
          shape="circle"
          size="4rem"
          borderRadius="100px"
        />
        <Skeleton width="80%" height="2.5rem" />
      </div>
    );
  };

  return (
    <div className={styles.main}>
      <div className={styles.filter}>
        <Panel className={styles.desktopFilter} header=" ">
          <Skeleton
            className={styles.filterTitleSkeleton}
            width="60%"
            height="2rem"
          />
          <div className={styles.filterBodySkeleton}>
            <Skeleton
              className={styles.filterIconSkeleton}
              shape="circle"
              size="1.5rem"
              borderRadius="100px"
            />
            <Skeleton width="80%" height="1.5rem" />
          </div>
          <div className={styles.filterBodySkeleton}>
            <Skeleton
              className={styles.filterIconSkeleton}
              shape="circle"
              size="1.5rem"
              borderRadius="100px"
            />
            <Skeleton width="80%" height="1.5rem" />
          </div>
          <div
            className={classNames(
              styles.filterBodyLastSkeleton,
              styles.filterBodySkeleton
            )}
          >
            <Skeleton
              className={styles.filterIconSkeleton}
              shape="circle"
              size="1.5rem"
              borderRadius="100px"
            />
            <Skeleton width="80%" height="1.5rem" />
          </div>
          <Skeleton
            className={styles.filterTitleSkeleton}
            width="60%"
            height="2rem"
          />
          <div className={styles.filterBodySkeleton}>
            <Skeleton
              className={styles.filterIconSkeleton}
              shape="circle"
              size="1.5rem"
              borderRadius="100px"
            />
            <Skeleton width="80%" height="1.5rem" />
          </div>
          <div className={styles.filterBodySkeleton}>
            <Skeleton
              className={styles.filterIconSkeleton}
              shape="circle"
              size="1.5rem"
              borderRadius="100px"
            />
            <Skeleton width="80%" height="1.5rem" />
          </div>
          <div
            className={classNames(
              styles.filterBodyLastSkeleton,
              styles.filterBodySkeleton
            )}
          >
            <Skeleton
              className={styles.filterIconSkeleton}
              shape="circle"
              size="1.5rem"
              borderRadius="100px"
            />
            <Skeleton width="80%" height="1.5rem" />
          </div>
          <Skeleton width="100%" height="1.5rem" />
        </Panel>
        <Panel className={styles.mobileFilter} toggleable collapsed header=" ">
          <Skeleton
            className={styles.filterTitleSkeleton}
            width="60%"
            height="2rem"
          />
          <div className={styles.filterBodySkeleton}>
            <Skeleton
              className={styles.filterIconSkeleton}
              shape="circle"
              size="1.5rem"
              borderRadius="100px"
            />
            <Skeleton width="80%" height="1.5rem" />
          </div>
          <div className={styles.filterBodySkeleton}>
            <Skeleton
              className={styles.filterIconSkeleton}
              shape="circle"
              size="1.5rem"
              borderRadius="100px"
            />
            <Skeleton width="80%" height="1.5rem" />
          </div>
          <div
            className={classNames(
              styles.filterBodyLastSkeleton,
              styles.filterBodySkeleton
            )}
          >
            <Skeleton
              className={styles.filterIconSkeleton}
              shape="circle"
              size="1.5rem"
              borderRadius="100px"
            />
            <Skeleton width="80%" height="1.5rem" />
          </div>
          <Skeleton
            className={styles.filterTitleSkeleton}
            width="60%"
            height="2rem"
          />
          <div className={styles.filterBodySkeleton}>
            <Skeleton
              className={styles.filterIconSkeleton}
              shape="circle"
              size="1.5rem"
              borderRadius="100px"
            />
            <Skeleton width="80%" height="1.5rem" />
          </div>
          <div className={styles.filterBodySkeleton}>
            <Skeleton
              className={styles.filterIconSkeleton}
              shape="circle"
              size="1.5rem"
              borderRadius="100px"
            />
            <Skeleton width="80%" height="1.5rem" />
          </div>
          <div
            className={classNames(
              styles.filterBodyLastSkeleton,
              styles.filterBodySkeleton
            )}
          >
            <Skeleton
              className={styles.filterIconSkeleton}
              shape="circle"
              size="1.5rem"
              borderRadius="100px"
            />
            <Skeleton width="80%" height="1.5rem" />
          </div>
          <Skeleton width="100%" height="1.5rem" />
        </Panel>
      </div>
      <div className={styles.content}>
        <Skeleton width="100%" height="3rem" borderRadius="12px" />
        <div>
          <DataTable value={rows}>
            <Column
              body={bodyTemplate}
              className={styles.columnSkeleton}
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ShopLookupSkeleton);
