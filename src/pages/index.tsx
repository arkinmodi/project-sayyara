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
import { Slider, SliderChangeParams } from "primereact/slider";
import image from "public/icons/icon-192x192.png";
import { ChangeEvent, useEffect, useState } from "react";
import { IService } from "src/types/service";
import { IShop } from "src/types/shop";
import { getFilteredShops } from "src/utils/shopUtil";
import styles from "../styles/Home.module.css";

const MAX_CHIP_MOBILE = 0;
const MAX_CHIP = 3;
const filterByPartType = ["OEM", "AFTERMARKET"];
const filterByPartCondition = ["NEW", "USED"];
const searchFilterList: string[] = ["Service", "Shop Name"];

const Home: NextPage = () => {
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<string[]>([]);
  const [selectedConditionFilters, setSelectedConditionFilters] = useState<
    string[]
  >([]);
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
      _selectedTypeFilters
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
      selectedTypeFilters
    );
  };

  const setRange = (e: SliderChangeParams) => {
    if (typeof e.value !== "number") {
      setLocationRange(e.value);
    }
  };

  const resetFilters = () => {
    // Resets filters
    setSelectedTypeFilters([]);
    setSelectedConditionFilters([]);

    onSearch(lastSearch[0], lastSearch[1], [], []);
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

  const onSearch = (
    str: string,
    filter: string,
    conditions: string[],
    types: string[],
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

      <div className={styles.main}>
        <div className={styles.filter}>
          <Panel className={styles.desktopFilter} header="Filter By">
            <h5 className={styles.h5Top}>Part Type</h5>
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
            <h5>Part Condition</h5>
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
            <h5>Part Condition</h5>
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
                  selectedConditionFilters,
                  selectedTypeFilters,
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
    </div>
  );
};

export default Home;
