import React from "react";
import fireflyLogo from "../assets/firefly-logo.png";
import styles from "../styles/Header.module.scss";

export default function Header() {
  return (
    <div className={styles.container}>
      <img
        className={styles.container_image}
        src={fireflyLogo}
        alt="Firefly Logo"
      />
    </div>
  );
}