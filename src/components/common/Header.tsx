import styles from "@styles/components/common/Header.module.css";
import Image from "next/image";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import logo from "public/logo.png";
import React from "react";

const Header = () => {
  const items: MenuItem[] = [];

  const start = (
    <Image
      src={logo}
      alt="Sayyara Logo"
      height={logo.height * 0.75}
      width={logo.width * 0.75}
    />
  );
  return <Menubar className={styles.menuBar} model={items} start={start} />;
};

export default React.memo(Header);
