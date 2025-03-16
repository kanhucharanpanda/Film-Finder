import { useState, useEffect } from "react";

export default function useMovies(query) {
  const KEY = process.env.REACT_APP_OMDB_API_KEY;
  const [movies, setMovies] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [error, setNewError] = useState("");
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setisLoading(true);
          setNewError(" ");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            {
              signal: controller.signal,
            }
          );
          if (!res.ok)
            throw new Error(
              "Something went wrong while fetching the movie Data"
            );
          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
          //  console.log(data.Search);
          setNewError("");
          //console.log(movies);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error(err.message);
            setNewError(err.message);
          }
        } finally {
          setisLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setNewError(" ");
        return;
      }
      //callBack();
      //handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    // eslint-disable-next-line
    [query]
  );
  return { movies, isLoading, error };
}
