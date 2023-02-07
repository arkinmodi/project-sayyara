import styles from "@styles/pages/shop/ShopProfile.module.css";
import { Skeleton } from "primereact/skeleton";
import React from "react";

const ShopProfileSkeleton = () => {
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
