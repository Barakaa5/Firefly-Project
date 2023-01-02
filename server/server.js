const express = require("express");
const app = express();
const getAllMovies = require("./routesFunctions/getAllMovies");

// const movies = require("./movies.json"); // this is the data that I store inside firebase.

app.get("/getAllMovies", (req, res) => getAllMovies(req, res));

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
