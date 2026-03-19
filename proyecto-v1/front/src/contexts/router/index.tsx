import AppLayout from "@/pages/_app/_layout";
import HomePage from "@/pages/_app/home";
import LoginPage from "@/pages/_nonApp/login";
import RegisterPage from "@/pages/_nonApp/register";
import { createBrowserRouter } from "react-router-dom";
import NonAppLayout from "@/pages/_nonApp/_layout";
import GamePage from "@/pages/_app/game";
import HelpPage from "@/pages/_app/help";
import HelperPage from "@/pages/_app/helper";
import ProfilePage from "@/pages/_app/profile";
import AboutPage from "@/pages/_nonApp/about";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    element: <NonAppLayout />,
    children: [
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/game/:game_id",
        element: <GamePage />,
      },
      {
        path: "/help",
        element: <HelpPage />,
      },
      {
        path: "/helper",
        element: <HelperPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/profile/:user_id",
        element: <ProfilePage />,
      },
    ],
  },
]);
