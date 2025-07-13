import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Pricing from "../pages/Pricing";
import Start from "../pages/Start";
import AdminPanel from "../pages/AdminPanel";
import Setting from "../pages/Setting";
import Contact from "../pages/Contact";
import Attempt from "../pages/Attempt";
import Dashboard from "../layout/Dashboard";
import InterviewPage from "../pages/InterviewPage";
import About from "../pages/about";
import Profile from "../pages/profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/start",
        element: <Start />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/interview/:id",
        element: <InterviewPage />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "attempt",
            element: <Attempt />,
          },
          {
            path: "adminPanel",
            element:<AdminPanel/>
          },
        ],
      },
    ],
  },
]);

export default router; 
