import { createRoot } from "react-dom/client";
import App from "./components/App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Templates from "./components/Templates.jsx";
import Options from "./components/Options.jsx"
import Staperds from "./components/Staperds.jsx";
import CVList from "./components/CVList.jsx";
import JobListing from "./components/JobListing.jsx";
import Aboutus from "./components/Aboutus.jsx";
import Auth from "./auth/Auth.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Auth />
      },
      {
        path: "/options",
        element: <Options />
      },
      {
        path: "/steperdas",
        element: <Staperds />
      },
      {
        path: "/Templates",
        element: <Templates />
      },
      {
        path: "/CVList",
        element: <CVList />
      },
      {
        path: "/jobListings",
        element: <JobListing />
      },
      {
        path:"/aboutus",
        element:<Aboutus/>
      }
    ]
  }
]);

const root = createRoot(document.querySelector("#root"));
root.render(<RouterProvider router={router} />);
