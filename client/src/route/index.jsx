import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Pricing from "../pages/Pricing";
import Start from "../pages/Start";
import Setting from "../pages/Setting";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path:"/about",
                element:<div>about</div>
            },
            {
                path:"/pricing",
                element:<Pricing/>
            },
            {
                path:"/start",
                element:<Start/>
            },
            {
                path:"/setting",
                element:<Setting/>
            }
           
        ]
    }
])

export default router 