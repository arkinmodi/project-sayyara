import styles from "@styles/components/common/Header.module.css";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import React from "react";

const Header = () => {
  const items: MenuItem[] = [];

  const start = (
    <img alt="logo" src="/logo.png" height="40" className="mr-2"></img>
  );
  return <Menubar className={styles.menuBar} model={items} start={start} />;
};

export default React.memo(Header);
