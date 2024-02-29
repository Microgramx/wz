import React, { FunctionComponent, useEffect, useState } from "react";
import Footer from "../components/Common/Footer";
import Title from "../components/Common/Title";
import FilmListForBookmarkedAndRecent from "../components/FilmListForBookmarkedAndRecent/FilmListForBookmarkedAndRecent";
import { Items } from "../shared/types";
import { useAppSelector } from "../store/hooks";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../shared/firebase";

interface BookmarkProps {}

const Bookmark: FunctionComponent<BookmarkProps> = () => {
  const user = useAppSelector((state) => state.user.user);
  const [bookmarkFilms, setBookmarkFilms] = useState<Items[]>([]);
  const [loading, setLoading] = useState(!Boolean(bookmarkFilms?.length));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, "users", user?.uid),
      (doc) => {
        setBookmarkFilms(doc.data()?.bookmarks.slice().reverse());
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching bookmarks:", error);
        setError("Error fetching bookmarks");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (error) return <div>Error: {error}</div>;
  
  return (
    <>
      <div>
        <Title value="Bookmark | Stream" />
        <FilmListForBookmarkedAndRecent
          films={bookmarkFilms}
          loading={loading}
          pageType="Bookmark"
        />
        <Footer />
      </div>
    </>
  );
};

export default Bookmark;
