import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Pricing from "../pages/Pricing";
import Start from "../pages/Start";
import Setting from "../pages/Setting";
import Contact from "../pages/Contact"
import Attempt from "../pages/Attempt";
import Dashboard from "../layout/Dashboard";

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
            },
            {
                path: '/contact',
                element: <Contact />

            },
            {
                path: '/dashboard',
                element: <Dashboard/>,
                children: [
                    {
                        path: 'profile',
                        element: <div>Profie</div>
                    },
                    {
                        path : 'attempt',
                        element: <Attempt/>
                    },
                    {
                        path: 'adminPannal',
                        element: <div>Admin Pannal</div>
                    }
                ]
            },
           
        ]
    }
])

export default router 
