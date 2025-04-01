import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePages";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import StoryPage from "./pages/stories/StoryPage";
import ChatPage from "./pages/chat/ChatPage";
import SavePostPage from "./pages/savedpost/SavePostPage";
import FollowFollowingPage from "./pages/followfollowing/FollowFollowingPage";
import SinglePostPage from "./components/common/SinglePostPage";
import NotFoundPage from "./pages/notfound/NotFoundPage";
import NotFoundTwo from "./pages/notfound/NotFoundTwo";
import ResetPasswordPage from "./pages/auth/resetPassword/ResetPaswordPage";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
        });
        const data = await response.json();
        if (data.error) return null;
        if (!response.ok) {
          throw new Error(data.error || "Failed to get user");
        }
        console.log("authUser is here : ", data);
        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const location = useLocation();
  const nottoshowRightSide = ["/stories", "/chat", "/saved","/reset_password"];
  const shouldShowRightSide = !nottoshowRightSide.includes(location.pathname);
  const validPaths = [
    "/",
    "/login",
    "/signup",
    "/notifications",
    "/profile",
    "/stories",
    "/chat",
    "/saved",
    "/follower_following",
    "/post",
    "/reset_password",
  ];

  // Check if the current path matches any valid paths, considering dynamic segments
  const isNotFound = !validPaths.some((path) => {
    const regex = new RegExp(`^${path}(/|$)`);
    return regex.test(location.pathname);
  });

  // console.log(location.pathname);
  // console.log("isNotFound:", isNotFound);

  return isNotFound ? (
    <NotFoundTwo />
  ) : (
    <div className="flex max-w-6xl mx-auto">
      {authUser && !isNotFound && <Sidebar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/stories"
          element={authUser ? <StoryPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/saved"
          element={authUser ? <SavePostPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/follower_following/:feed_type"
          element={
            authUser ? <FollowFollowingPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/post/:username/:postId"
          element={authUser ? <SinglePostPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/reset_password"
          element={!authUser ? <ResetPasswordPage /> : <Navigate to="/" />}
        />
        <Route path="*" element={<NotFoundTwo />} />
      </Routes>
      {authUser && !isNotFound && shouldShowRightSide && <RightPanel />}
      <Toaster />
    </div>
  );
}

export default App;
