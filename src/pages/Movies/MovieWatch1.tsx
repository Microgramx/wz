import { useQuery } from "@tanstack/react-query";
import { getWatchMovie } from "../../services/movie";
import { useParams } from "react-router-dom";
import { getWatchReturnedType } from "../../shared/types";
import FilmWatch1 from "../../components/FilmWatch/FilmWatch1";

interface MovieWatchProps {}

const MovieWatch = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isError } = useQuery<getWatchReturnedType, Error>(
    ["watch-movie", id],
    () => getWatchMovie(Number(id))
  );

  if (isError) return <div>Error</div>;

  return <FilmWatch1 {...data} media_type="movie" />;
};

export default MovieWatch;
