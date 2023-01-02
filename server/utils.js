const sortMovies = (movies, sortColumn, sortDirection) => {
  // sort movies array by sortColumn and sortDirection (sortDirection can be "asc" or "desc") and return the sorted array
  return movies.sort((a, b) => {
    if (sortColumn === "rank" || sortColumn === "year") {
      return sortDirection === "asc"
        ? a[sortColumn] - b[sortColumn]
        : b[sortColumn] - a[sortColumn];
    } else {
      // sortColumn === "title"/"director"/"actors"
      return sortDirection === "asc"
        ? a[sortColumn].localeCompare(b[sortColumn])
        : bColumn.localeCompare(aColumn);
    }
  });
};

const generateId = () => Math.random().toString(36).slice(2, 9); // generate a random id for fixMoviesIfNecessary function

const fixMoviesIfNecessary = (movies) => {
  // fix movies array if necessary, add rank, title, year, director, actors properties to each movie object if they are missing or have wrong type
  const fixActors = (actors) => {
    if (actors === undefined) return ""; // if actors is undefined, then return ""
    if (Array.isArray(actors) && actors.length === 0) return ""; // if actors is an empty array, then return ""
    if (
      Array.isArray(actors) &&
      actors.some((actor) => typeof actor !== "string" || actor === "")
    )
      return ""; // if actors is an array of strings, but some of the strings are empty or not strings, then return ""
    return actors.join(", ");
  };

  return movies.map((movie) => {
    const { id, rank, title, year, director, actors, ...rest } = movie;

    return {
      id: id ? id : generateId(), // if id is missing or not a string, then set it to index
      rank: rank ? parseInt(rank) : 0, // if rank is missing or not a number, then set it to 0
      title: title ? title : "",
      year: year ? parseInt(year) : 0, // if year is missing or not a number, then set it to 0
      director: director ? director : "",
      actors: fixActors(actors),
      ...rest,
    };
  });
};

module.exports = { sortMovies, fixMoviesIfNecessary };
