import { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";

const MovieCardSmall = ({ data, media_type }: any) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const cachedImageUrl = localStorage.getItem(`image_${data?.id}`);
    if (cachedImageUrl) {
      setImageUrl(cachedImageUrl);
      setImageLoading(false);
    } else {
      const imgSrc = process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + data?.poster_path;
      setImageUrl(imgSrc);
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        localStorage.setItem(`image_${data?.id}`, imgSrc);
        setImageLoading(false);
      };
      img.onerror = (e) => {
        console.error("Image failed to load:", e);
      };
    }
  }, [data]);

  return (
    <Link
      key={data?.id}
      href={`/detail?type=${media_type}&id=${data?.id}`}
      className={styles.MovieCardSmall}
      aria-label={data?.name || "poster"}
    >
      <div className={`${styles.img} ${imageLoading ? "skeleton" : "loaded"}`}>
        <AnimatePresence mode="sync">
          {imageLoading && <Skeleton width="100%" height="100%" />}
          <motion.img
            key={data?.id}
            src={imageUrl || ""}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoading ? 0 : 1 }}
            height="100%"
            width="100%"
            exit="exit"
            loading="lazy"
            onError={(e) => console.log(e)}
            alt={data?.title || data?.name || "sm"}
          />
        </AnimatePresence>
      </div>
      <p>{data?.title || data?.name}</p>
    </Link>
  );
};

export default MovieCardSmall;
