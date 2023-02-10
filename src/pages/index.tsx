import classNames from "classnames";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Router from "next/router";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
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

const MAX_CHIP_MOBILE = 2;
const MAX_CHIP = 3;
const filterByPartType = ["OEM", "AFTERMARKET"];
const filterByPartCondition = ["NEW", "USED"];
const searchFilterList = ["Service", "Shop Name"];

const Home: NextPage = () => {
  const [selectedTypeFilters, setSelectedTypeFilters] =
    useState(filterByPartType);
  const [selectedConditionFilters, setSelectedConditionFilters] = useState(
    filterByPartCondition
  );
  const [locationRange, setLocationRange] = useState<[number, number]>([1, 50]);

  const [searchString, setSearchString] = useState("");
  const [searchFilter, setSearchFilter] = useState(searchFilterList[0]);

  const [shops, setShops] = useState<(IShop & { services: IService[] })[]>([]);

  // Initial fetch
  useEffect(() => {
    getFilteredShops("", true).then((data) => {
      if (data) {
        setShops(data);
      }
    });
  }, []);

  const onTypeChange = (e: { value: any; checked: boolean }) => {
    let _selectedTypeFilters = [...selectedTypeFilters];

    if (e.checked) {
      _selectedTypeFilters.push(e.value);
    } else {
      for (let i = 0; i < _selectedTypeFilters.length; i++) {
        const filter = _selectedTypeFilters[i];
        if (filter && filter === e.value) {
          _selectedTypeFilters.splice(i, 1);
          break;
        }
      }
    }
    setSelectedTypeFilters(_selectedTypeFilters);
  };

  const onConditionChange = (e: { value: any; checked: boolean }) => {
    let _selectedConditionFilters = [...selectedConditionFilters];

    if (e.checked) {
      _selectedConditionFilters.push(e.value);
    } else {
      for (let i = 0; i < _selectedConditionFilters.length; i++) {
        const filter = _selectedConditionFilters[i];
        if (filter && filter === e.value) {
          _selectedConditionFilters.splice(i, 1);
          break;
        }
      }
    }
    setSelectedConditionFilters(_selectedConditionFilters);
  };

  const setRange = (e: SliderChangeParams) => {
    if (typeof e.value !== "number") {
      setLocationRange(e.value);
    }
  };

  const onChangeString = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  const onChangeFilter = (e: DropdownChangeParams) => {
    setSearchFilter(e.value);
  };

  const filterByParts = (shop: IShop & { services: IService[] }) => {
    // Filters parts by checking if any service in a shop has all parts that match any criteria
    // If any service contains all parts in the filter, then the shop is passed through
    const numServices = shop.services.length;
    for (let i = 0; i < numServices; i++) {
      if (shop.services[i]) {
        const parts = shop.services[i]?.parts;
        if (parts && parts.length !== 0) {
          const flag = parts.every((part) => {
            return (
              selectedTypeFilters.includes(part.build) &&
              selectedConditionFilters.includes(part.condition)
            );
          });
          if (flag) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const onSearch = () => {
    // Fetch via search parameters
    if (searchString !== "") {
      switch (searchFilter) {
        case "Service":
          getFilteredShops(searchString, false).then((data) => {
            if (data) {
              // Filter by part type here
              let filteredData = data.filter(filterByParts);
              setShops(filteredData);
            }
          });
          break;
        case "Shop Name":
          getFilteredShops(searchString, true).then((data) => {
            if (data) {
              // Filter by part type here
              let filteredData = data.filter(filterByParts);
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
          let filteredData = data.filter(filterByParts);
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
    for (let i = 0; i <= maxChip - 1; i++) {
      let service = shop.services[i];
      if (service) {
        serviceList.push(<Chip className={styles.chip} label={service.name} />);
      }
    }
    if (view === "desktop") {
      serviceList.push(
        <Chip className={styles.fullListChip} label="See Full List" />
      );
    } else {
      serviceList.push(<Chip className={styles.fullListChip} label="..." />);
    }

    return serviceList;
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
          <div>{shop.address}</div>
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
            <Button label="Search" onClick={onSearch} />
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
            <Button label="Search" onClick={onSearch} />
          </div>
          <DataView
            className={styles.desktopData}
            value={shops}
            layout="list"
            itemTemplate={(shop) => itemTemplate(shop, "desktop")}
            paginator
            rows={4}
          />
          <DataView
            className={styles.mobileData}
            value={shops}
            layout="list"
            itemTemplate={(shop) => itemTemplate(shop, "mobile")}
            paginator
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
