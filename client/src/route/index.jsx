import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { Loader } from "lucide-react";
import App from "../App";

// Lazy load pages and layouts
const Home = lazy(() => import("../pages/Home"));
const Pricing = lazy(() => import("../pages/Pricing"));
const Start = lazy(() => import("../pages/Start"));
const AdminPanel = lazy(() => import("../pages/AdminPanel"));
const Setting = lazy(() => import("../pages/Setting"));
const Contact = lazy(() => import("../pages/Contact"));
const Attempt = lazy(() => import("../pages/Attempt"));
const Dashboard = lazy(() => import("../layout/Dashboard"));
const InterviewPage = lazy(() => import("../pages/InterviewPage"));
const About = lazy(() => import("../pages/about"));
const Profile = lazy(() => import("../pages/profile"));

const suspense = (Component) => (
  <Suspense fallback={
    <div className='flex items-center justify-center h-screen'>
      <Loader className='size-10 animate-spin' />
    </div>
  }>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: suspense(Home),
      },
      {
        path: "/about",
        element: suspense(About),
      },
      {
        path: "/pricing",
        element: suspense(Pricing),
      },
      {
        path: "/start",
        element: suspense(Start),
      },
      {
        path: "/setting",
        element: suspense(Setting),
      },
      {
        path: "/contact",
        element: suspense(Contact),
      },
      {
        path: "/interview/:id",
        element: suspense(InterviewPage),
      },
      {
        path: "/dashboard",
        element: suspense(Dashboard),
        children: [
          {
            path: "profile",
            element: suspense(Profile),
          },
          {
            path: "attempt",
            element: suspense(Attempt),
          },
          {
            path: "adminPanel",
            element: suspense(AdminPanel),
          },
        ],
      },
    ],
  },
]);

export default router; 
