import { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import axiosFetch from "@/Utils/fetchBackend";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";

function capitalizeFirstLetter(string: string) {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
}

const MovieCardLarge = ({ data, media_type, genresMovie, genresTv }: any) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [genreListMovie, setGenreListMovie] = useState(genresMovie || []);
  const [genreListTv, setGenreListTv] = useState(genresTv || []);
  const [loading, setLoading] = useState(true);
  const [imagePlaceholder, setImagePlaceholder] = useState(false);
  const year = new Date(data?.release_date).getFullYear();
  const lang = data?.original_language;
  let Genres: Array<string> = [];

  data?.genre_ids?.map((ele: number) => {
    if (data?.media_type === "movie" || media_type === "movie") {
      genreListMovie?.map((val: any) => {
        if (val?.id === ele) {
          Genres.push(val?.name);
        }
      });
    } else if (data?.media_type === "tv" || media_type === "tv") {
      genreListTv?.map((val: any) => {
        if (val?.id === ele) {
          Genres.push(val?.name);
        }
      });
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gM = await axiosFetch({ requestID: "genresMovie" });
        const gT = await axiosFetch({ requestID: "genresTv" });
        setGenreListMovie(gM.genres);
        setGenreListTv(gT.genres);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!genresMovie || !genresTv) {
      fetchData();
    }
  }, [genresMovie, genresTv]);

  return (
    <Link
      key={data?.id}
      href={`${data?.media_type === "person" ? "/person?id=" + data?.id : "/detail?type=" + (data?.media_type || media_type) + "&id=" + data?.id}`}
      className={styles.MovieCardSmall}
      aria-label={data?.name || "poster"}
      data-tooltip-id="tooltip"
      data-tooltip-html={`${data?.title?.length > 50 || data?.name?.length > 50 ? data?.title || data?.name : ""}`}
    >
      <div
        className={`${styles.img} ${data?.poster_path !== null && data?.poster_path !== undefined ? "skeleton" : null}`}
      >
        <LazyLoadImage
          key={data?.id}
          src={`${imagePlaceholder ? "/images/logolmg.svg" : (data?.poster_path !== null && data?.poster_path !== undefined) || (data?.profile_path !== null && data?.profile_path !== undefined) || (data?.still_path !== null && data?.still_path !== undefined) ? process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + (data?.poster_path || data?.profile_path || data?.still_path) || null : "/images/logolmg.svg"}`}
          height="100%"
          width="100%"
          useIntersectionObserver={true}
          effect="opacity"
          className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
          onLoad={() => {
            setTimeout(() => {
              setImageLoading(false);
              setLoading(false);
            }, 100);
          }}
          loading="lazy"
          onError={(e) => {
            setImagePlaceholder(true);
            setImageLoading(false);
          }}
          alt={data?.id || "sm"}
        />
      </div>
      <div className={`${styles.metaData}`}>
        <h1>{data?.title || data?.name || <Skeleton count={2} />}</h1>
        <p>
          {capitalizeFirstLetter(data?.media_type || media_type)}
          {data?.vote_average ? ` • ${data?.vote_average.toFixed(1)}` : null}
          {!Number.isNaN(year) ? ` • ${year}` : null}{" "}
          {lang !== undefined ? ` • ${lang.toUpperCase()}` : null}
        </p>
        {Genres?.join(", ")}
      </div>
    </Link>
  );
};

export default MovieCardLarge;
