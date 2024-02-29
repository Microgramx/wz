import { FC, useState, useEffect } from "react";
import { useCurrentViewPort } from "../components/hooks/useCurrentViewPort";
import { getExploreMovie } from "../services/explore";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ItemsPage } from "../shared/types";
import { Link } from "react-router-dom";
import Sidebar from "../components/Common/Sidebar";
import MiniSidebar from "../components/Common/MiniSidebar";
import Title from "../components/Common/Title";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import InfiniteScroll from 'react-infinite-scroll-component';
import FilmItem from "../components/Common/FilmItem";

interface MoviesProps {}

const Movies: FC<MoviesProps> = () => {
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const { isMobile } = useCurrentViewPort();
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState<number | null>(null);
  
  useEffect(() => {
    const checkIfScrollButtonShowUp = () => {
      const scrollOffset = document.documentElement.scrollTop;
      setShowScrollBtn(scrollOffset > 1000);
    };
    window.addEventListener("scroll", checkIfScrollButtonShowUp);
    return () => window.removeEventListener("scroll", checkIfScrollButtonShowUp);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleMouseEnter = (itemId: number) => {
    const timeoutId = setTimeout(() => {
      setHoveredItemId(itemId);
    }, 650); // Tempo de delay em milissegundos
    return () => clearTimeout(timeoutId);
  };

  const handleMouseLeave = () => {
    setHoveredItemId(null);
  };

  const {
    data: movies,
    error: errorMovies,
    fetchNextPage: fetchNextPageMovie,
    hasNextPage: hasNextPageMovie,
  } = useInfiniteQuery<ItemsPage, Error>(
    ["explore-result-movie"],
    ({ pageParam = 1 }) => getExploreMovie(pageParam),
    {
      getNextPageParam: (lastPage) =>
        lastPage.page + 1 <= lastPage.total_pages
          ? lastPage.page + 1
          : undefined,
    }
  );

  if (errorMovies) return <div> Error : {errorMovies.message} </div>;

  return (
    <>
      <Title value="Movie | Stream" />

      {showScrollBtn && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-10 right-10 z-10 bg-white bg-opacity-30 rounded-full p-3 transition duration-500 backdrop-blur-lg ${
            showScrollBtn ? "opacity-100" : "opacity-0"
          }`}
        >
          <BsFillArrowUpCircleFill
            size={35}
            className="text-black hover:text-gray-800 transition duration-300"
          />
        </button>
      )}

      <div className="flex justify-between items-center my-4 px-4 md:hidden backdrop-blur-lg">
        <Link to="/">
          <div className="uppercase font-medium text-lg tracking-widest text-white">
            {" "}
            Stream{" "}
          </div>
        </Link>
        <button onClick={() => setIsSidebarActive((prevState) => !prevState)}>
          <FaBars size={25} className="text-white" />
        </button>
      </div>

      <div className="flex flex-col-reverse md:flex-row">
        {isMobile ? (
          <Sidebar
            setIsSidebarOpen={setIsSidebarActive}
            isSidebarOpen={isSidebarActive}
          />
        ) : null}
        {!isMobile ? <MiniSidebar /> : null}

        <div className="flex-grow px-[2vw] pt-6">
          {movies?.pages.reduce(
            (acc, current) => [...acc, current.results],
            [] as any
          ).length === 0 ? (
            <div>No such movies</div>
          ) : (
            <InfiniteScroll
              dataLength={movies?.pages.length || 0}
              next={() => fetchNextPageMovie()}
              hasMore={Boolean(hasNextPageMovie)}
              loader={<div>Loading more</div>}
              endMessage={<></>}
            >
              <div className="">
                {movies?.pages.map((page) => {
                  const { results } = page;
                  return (
                    <ul className="grid grid-cols-sm lg:grid-cols-lg gap-x-8 gap-y-10 pt-2" key={page.page}>
                      {results.map((item) => (
                        <li key={item.id} 
                            onMouseEnter={() => handleMouseEnter(item.id)} 
                            onMouseLeave={handleMouseLeave}
                            className={`relative group transition duration-300 rounded-lg overflow-hidden ${
                              hoveredItemId === item.id ? 'transform scale-105' : ''
                            }`}
                        >
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <FilmItem item={item} />
                        </li>
                      ))}
                    </ul>
                  );
                })}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  );
};

export default Movies;
