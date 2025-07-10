import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Pricing from "../pages/Pricing";

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
            }
           
        ]
    }
])

export default router 