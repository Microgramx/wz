import { FunctionComponent , useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FiChevronDown , FiChevronRight } from 'react-icons/fi'
import FilterByGenre from '../Explore/FilterByGenre'
import FilterByRating from '../Explore/FilterByRating'
import FilterByDate from "./FilterByDate";

interface FilterByProps {
  currentTab: string | null;
}

const FilterBy: FunctionComponent<FilterByProps> = ({ currentTab }) => {
  const [filter] = useAutoAnimate();
  const [openFilter , setOpenFilter] = useState(false)

  return (
    <div
      // @ts-ignore
      ref={filter}
      className="px-4 pt-3 bg-dark-lighten rounded-md mt-16"
    >
      <div className="flex justify-between items-center pb-4">
        <p className="text-lg text-white"> Filtro</p>
        <button onClick={() => setOpenFilter((prevState) => !prevState)}>
          {openFilter && <FiChevronDown size={20} />}
          {!openFilter && <FiChevronRight size={20} />}
        </button>
      </div>

      { openFilter && (
          <div className="py-3 border-t border-dark-darken"> 
             <p className="text-lg mb-4 text-white/80"> Gêneros  </p>
            <FilterByGenre currentTab={currentTab}/>

            <p className="text-lg mb-4 mt-4 text-white/80"> Runtime  </p>
            <FilterByRating/>

            <p className="text-lg mb-4 mt-4 text-white/80"> Data  </p>
            <FilterByDate/>
            </div>
      )}
    </div>
  );
};

export default FilterBy;
