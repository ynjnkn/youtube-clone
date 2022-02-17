import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as userActions } from "./redux/modules/user";
import { setCookie, getCookie, deleteCookie } from "./utils/cookie";
import axios from "axios";

import NavBar from "./components/views/NavBar/NavBar";
import LandingPage from "./components/views/LandingPage/LandingPage.js";
import LoginPage from "./components/views/LoginPage/LoginPage.js";
import RegisterPage from "./components/views/RegisterPage/RegisterPage.js";
import VideoUploadPage from "./components/views/VideoUploadPage/VideoUploadPage";
import VideoDetailPage from "./components/views/VideoDetailPage/VideoDetailPage";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userToken = getCookie("user");
  console.log("user", user);
  console.log("userToken", userToken);

  useEffect(() => {
    // 리덕스에 사용자 정보가 없지만 쿠키에는 있다면? 로그인 실행
    // if (!user && userToken) {
    if (userToken) {
      dispatch(userActions.logIn(userToken));
    }
    // 리덕스에 사용자 정보가 있지만 쿠키에 없다면? 로그인 정보 초기화
    // if (user && !userToken) {
    else {
      dispatch(userActions.logOut());
    };
    // }, [dispatch, user, userToken]);
  }, []);

  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/video/upload" element={<VideoUploadPage />} />
          <Route path="/video/:videoId" element={<VideoDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter >
  );
}

export default App;


