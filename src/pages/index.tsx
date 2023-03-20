import styles from "@styles/Home.module.css";
import classNames from "classnames";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { DataView } from "primereact/dataview";
import { Dropdown, DropdownChangeParams } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { RadioButton, RadioButtonChangeParams } from "primereact/radiobutton";
import { Slider, SliderChangeParams } from "primereact/slider";
import image from "public/icons/icon-192x192.png";
import { ChangeEvent, useEffect, useState } from "react";
import { IService } from "src/types/service";
import { IShop } from "src/types/shop";
import { getFilteredShops } from "src/utils/shopUtil";
import ShopLookupSkeleton from "../components/lookup/ShopLookupSkeleton";

const MAX_CHIP_MOBILE = 0;
const MAX_CHIP = 3;
const partTypes: { key: string; value: string }[] = [
  { key: "No Filter", value: "No Filter" },
  { key: "OEM", value: "OEM Only" },
  { key: "AFTERMARKET", value: "Aftermarket Only" },
  { key: "OEM & AFTERMARKET", value: "OEM & Aftermarket" },
];
const partConditions = [
  { key: "No Filter", value: "No Filter" },
  { key: "NEW", value: "Only New Parts" },
  { key: "USED", value: "Only Used Parts" },
  { key: "NEW & USED", value: "New & Used Parts" },
];
const searchFilterList: string[] = ["Service", "Shop Name"];

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [selectedTypeFilters, setSelectedTypeFilters] = useState<{
    key: string;
    value: string;
  }>(partTypes[0]!);
  const [selectedConditionFilters, setSelectedConditionFilters] = useState<{
    key: string;
    value: string;
  }>(partConditions[0]!);
  const [locationRange, setLocationRange] = useState<[number, number]>([1, 50]);

  const [searchString, setSearchString] = useState("");
  const [searchFilter, setSearchFilter] = useState<string>(
    searchFilterList[0] as string
  );
  const [lastSearch, setLastSearch] = useState<[string, string]>([
    "",
    searchFilterList[0] as string,
  ]);

  const [shops, setShops] = useState<(IShop & { services: IService[] })[]>([]);

  // Initial fetch
  useEffect(() => {
    getFilteredShops("", true).then((data) => {
      if (data) {
        setShops(data);
        setIsLoading(false);
      }
    });
  }, []);

  const onTypeChange = (e: RadioButtonChangeParams) => {
    setSelectedTypeFilters(e.value);

    // Search with previous parameters and new filters
    onSearch(
      lastSearch[0],
      lastSearch[1],
      selectedConditionFilters.key,
      e.value.key
    );
  };

  const onConditionChange = (e: RadioButtonChangeParams) => {
    setSelectedConditionFilters(e.value);

    // Search with previous parameters and new filters
    onSearch(
      lastSearch[0],
      lastSearch[1],
      e.value.key,
      selectedTypeFilters.key
    );
  };

  const setRange = (e: SliderChangeParams) => {
    if (typeof e.value !== "number") {
      setLocationRange(e.value);
    }
  };

  const resetFilters = () => {
    // Resets filters
    setSelectedTypeFilters(partTypes[0]!);
    setSelectedConditionFilters(partConditions[0]!);

    onSearch(
      lastSearch[0],
      lastSearch[1],
      partTypes[0]!.key,
      partConditions[0]!.key
    );
  };

  const onChangeString = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const onChangeFilter = (e: DropdownChangeParams) => {
    setSearchFilter(e.value);
  };

  const filterByPartsType = (
    shop: IShop & { services: IService[] },
    filter: string
  ) => {
    // Filters parts by checking if any service in a shop has all parts that match any criteria
    // If any service contains all parts in the filter, then the shop is passed through
    // If there are no filters selected, skip this filter
    let types: string[] = [];
    if (filter === partTypes[0]!.key) {
      return true;
    } else if (filter === partTypes[3]!.key) {
      types = ["OEM", "AFTERMARKET"];
    } else {
      types = [filter];
    }
    console.log("IN FILTER: types=", types);

    const numServices = shop.services.length;
    // For each service in a shop
    for (let i = 0; i < numServices; i++) {
      if (shop.services[i]) {
        const parts = shop.services[i]?.parts;
        if (parts && parts.length !== 0) {
          // Every part must match the types
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
    filter: string
  ) => {
    // Skip if no filters selected
    let conditions: string[] = [];
    if (filter === partConditions[0]!.key) {
      return true;
    } else if (filter === partConditions[3]!.key) {
      conditions = ["NEW", "USED"];
    } else {
      conditions = [filter];
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

  const onSearch = (
    str: string,
    filter: string,
    conditions: string,
    types: string,
    fromButton?: boolean
  ) => {
    console.log("string: " + str);
    console.log("filter: " + filter);
    console.log("conditions: " + conditions);
    console.log("types: " + types);
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

    // Fetch via search parameters
    if (str !== "") {
      switch (filter) {
        case "Service":
          getFilteredShops(str, false).then((data) => {
            if (data) {
              // Filter by part type here
              let filteredData = data
                .filter((shop) => filterByPartsType(shop, types))
                .filter((shop) => filterByPartsCondition(shop, conditions));
              setShops(filteredData);
            }
          });
          break;
        case "Shop Name":
          getFilteredShops(str, true).then((data) => {
            if (data) {
              // Filter by part type here
              let filteredData = data
                .filter((shop) => filterByPartsType(shop, types))
                .filter((shop) => filterByPartsCondition(shop, conditions));
              setShops(filteredData);
            }
          });
          break;
        default:
          break;
      }
    } else {
      getFilteredShops("", true).then((data) => {
        if (data) {
          let filteredData = data
            .filter((shop) => filterByPartsType(shop, types))
            .filter((shop) => filterByPartsCondition(shop, conditions));
          setShops(filteredData);
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
    shop: IShop & { services: IService[] },
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
              <h5 className={styles.h5Top}>Part Type</h5>
              {partTypes.map((category) => {
                return (
                  <div key={category.key} className={styles.buttonList}>
                    <RadioButton
                      inputId={category.key}
                      name="category"
                      value={category}
                      onChange={onTypeChange}
                      checked={selectedTypeFilters === category}
                    />
                    <label className={styles.label} htmlFor={category.key}>
                      {category.value}
                    </label>
                  </div>
                );
              })}
              <h5>Part Condition</h5>
              {partConditions.map((category) => {
                return (
                  <div key={category.key} className={styles.buttonList}>
                    <RadioButton
                      inputId={category.key}
                      name="category"
                      value={category}
                      onChange={onConditionChange}
                      checked={selectedConditionFilters === category}
                    />
                    <label className={styles.label} htmlFor={category.key}>
                      {category.value}
                    </label>
                  </div>
                );
              })}
              <h5>
                Location Range (km): [{locationRange[0]} - {locationRange[1]}]
              </h5>
              <Slider
                value={locationRange}
                min={1}
                max={50}
                onChange={setRange}
                range
                disabled
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
              <h5 className={styles.h5Top}>Part Type</h5>
              {partTypes.map((category) => {
                return (
                  <div key={category.key} className={styles.buttonList}>
                    <RadioButton
                      inputId={category.key}
                      name="category"
                      value={category}
                      onChange={onTypeChange}
                      checked={selectedTypeFilters === category}
                    />
                    <label className={styles.label} htmlFor={category.key}>
                      {category.value}
                    </label>
                  </div>
                );
              })}
              <h5>Part Condition</h5>
              {partConditions.map((category) => {
                return (
                  <div key={category.key} className={styles.buttonList}>
                    <RadioButton
                      inputId={category.key}
                      name="category"
                      value={category}
                      onChange={onConditionChange}
                      checked={selectedConditionFilters === category}
                    />
                    <label className={styles.label} htmlFor={category.key}>
                      {category.value}
                    </label>
                  </div>
                );
              })}
              <h5>
                Location Range (km): [{locationRange[0]} - {locationRange[1]}]
              </h5>
              <Slider
                value={locationRange}
                min={1}
                max={50}
                onChange={setRange}
                range
                disabled
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
                    selectedConditionFilters.key,
                    selectedTypeFilters.key,
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
                    selectedConditionFilters.key,
                    selectedTypeFilters.key,
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
