import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Pricing from "../pages/Pricing";
import Start from "../pages/Start";
import AdminPanel from "../pages/AdminPanel";
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
        element: <div>about</div>,
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
        path: "/admin-panel",
        element: <AdminPanel />,
      },
    ],
  },
]);

export default router;
