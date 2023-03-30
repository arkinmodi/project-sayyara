import styles from "@styles/Home.module.css";
import classNames from "classnames";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeParams } from "primereact/checkbox";
import { Chip } from "primereact/chip";
import { DataView } from "primereact/dataview";
import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import {
  Slider,
  SliderChangeParams,
  SliderSlideEndParams,
} from "primereact/slider";
import { Tooltip } from "primereact/tooltip";
import image from "public/icons/icon-192x192.png";
import { ChangeEvent, useEffect, useState } from "react";
import { IService } from "src/types/service";
import { IShop } from "src/types/shop";
import { getFilteredShops } from "src/utils/shopUtil";
import ShopLookupSkeleton from "../components/lookup/ShopLookupSkeleton";

const MAX_CHIP_MOBILE = 0;
const MAX_CHIP = 3;
const filterByPartType = ["OEM", "AFTERMARKET"];
const filterByPartCondition = ["NEW", "USED"];
const searchFilterList: string[] = ["Service", "Shop Name"];
const filterRange: [number, number] = [0, 101];

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [selectedTypeFilters, setSelectedTypeFilters] = useState<string[]>([]);
  const [selectedConditionFilters, setSelectedConditionFilters] = useState<
    string[]
  >([]);
  const [locationRange, setLocationRange] =
    useState<[number, number]>(filterRange);

  const [searchString, setSearchString] = useState("");
  const [searchFilter, setSearchFilter] = useState<string>(
    searchFilterList[0] as string
  );
  const [lastSearch, setLastSearch] = useState<[string, string]>([
    "",
    searchFilterList[0] as string,
  ]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  const [shops, setShops] = useState<
    (IShop & { services: IService[] } & { distance: number })[]
  >([]);

  // Initial fetch
  useEffect(() => {
    // Get user location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function success(position) {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        function error(error_message) {
          console.log(
            "An error has occurred while retrieving location ",
            error_message
          );
        }
      );
    } else {
      console.log("Geolocation is not supported on this browser.");
    }

    getFilteredShops("", true, null, null).then((data) => {
      if (data) {
        setShops(data);
        setIsLoading(false);
      }
    });
  }, []);

  const onTypeChange = (e: CheckboxChangeParams) => {
    const value = e.value;
    const checked = e.checked;
    let _selectedTypeFilters = [...selectedTypeFilters];

    if (checked) {
      _selectedTypeFilters.push(value);
    } else {
      for (let i = 0; i < _selectedTypeFilters.length; i++) {
        const filter = _selectedTypeFilters[i];
        if (filter && filter === value) {
          _selectedTypeFilters.splice(i, 1);
          break;
        }
      }
    }
    setSelectedTypeFilters(_selectedTypeFilters);

    // Search with previous parameters and new filters
    onSearch(
      lastSearch[0],
      lastSearch[1],
      selectedConditionFilters,
      _selectedTypeFilters,
      locationRange
    );
  };

  const onConditionChange = (e: CheckboxChangeParams) => {
    const value = e.value;
    const checked = e.checked;
    let _selectedConditionFilters = [...selectedConditionFilters];

    if (checked) {
      _selectedConditionFilters.push(value);
    } else {
      for (let i = 0; i < _selectedConditionFilters.length; i++) {
        const filter = _selectedConditionFilters[i];
        if (filter && filter === value) {
          _selectedConditionFilters.splice(i, 1);
          break;
        }
      }
    }
    setSelectedConditionFilters(_selectedConditionFilters);

    // Search with previous parameters and new filters
    onSearch(
      lastSearch[0],
      lastSearch[1],
      _selectedConditionFilters,
      selectedTypeFilters,
      locationRange
    );
  };

  const setRange = (e: SliderChangeParams) => {
    if (typeof e.value !== "number") {
      let _locationRange = e.value;
      setLocationRange(_locationRange);
    }
  };

  const searchWithRange = (e: SliderSlideEndParams) => {
    if (typeof e.value !== "number") {
      let _locationRange = e.value;

      onSearch(
        lastSearch[0],
        lastSearch[1],
        selectedConditionFilters,
        selectedTypeFilters,
        _locationRange
      );
    }
  };

  const resetFilters = () => {
    // Resets filters
    setSelectedTypeFilters([]);
    setSelectedConditionFilters([]);
    setLocationRange(filterRange);

    onSearch(lastSearch[0], lastSearch[1], [], [], filterRange);
  };

  const onChangeString = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const onChangeFilter = (e: DropdownChangeParams) => {
    setSearchFilter(e.value);
  };

  const filterByPartsType = (
    shop: IShop & { services: IService[] },
    types: string[]
  ) => {
    // Filters parts by checking if any service in a shop has all parts that match any criteria
    // If any service contains all parts in the filter, then the shop is passed through
    // If there are no filters selected, skip this filter
    if (types.length === 0) {
      return true;
    }

    const numServices = shop.services.length;
    for (let i = 0; i < numServices; i++) {
      if (shop.services[i]) {
        const parts = shop.services[i]?.parts;
        if (parts && parts.length !== 0) {
          const flag = parts.every((part) => {
            return types.includes(part.build);
          });
          if (flag) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const filterByPartsCondition = (
    shop: IShop & { services: IService[] },
    conditions: string[]
  ) => {
    if (conditions.length === 0) {
      return true;
    }

    const numServices = shop.services.length;
    for (let i = 0; i < numServices; i++) {
      if (shop.services[i]) {
        const parts = shop.services[i]?.parts;
        if (parts && parts.length !== 0) {
          const flag = parts.every((part) => {
            return conditions.includes(part.condition);
          });
          if (flag) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const filterByDistance = (
    shops: (IShop & { services: IService[] } & { distance: number })[],
    minDistance: number,
    maxDistance: number
  ) => {
    let filteredShops = shops.filter((shop) => {
      return shop.distance >= minDistance && shop.distance <= maxDistance;
    });

    setShops(filteredShops);
  };

  const onSearch = (
    str: string,
    filter: string,
    conditions: string[],
    types: string[],
    distanceRange: [number, number],
    fromButton?: boolean
  ) => {
    // Two scenarios:
    // 1. Input from search bar & search filter, on button press
    // 2. Immediately after a checkbox change, use previous search values
    if (fromButton) {
      setLastSearch([str, filter]);
    } else {
      // Resets search parameters to previous search
      setSearchString(lastSearch[0]);
      setSearchFilter(lastSearch[1]);
    }

    // Check for location filter
    let latitude: number | null = null;
    let longitude: number | null = null;
    if (userLocation && distanceRange[1] < 101) {
      // Accept location filter if location exists and range is provided (not 101)
      latitude = userLocation[0];
      longitude = userLocation[1];
    }

    // Fetch via search parameters
    if (str !== "") {
      // Can filter by service name or shop name
      switch (filter) {
        case "Service":
          getFilteredShops(str, false, latitude, longitude).then((data) => {
            if (data) {
              // Filter by part type here
              let filteredData = data
                .filter((shop) => filterByPartsType(shop, types))
                .filter((shop) => filterByPartsCondition(shop, conditions));

              // Filter by distance here
              if (latitude && longitude) {
                filterByDistance(
                  filteredData,
                  distanceRange[0],
                  distanceRange[1]
                );
              } else {
                setShops(filteredData);
              }
            }
          });
          break;
        case "Shop Name":
          getFilteredShops(str, true, latitude, longitude).then((data) => {
            if (data) {
              // Filter by part type here
              let filteredData = data
                .filter((shop) => filterByPartsType(shop, types))
                .filter((shop) => filterByPartsCondition(shop, conditions));

              // Filter by distance here
              if (latitude && longitude) {
                filterByDistance(
                  filteredData,
                  distanceRange[0],
                  distanceRange[1]
                );
              } else {
                setShops(filteredData);
              }
            }
          });
          break;
        default:
          break;
      }
    } else {
      getFilteredShops("", true, latitude, longitude).then((data) => {
        if (data) {
          let filteredData = data
            .filter((shop) => filterByPartsType(shop, types))
            .filter((shop) => filterByPartsCondition(shop, conditions));

          // Filter by distance here
          if (latitude && longitude) {
            filterByDistance(filteredData, distanceRange[0], distanceRange[1]);
          } else {
            setShops(filteredData);
          }
        }
      });
    }
  };

  const shopOnClick = (shop: IShop & { services: IService[] }) => {
    Router.push(`/shop/${shop.id}`);
  };

  const generateServiceList = (
    shop: IShop & { services: IService[] },
    view: string
  ) => {
    const maxChip = view === "desktop" ? MAX_CHIP : MAX_CHIP_MOBILE;
    let serviceList: JSX.Element[] = [];
    // Return nothing if no services
    if (shop.services.length === 0) {
      return serviceList;
    }

    for (let i = 0; i <= maxChip - 1; i++) {
      let service = shop.services[i];
      if (service) {
        serviceList.push(
          <Chip key={service.id} className={styles.chip} label={service.name} />
        );
      }
    }
    if (view === "desktop") {
      serviceList.push(
        <Chip
          key={`${view}SeeFullListChip`}
          className={styles.fullListChip}
          label="See Full List"
        />
      );
      // } else {
      // serviceList.push(
      //   <Chip
      //     key={`${view}SeeFullListChip`}
      //     className={styles.fullListChip}
      //     label="..."
      //   />
      // );
    }

    return serviceList;
  };

  const renderAddress = (
    shop: IShop & { services: IService[] },
    view: string
  ) => {
    switch (view) {
      case "desktop":
        return (
          <div>{`${shop.address}, ${shop.city}, ${shop.province}, ${shop.postalCode}`}</div>
        );
      case "mobile":
        return (
          <div>
            <div>{shop.address}</div>
            <div>{`${shop.city}, ${shop.province}`}</div>
            <div>{shop.postalCode}</div>
          </div>
        );
    }
  };

  const itemTemplate = (
    shop: IShop & { services: IService[] } & { distance: number },
    view: string
  ) => {
    const serviceList = generateServiceList(shop, view);

    return (
      <div className={styles.itemContainer} onClick={() => shopOnClick(shop)}>
        <Image
          src={image}
          alt={shop.name}
          width={image.width * 0.4}
          height={image.height * 0.17}
        />
        <div className={styles.itemText}>
          <h4 className={styles.itemShopName}>{shop.name}</h4>
          <div>{renderAddress(shop, view)}</div>
          <div>{serviceList}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Sayyara</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!isLoading ? (
        <div className={styles.main}>
          <div className={styles.filter}>
            <Panel className={styles.desktopFilter} header="Filter By">
              <div className={styles.filterTitles}>
                <span>
                  <Tooltip
                    target=".desktopTypeInfo"
                    style={{ fontSize: "12px" }}
                  />
                  <span style={{ marginRight: "0.5rem" }}>Part Type</span>
                  <i
                    className="pi pi-info-circle desktopTypeInfo"
                    data-pr-tooltip={`Select OEM to show OEM parts only, same applies to AFTERMARKET.\nSelecting both options will show OEM or AFTERMARKET parts.`}
                    data-pr-position="right"
                    style={{ cursor: "pointer" }}
                  ></i>
                </span>
              </div>
              {filterByPartType.map((category) => {
                return (
                  <div key={category} className={styles.buttonList}>
                    <Checkbox
                      inputId={category}
                      name="category"
                      value={category}
                      onChange={onTypeChange}
                      checked={selectedTypeFilters.some(
                        (item) => item === category
                      )}
                    />
                    <label className={styles.label} htmlFor={category}>
                      {category}
                    </label>
                  </div>
                );
              })}
              <div className={styles.filterTitles}>
                <span>
                  <Tooltip
                    target=".desktopConditionInfo"
                    style={{ fontSize: "12px" }}
                  />
                  <span style={{ marginRight: "0.5rem" }}>Part Condition</span>
                  <i
                    className="pi pi-info-circle desktopConditionInfo"
                    data-pr-tooltip={`Select USED to show used parts only, same applies to NEW.\nSelecting both options will show new or used parts.`}
                    data-pr-position="right"
                    style={{ cursor: "pointer" }}
                  ></i>
                </span>
              </div>
              {filterByPartCondition.map((category) => {
                return (
                  <div key={category} className={styles.buttonList}>
                    <Checkbox
                      inputId={category}
                      name="category"
                      value={category}
                      onChange={onConditionChange}
                      checked={selectedConditionFilters.some(
                        (item) => item === category
                      )}
                    />
                    <label className={styles.label} htmlFor={category}>
                      {category}
                    </label>
                  </div>
                );
              })}
              <div
                className={classNames(styles.filterTitles, styles.sliderTitle)}
              >
                <span>
                  <Tooltip
                    target=".desktopLocationRange"
                    style={{ fontSize: "12px" }}
                  />
                  <span style={{ marginRight: "0.5rem" }}>
                    Location Range (km):
                    {locationRange[1] === 101
                      ? " Unlimited"
                      : ` [${locationRange[0]}, ${locationRange[1]}]`}
                  </span>
                  <i
                    className="pi pi-info-circle desktopLocationRange"
                    data-pr-tooltip={`If location permissions are not given, this field will be disabled.`}
                    data-pr-position="right"
                    style={{ cursor: "pointer" }}
                  ></i>
                </span>
              </div>
              <Slider
                value={locationRange}
                min={filterRange[0]}
                max={filterRange[1]}
                onChange={setRange}
                onSlideEnd={searchWithRange}
                range
                disabled={!userLocation}
              />
              <Button className={styles.filterButton} onClick={resetFilters}>
                Reset Filters
              </Button>
            </Panel>
            <Panel
              className={styles.mobileFilter}
              header="Filter By"
              toggleable
              collapsed
            >
              <div className={styles.filterTitles}>
                <span>
                  <Tooltip
                    target=".mobileTypeInfo"
                    style={{ fontSize: "12px" }}
                  />
                  <span style={{ marginRight: "0.5rem" }}>Part Type</span>
                  <i
                    className="pi pi-info-circle mobileTypeInfo"
                    data-pr-tooltip={`Select OEM to show OEM parts only, same applies to AFTERMARKET.\nSelecting both options will show OEM or AFTERMARKET parts.`}
                    data-pr-position="right"
                    style={{ cursor: "pointer" }}
                  ></i>
                </span>
              </div>
              {filterByPartType.map((category) => {
                return (
                  <div key={category} className={styles.buttonList}>
                    <Checkbox
                      inputId={category}
                      name="category"
                      value={category}
                      onChange={onTypeChange}
                      checked={selectedTypeFilters.some(
                        (item) => item === category
                      )}
                    />
                    <label className={styles.label} htmlFor={category}>
                      {category}
                    </label>
                  </div>
                );
              })}
              <div className={styles.filterTitles}>
                <span>
                  <Tooltip
                    target=".mobileConditionInfo"
                    style={{ fontSize: "12px" }}
                  />
                  <span style={{ marginRight: "0.5rem" }}>Part Condition</span>
                  <i
                    className="pi pi-info-circle mobileConditionInfo"
                    data-pr-tooltip={`Select USED to show used parts only, same applies to NEW.\nSelecting both options will show new or used parts.`}
                    data-pr-position="right"
                    style={{ cursor: "pointer" }}
                  ></i>
                </span>
              </div>{" "}
              {filterByPartCondition.map((category) => {
                return (
                  <div key={category} className={styles.buttonList}>
                    <Checkbox
                      inputId={category}
                      name="category"
                      value={category}
                      onChange={onConditionChange}
                      checked={selectedConditionFilters.some(
                        (item) => item === category
                      )}
                    />
                    <label className={styles.label} htmlFor={category}>
                      {category}
                    </label>
                  </div>
                );
              })}
              <div
                className={classNames(styles.filterTitles, styles.sliderTitle)}
              >
                <span>
                  <Tooltip
                    target=".mobileLocationRange"
                    style={{ fontSize: "12px" }}
                  />
                  <span style={{ marginRight: "0.5rem" }}>
                    Location Range (km):
                    {locationRange[1] === 101
                      ? " Unlimited"
                      : ` [${locationRange[0]}, ${locationRange[1]}]`}
                  </span>
                  <i
                    className="pi pi-info-circle mobileLocationRange"
                    data-pr-tooltip={`If location permissions are not given, this field will be disabled.`}
                    data-pr-position="top"
                    style={{ cursor: "pointer" }}
                  ></i>
                </span>
              </div>
              <Slider
                value={locationRange}
                min={filterRange[0]}
                max={filterRange[1]}
                onChange={setRange}
                onSlideEnd={searchWithRange}
                range
                disabled={!userLocation}
              />
              <Button className={styles.filterButton} onClick={resetFilters}>
                Reset Filters
              </Button>
            </Panel>
          </div>
          <div className={styles.content}>
            <div
              className={classNames(
                "p-inputgroup",
                styles.search,
                styles.desktopSearch
              )}
            >
              <InputText
                className={styles.searchInputText}
                placeholder="Search"
                value={searchString}
                onChange={onChangeString}
              />
              <Dropdown
                className={styles.dropdown}
                value={searchFilter}
                options={searchFilterList}
                onChange={onChangeFilter}
                placeholder="Service"
              />
              <Button
                className={styles.searchButton}
                label="Search"
                onClick={() =>
                  onSearch(
                    searchString,
                    searchFilter,
                    selectedConditionFilters,
                    selectedTypeFilters,
                    locationRange,
                    true
                  )
                }
              />
            </div>
            <div className={classNames(styles.search, styles.mobileSearch)}>
              <InputText
                className={styles.inputtext}
                placeholder="Search"
                value={searchString}
                onChange={onChangeString}
              />
              <Dropdown
                className={styles.dropdown}
                value={searchFilter}
                options={searchFilterList}
                onChange={onChangeFilter}
                placeholder="Service"
              />
              <Button
                className={styles.searchButton}
                label="Search"
                onClick={() =>
                  onSearch(
                    searchString,
                    searchFilter,
                    selectedConditionFilters,
                    selectedTypeFilters,
                    locationRange,
                    true
                  )
                }
              />
            </div>
            <DataView
              className={styles.desktopData}
              value={shops}
              layout="list"
              itemTemplate={(shop) => itemTemplate(shop, "desktop")}
              paginator
              rows={7}
            />
            <DataView
              className={styles.mobileData}
              value={shops}
              layout="list"
              itemTemplate={(shop) => itemTemplate(shop, "mobile")}
              paginator
              rows={5}
            />
          </div>
        </div>
      ) : (
        <ShopLookupSkeleton />
      )}
    </div>
  );
};

export default Home;
