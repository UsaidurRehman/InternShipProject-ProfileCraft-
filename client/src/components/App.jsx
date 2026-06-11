import Header from "./common/Header";
import Dashboard from "./Dashboard";
import { Outlet, useLocation } from "react-router-dom";
import "./common/common.css";
import "./Style/First.css";

function App() {
  const location = useLocation();
  const hideDashboard = location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {!hideDashboard && <Dashboard />}
        <Header />
        <div id="main-content">
          <Outlet />
        </div>
    </>
  );
}

export default App;
