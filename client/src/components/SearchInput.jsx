import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@mui/material";

export default function SearchInput({ setFilterString }) {
  return (
    <TextField
      id="outlined-required"
      label="Search Term"
      helperText="Search by rank, title, year, director, or actor."
      onChange={(e) => setFilterString(e.target.value)}
      sx={{ width: "50%", margin: "auto", borderRadius: "5px", marginTop: "20px" }}
      InputProps={{
        inputProps: {
          style: { textAlign: "center" }
        }
      }}
    />
  );
}

SearchInput.propTypes = {
  setFilterString: PropTypes.func.isRequired,
};