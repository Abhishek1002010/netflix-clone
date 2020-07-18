import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";

import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base = "https://image.tmdb.org/t/p/original/";
function Row({ title, fetchUrl, isLarge }) {
  const [movies, setMovies] = useState([]);
  const [trailer, setTrailer] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      console.log(request);
      setMovies(request.data.results);
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1
    }
  };

  const setTrailerFunc = movie => {
    if (trailer) setTrailer("");
    else {
      movieTrailer(
        movie?.title || movie?.name || movie?.original_name || ""
      ).then(url => {
        const param = new URLSearchParams(new URL(url).search);
        setTrailer(param.get("v"));
      });
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row_posters">
        {movies.map(movie => (
          <img
            key={movie.id}
            onClick={() => setTrailerFunc(movie)}
            className={`row_poster ${isLarge && "row_posterLarge"}`}
            src={`${base}${isLarge ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailer && <YouTube videoId={trailer} opts={opts} />}
    </div>
  );
}

export default Row;
