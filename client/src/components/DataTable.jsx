import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import styles from "../styles/DataTable.module.scss";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { CircularProgress, Paper, Alert } from "@mui/material";

const columns = [
  {
    field: "rank",
    headerName: "Rank",
    minWidth: 70,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "title",
    headerName: "Title",
    minWidth: 250,
    align: "center",
    flex: 0.7,
    headerAlign: "center",
  },
  {
    field: "year",
    headerName: "Year",
    minWidth: 70,
    align: "center",
    flex: 0.2,
    headerAlign: "center",
    renderCell: (params) => (params.value ? <p>{params.value}</p> : <p> </p>), // if year is 0, render a space instead of 0
  },
  {
    field: "director",
    headerName: "Director",
    minWidth: 100,
    align: "center",
    flex: 0.5,
    headerAlign: "center",
  },
  {
    field: "actors",
    headerName: "Actors",
    minWidth: 400,
    align: "center",
    flex: 1,
    headerAlign: "center",
  },
];

const filterMovies = (movies, filterString) => {
  if (!filterString) return movies;
  return movies.filter((movie) => {
    return (
      movie.rank?.toString().includes(filterString) ||
      movie.title?.toLowerCase().includes(filterString.toLowerCase()) ||
      movie.director?.toLowerCase().includes(filterString.toLowerCase()) ||
      movie.year?.toString().includes(filterString) ||
      movie.actors?.toLowerCase().includes(filterString.toLowerCase())
    );
  });
};

export default function DataTable({ filterString }) {
  const [movies, setMovies] = useState([]); // This is the list of movies that will be filtered
  const [filteredMovies, setFilteredMovies] = useState([]); // This is the filtered list of movies that will be displayed in the table
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const rows = filteredMovies.map((movie) => {
    return {
      id: movie?.id,
      rank: movie?.rank,
      title: movie?.title,
      year: movie?.year,
      director: movie?.director,
      actors: movie?.actors,
    };
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(
          // "/getAllMovies?sortColumn=actors&sortDirection=asc&pageSize=70"
          // "/getAllMovies?pageSize=70"
          "/getAllMovies"
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
