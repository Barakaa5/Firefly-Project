import React, { useState } from "react";
import DataTable from "../components/DataTable";
import SearchInput from "../components/SearchInput";
import styles from "../styles/Table.module.scss";

export default function Table() {
  const [filterString, setFilterString] = useState("");
  return (
    <div className={styles.container}>
      <SearchInput setFilterString={setFilterString} />
      <DataTable filterString={filterString} />
    </div>
  );
}