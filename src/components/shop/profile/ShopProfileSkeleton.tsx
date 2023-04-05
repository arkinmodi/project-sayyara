import styles from "@styles/pages/shop/ShopProfile.module.css";
import { Skeleton } from "primereact/skeleton";
import React from "react";

/**
 * Renders the skeleton for the shop profile
 *
 * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
 * @date 02/07/2023
 * @returns A react component for the skeleton of the shop profile
 */
const ShopProfileSkeleton = () => {
  /**
   * Renders the skeleton for the shop profile header
   *
   * @author Leon So <34189743+LeonSo7@users.noreply.github.com>
   * @date 02/07/2023
   * @returns A react component for the skeleton of the shop profile header
   */
  const renderShopHeaderSkeleton = () => {
    return (
      <div className={styles.shopProfileHeader}>
        <div className={styles.shopProfilePicture}>
          <Skeleton shape="circle" size="150px" />
        </div>
        <div className={styles.shopProfileHeaderContentContainer}>
          <div className={styles.shopProfileHeaderTextContainer}>
            <div className={styles.shopProfileHeaderText}>
              <Skeleton width="300px" height="50px" />
            </div>
            <div className={styles.shopProfileSubHeaderText}>
              <Skeleton width="200px" height="20px" />
            </div>
            <br></br>
            <span className={styles.shopContactInfoSkeleton}>
              <i className="pi pi-phone"></i>
              <Skeleton
                width="150px"
                className={styles.contactInfoTextSkeleton}
              />
            </span>
            <div className={styles.shopContactInfoSkeleton}>
              <i className="pi pi-envelope"></i>
              <Skeleton
                width="150px"
                className={styles.contactInfoTextSkeleton}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderShopHeaderSkeleton()}
      <div className={styles.shopProfileContentSkeletonContainer}>
        <Skeleton
          shape="circle"
          width="100%"
          height="150px"
          className={styles.shopProfileContentSkeleton}
        />
        <Skeleton
          shape="circle"
          width="100%"
          height="150px"
          className={styles.shopProfileContentSkeleton}
        />
        <Skeleton
          shape="circle"
          width="100%"
          height="150px"
          className={styles.shopProfileContentSkeleton}
        />
      </div>
    </div>
  );
};

export default React.memo(ShopProfileSkeleton);
