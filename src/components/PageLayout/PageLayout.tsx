import { Outlet } from "react-router-dom";
import "./PageLayout.scss";
import SideNav from "../SideNav/SideNav";
import logo from "/src/assets/logo.jpeg";

const PageLayout = () => {
  return (
    <>
      <nav></nav>
      <main>
        {/*<center>
          <header className="header">
            <img src={logo} style={{ width: 80, height: 80 }} />
            <h2 style={{ marginTop: "0px" }}>Aasma Slab Measurements</h2>
          </header>
        </center>
  */}
        <Outlet />
      </main>
      <footer>
        <p>© Aasma Slab Measurements. All rights reserved.</p>
      </footer>
    </>
  );
};

export default PageLayout;
