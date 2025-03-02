import React from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";
const Layout = () => {
  return (
    <>
      <div className={styles.container}>
        <AppHeader />
        <main>
          <Outlet />
        </main>
        <AppFooter />
      </div>
    </>
  );
};

export default Layout;
