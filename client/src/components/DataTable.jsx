import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styles from "../styles/DataTable.module.scss";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { CircularProgress, Paper, Alert } from "@mui/material";

const filterMovies = (movies, filterString) => {
  if (!filterString) return movies;
  return movies.filter((movie) => {
    const { id, ...rest } = movie; // extract id from rest of movie object
    const isSomeMatch = Object.values(rest)
      .map((value) => value.toString().toLowerCase())
      .some((value) => value.includes(filterString.toLowerCase()));
    return isSomeMatch;
  });
};
const createRows = (filteredMovies, allAvailableKeys) => {
  const rows = filteredMovies.map((movie) => {
    return allAvailableKeys.reduce((acc, key) => {
      acc[key] = movie[key];
      return acc;
    }, {});
  });
  return rows;
};
const createColumns = (allAvailableKeys) => {
  const flexSizes = {
    rank: 0.2,
    title: 0.7,
    year: 0.2,
    director: 0.5,
    actors: 1,
  };
  const minWidths = {
    rank: 70,
    title: 250,
    year: 70,
    director: 250,
    actors: 250,
  };
  const columns = allAvailableKeys.map((key) => {
    let flex = flexSizes[key];
    if (!flex) flex = 0.5; // default flex size for new keys (new columns)
    let minWidth = minWidths[key];
    if (!minWidth) minWidth = 70; // default min width for new keys (new columns)
    return {
      field: key,
      headerName: key.charAt(0).toUpperCase() + key.slice(1),
      minWidth,
      align: "center",
      headerAlign: "center",
      flex,
      hide: key === "id",
    };
  });
  return columns;
};

export default function DataTable({ filterString }) {
  const [movies, setMovies] = useState([]); // This is the list of movies that will be filtered
  const [filteredMovies, setFilteredMovies] = useState([]); // This is the filtered list of movies that will be displayed in the table
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const allAvailableKeys = filteredMovies[0]
    ? Object.keys(filteredMovies[0])
    : [];

  const rows = createRows(filteredMovies, allAvailableKeys);
  const columns = createColumns(allAvailableKeys);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(
        // "/getAllMovies?sortColumn=actors&sortDirection=asc&pageSize=70"
        "/getAllMovies?pageSize=70"
        // "/getAllMovies"
      );
      setMovies(res.data.movies);
      setFilteredMovies(res.data.movies);
      setLoading(false);
    } catch (err) {
      console.log("err", err);
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    setFilteredMovies(filterMovies(movies, filterString));
  }, [filterString]);

  return loading ? (
    <div className={styles.CircularProgressDiv}>
      <CircularProgress />
    </div>
  ) : error ? (
    <Alert severity="error" className={styles.Alert}>
      There was an error fetching the data. Please refresh the page.
    </Alert>
  ) : (
    <div className={styles.DataGridContainer}>
      <div className={styles.DataGridContainer_InnerDiv}>
        <Paper elevation={5}>
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            components={{ Toolbar: GridToolbar }} // This is the component that renders the search bar
          />
        </Paper>
      </div>
    </div>
  );
}

DataTable.propTypes = {
  filterString: PropTypes.string,
};
