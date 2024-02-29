import React, { FunctionComponent, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsFillEyeFill } from "react-icons/bs";
import { MdOutlineExplore } from "react-icons/md";
import { BiSearch, BiUserCircle } from "react-icons/bi";
import { BsBookmarkHeart, BsCameraVideo } from "react-icons/bs";
import { RiSlideshow4Line } from "react-icons/ri";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useAppSelector } from "../../store/hooks";

// Define os links desejados
const links = [
  { url: "/", icon: <BsFillEyeFill size={25} />, name: "Início" },
  { url: "/explore", icon: <MdOutlineExplore size={25} />, name: "Descobrir" },
  { url: "/search", icon: <BiSearch size={25} />, name: "Procurar" },
  { url: "/bookmarks", icon: <BsBookmarkHeart size={25} />, name: "Favoritos" },
  { url: "/recent", icon: <RiSlideshow4Line size={25} />, name: "Recentes" },
  { url: "/tv", icon: <BsCameraVideo size={25} />, name: "Séries" },
  { url: "/profile", icon: <BiUserCircle size={25} />, name: "Perfil" },
];

const MiniSidebar: FunctionComponent = () => {
  const location = useLocation();
  const user = useAppSelector((state) => state.user.user); // Obtém o usuário do estado global

  return (
    <div className="shrink-0 py-8 max-w-[80px] flex flex-col items-center justify-between h-screen sticky top-0 bg-opacity-40 bg-gray-800 backdrop-filter backdrop-blur-lg">
      <Link to="/">
        <BsFillEyeFill
          size={25}
          className="text-white transition-all duration-300 hover:text-red-500 hover:scale-110"
        />
      </Link>
      <div className="flex flex-col gap-3">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.url}
            className={`text-white flex items-center transition-all duration-300 hover:text-red-500 hover:scale-110`}
            style={{ transform: "translateX(-5px)" }}
            title={link.name}
          >
            {React.cloneElement(link.icon, {
              size: 30,
              className: "transition-all duration-300 hover:text-red-500 hover:scale-110",
              style: { boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)" }
            })}
          </Link>
        ))}
      </div>
      <button className="transition-all duration-300 transform hover:scale-110">
        <LazyLoadImage
          src={user ? (user.photoURL as string) : "/user.svg"} // Exibe a imagem do usuário se estiver disponível
          alt="User avatar"
          effect="blur"
          className="w-10 h-10 rounded-full"
        />
      </button>
    </div>
  );
};

export default MiniSidebar;
