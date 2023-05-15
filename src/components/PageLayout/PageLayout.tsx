import { Outlet } from "react-router-dom";
import "./PageLayout.scss";
import SideNav from "../SideNav/SideNav";
import logo from "/src/assets/logo.jpeg";
import { Fab } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MediaQuery from "react-responsive";

const PageLayout = () => {
  return (
    <>
      {/*<nav></nav>*/}
      <main>
        {/*<center>
          <header className="header">
            <img src={logo} style={{ width: 80, height: 80 }} />
            <h2 style={{ marginTop: "0px" }}>Aasma Slab Measurements</h2>
          </header>
        </center>
  */}
        <Outlet />

        <MediaQuery minWidth={1224}>
          <Fab
            style={{
              position: "fixed",
              left: "95%",
              bottom: "10%",
              marginRight: "30px",

              textAlign: "center",
            }}
            color="success"
            href="https://www.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon style={{ fontSize: "40px" }} />
          </Fab>
        </MediaQuery>
        <MediaQuery maxWidth={1223}>
          <Fab
            style={{
              position: "fixed",
              left: "80%",
              bottom: "10%",
              marginRight: "30px",

              textAlign: "center",
            }}
            color="success"
            href="https://www.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon style={{ fontSize: "40px" }} />
          </Fab>
        </MediaQuery>
      </main>

      <footer>
        <p>© Aasma Slab Measurements. All rights reserved.</p>
      </footer>
    </>
  );
};

export default PageLayout;
