import { useState, useEffect } from "react";

export default function useMovies(query) {
  const KEY = "bf604d44";
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
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
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
    [query]
  );
  return { movies, isLoading, error };
}
