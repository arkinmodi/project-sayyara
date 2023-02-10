import { ServiceType, UserType } from "@prisma/client";
import { AuthSelectors } from "@redux/selectors/authSelectors";
import styles from "@styles/pages/shop/ShopProfile.module.css";
import classNames from "classnames";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Fieldset } from "primereact/fieldset";
import defaultProfilePicture from "public/icons/icon-maskable-1024x1024.png";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddHoursOfOperationDialog from "src/components/shop/profile/AddHoursOfOperationDialog";
import ShopProfileSkeleton from "src/components/shop/profile/ShopProfileSkeleton";
import { IService } from "src/types/service";
import {
  IShop,
  IShopHoursOfOperation,
  IShopOperatingDay,
} from "src/types/shop";
import { getServicesByShopId, getShopId } from "src/utils/shopUtil";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const Profile: NextPage = () => {
  const [shop, setShop] = useState<IShop | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [isShopOwner, setIsShopOwner] = useState(false);
  const [basicServices, setBasicServices] = useState<IService[] | null>(null);
  const [customServices, setCustomServices] = useState<IService[] | null>(null);
  const [
    addHoursOfOperationDialogVisible,
    setAddHoursOfOperationDialogVisible,
  ] = useState(false);
  const router = useRouter();
  const id = router.query.id as string | undefined;

  const userShopId = useSelector(AuthSelectors.getShopId);
  const userType = useSelector(AuthSelectors.getUserType);

  useEffect(() => {
    if (id) {
      getShopId(id).then((shopData) => {
        if (shopData) {
          setShop(shopData);
          setIsLoading(false);
        }
      });

      getServicesByShopId(id, ServiceType.CANNED).then((services) => {
        if (services) {
          setBasicServices(
            // Sort services by name
            [...services].sort((a, b) => (a.name > b.name ? 1 : -1))
          );
        }
      });

      getServicesByShopId(id, ServiceType.CUSTOM).then((services) => {
        if (services) {
          setCustomServices(
            // Sort services by name
            [...services].sort((a, b) => (a.name > b.name ? 1 : -1))
          );
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (userShopId === id && userType === UserType.SHOP_OWNER) {
      setIsShopOwner(true);
    }
  }, [id, userShopId, userType]);

  const renderHoursOfOperation = (shop: IShop) => {
    if (!shop.hoursOfOperation && isShopOwner) {
      return (
        <div className={styles.centerFieldSetInnerContainer}>
          <Button
            className={styles.shopProfileButtonGreen}
            onClick={() => {
              setAddHoursOfOperationDialogVisible(true);
            }}
          >
            <span>
              <i className="pi pi-plus"></i>
              {` Add Hours of Operation`}
            </span>
          </Button>
        </div>
      );
    } else if (shop.hoursOfOperation && isShopOwner) {
      return (
        <div>
          {" "}
          <div className={styles.centerFieldSetInnerContainer}>
            <Button
              className={styles.shopProfileButtonGreen}
              onClick={() => {
                setAddHoursOfOperationDialogVisible(true);
              }}
            >
              <span>
                <i className="pi pi-plus"></i>
                {` Edit Hours of Operation`}
              </span>
            </Button>
          </div>
          {renderHoursOfOperationContents(shop.hoursOfOperation)}
        </div>
      );
    } else if (shop.hoursOfOperation) {
      return (
        <div> {renderHoursOfOperationContents(shop.hoursOfOperation)}</div>
      );
    }
  };

  const renderHoursOfOperationContents = (
    hoursOfOperation: IShopHoursOfOperation
  ) => {
    return (
      <div>
        {days.map((day) =>
          renderOperatingDay(
            day,
            hoursOfOperation[day as keyof IShopHoursOfOperation]
          )
        )}
      </div>
    );
  };

  const renderOperatingDay = (day: string, operatingDay: IShopOperatingDay) => {
    const openTime = new Date(operatingDay.openTime).toLocaleTimeString(
      "en-US",
      { hour: "numeric", minute: "numeric", hour12: true }
    );
    const closeTime = new Date(operatingDay.closeTime).toLocaleTimeString(
      "en-US",
      { hour: "numeric", minute: "numeric", hour12: true }
    );

    return (
      <div key={day} className={styles.operatingDayContainer}>
        <div
          className={classNames("blueText", styles.hoursOfOperationDayHeader)}
        >{`${day.charAt(0).toUpperCase() + day.slice(1)}`}</div>
        {operatingDay.isOpen ? (
          <div>{`${openTime} - ${closeTime}`}</div>
        ) : (
          <div>Closed</div>
        )}
      </div>
    );
  };

  const renderShopHeader = (shop: IShop) => {
    return (
      <div className={styles.shopProfileHeader}>
        <div className={styles.shopProfilePicture}>
          <Image src={defaultProfilePicture} alt="Sayyara Logo" />
        </div>
        <div className={styles.shopProfileHeaderContentContainer}>
          <div className={styles.shopProfileHeaderTextContainer}>
            <div className={styles.shopProfileHeaderText}>{shop?.name}</div>
            <div
              className={styles.shopProfileSubHeaderText}
            >{`${shop.address}, ${shop.city}, ${shop.province}, ${shop.postalCode}`}</div>
            <br></br>
            <span className={styles.shopProfileSubHeaderText}>
              <i className="pi pi-phone"></i>
              {` ${shop.phoneNumber}`}
            </span>
            <span className={styles.shopProfileSubHeaderText}>
              <i className="pi pi-envelope"></i>
              {` ${shop.email}`}
            </span>
          </div>
          <Button
            className={styles.shopProfileButtonGreen}
            disabled={userType === null}
          >
            {userType === null ? "Login to Request Service" : "Request Service"}
          </Button>
        </div>
      </div>
    );
  };

  const renderServiceChip = (service: IService) => {
    return (
      <Chip
        className={styles.serviceChip}
        key={service.id}
        label={service.name}
      />
    );
  };

  const hideHoursOfOperationDialog = () => {
    setAddHoursOfOperationDialogVisible(false);
  };

  const updateShop = (shop: IShop) => {
    setShop(shop);
  };

  return (
    <div>
      {!isLoading && shop && id ? (
        <div>
          {renderShopHeader(shop)}{" "}
          <div className={styles.shopProfileContentsContainer}>
            <Fieldset
              className={styles.shopProfileFieldSet}
              toggleable={true}
              legend="Hours of Operation"
              style={{
                display:
                  userType !== UserType.SHOP_OWNER &&
                  shop?.hoursOfOperation == null
                    ? "none"
                    : "block",
              }}
            >
              {renderHoursOfOperation(shop)}
            </Fieldset>
            <Fieldset
              className={styles.shopProfileFieldSet}
              toggleable={true}
              legend="Basic Services"
            >
              <div>
                {basicServices != null && basicServices.length > 0 ? (
                  <div className={styles.servicesContainer}>
                    {basicServices.map((service) => renderServiceChip(service))}
                  </div>
                ) : (
                  <div>No basic services available.</div>
                )}
              </div>
            </Fieldset>
            <Fieldset
              className={styles.shopProfileFieldSet}
              toggleable={true}
              legend="Custom Services"
            >
              <div>
                {customServices != null && customServices.length > 0 ? (
                  <div className={styles.servicesContainer}>
                    {customServices.map((service) =>
                      renderServiceChip(service)
                    )}
                  </div>
                ) : (
                  <div>No custom services available.</div>
                )}
              </div>
            </Fieldset>
          </div>
          <AddHoursOfOperationDialog
            visible={addHoursOfOperationDialogVisible}
            onHide={hideHoursOfOperationDialog}
            shopId={id}
            shop={shop}
            updateShop={updateShop}
          />
        </div>
      ) : (
        <ShopProfileSkeleton />
      )}
    </div>
  );
};

export default React.memo(Profile);
