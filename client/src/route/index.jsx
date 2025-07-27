import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import { Loader } from "lucide-react";
import App from "../App";
import AdminPremission from "../layout/AdminPremission";
import AuthUserPermission from "../layout/AuthUserPremission";

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
const Profile = lazy(() => import("../pages/profile"));
const SocialLayout = lazy(() => import("../layout/SocialLayout"));
const Posts = lazy(() => import("../pages/Posts"));
const Leaderboard = lazy(() => import("../pages/Leaderboard"));

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
        path: "/pricing",
        element: suspense(Pricing),
      },
      {
        path: "/start",
        element: <AuthUserPermission>{suspense(Start)}</AuthUserPermission> ,
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
        path:"/social",
        element:suspense(SocialLayout),
        children:[
          {
            path:"post",
            element:suspense(Posts),
          },
          {
            path:"leaderboard",
            element:suspense(Leaderboard),
          }          
        ]
      },
      {
        path: "/interview/:id",
        element:<AuthUserPermission>{suspense(InterviewPage)}</AuthUserPermission>,
      },
      {
        path: "/dashboard",
        element: <AuthUserPermission>{suspense(Dashboard)}</AuthUserPermission>,
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
            element: (<AdminPremission>{suspense(AdminPanel)}</AdminPremission>),
          },
        ],
      },
    ],
  },
]);

export default router;
