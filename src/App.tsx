import React, { useCallback, useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Explore from "./pages/Explore";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { useAppDispatch } from "./store/hooks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./shared/firebase";
import { setCurrentUser } from "./store/slice/userSlice";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./shared/firebase";
import Profile from "./pages/Profile";
import Movies from "./pages/Movies";
import TvShows from "./pages/TvShows";
import Search from "./pages/Search";
import Proctected from "./components/Common/Proctected";
import MovieDetail from "./pages/Movies/MovieDetail";
import Bookmark from "./pages/Bookmarked";
import Recent from "./pages/Recent";
import TvDetails from "./pages/Tv/TvDetails";
import MovieWatch from "./pages/Movies/MovieWatch";
import MovieWatch1 from "./pages/Movies/MovieWatch1";
import TvWatch from "./pages/Tv/TvWatch";
import TvWatch1 from "./pages/Tv/TvWatch1";
import { AppContext } from "./context";

function App() {
  const { isSignedIn, setIsSignedIn } = useContext(AppContext);
  const dispatch = useAppDispatch();

  const checkAuthState = useCallback(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        dispatch(setCurrentUser(null));
        setIsSignedIn(false);
        localStorage.setItem("isSignedIn", "0");
        return;
      }

      setIsSignedIn(true);
      localStorage.setItem("isSignedIn", "1");

      const userRef = doc(db, "users", user.uid);
      onSnapshot(userRef, (doc) => {
        const userData = doc.data();
        dispatch(
          setCurrentUser({
            email: user.email,
            displayName: userData ? userData.displayName : user.displayName,
            emailVerified: user.emailVerified,
            photoURL: userData ? userData.photoUrl : user.photoURL,
            uid: user.uid,
          })
        );
      });
    });
  }, [dispatch, setIsSignedIn]); // Dependências do useCallback

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]); // Dependência do useEffect

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/movie/:id/watch" element={ <MovieWatch /> } />
        <Route path="/movie/:id/watch2" element={<MovieWatch1 />} />
        <Route path="auth" element={<Auth />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="tv" element={<TvShows />} />
        <Route path="/tv/:id" element={<TvDetails />} />
        <Route path="tv/:id/watch" element={ <TvWatch /> } />
        <Route path="tv/:id/watch2" element={<TvWatch1 />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="profile"
          element={
            <Proctected isSignedIn={isSignedIn}>
              <Profile />
            </Proctected>
          }
        />
        <Route
          path="bookmarks"
          element={
            <Proctected isSignedIn={isSignedIn}>
              <Bookmark />
            </Proctected>
          }
        />
        <Route
          path="recent"
          element={
            <Proctected isSignedIn={isSignedIn}>
              <Recent />
            </Proctected>
          }
        />

      </Routes>
    </div>
  );
}

export default App;
