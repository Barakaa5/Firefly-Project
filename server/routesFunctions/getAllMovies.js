const { db } = require("../firebase/firebase");
const { sortMovies, fixMoviesIfNecessary } = require("../utils");


const getAllMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // default is 1
  const pageSize = parseInt(req.query.pageSize) || 10; // default is 10

  const sortColumn = ["rank", "title", "year", "director", "actors"].includes(
    req.query.sortColumn
  )
    ? req.query.sortColumn
    : "rank"; // sortColumn needs to be "rank"/"title"/"year"/"director"/"actors" or else it will be set to "rank".

  const sortDirection = req.query.sortDirection === "desc" ? "desc" : "asc"; // sortDirection needs to be "asc"/"desc" or else it will be set to "asc".

  const moviesRef = db.collection("movies");
  try {
    const snapshot = await moviesRef.get();
    let movies = snapshot?.docs.map((doc) => {
      return doc.data();
    });
    if (!movies.length)
      return res.status(400).json({ error: "No movies found" });

    if (page > Math.ceil(movies.length / pageSize))
      return res.status(400).json({ error: "Invalid page number" });
    if (pageSize > movies.length)
      return res.status(400).json({ error: "Invalid page size" });

    movies = fixMoviesIfNecessary(movies); // fix movies array if necessary, add rank, title, year, director, actors properties to each movie object if they are missing or have wrong type

    const sortedMovies = sortMovies(movies, sortColumn, sortDirection);

    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    const paginatedMovies = sortedMovies.slice(startIndex, endIndex); // paginate movies array

    res.json({
      movies: paginatedMovies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(movies.length / pageSize), // total number of pages
        pageSize,
      },
      sortColumn,
      sortDirection,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" }); // HTTP status code 500 is a generic error response
  }
};

module.exports = getAllMovies;