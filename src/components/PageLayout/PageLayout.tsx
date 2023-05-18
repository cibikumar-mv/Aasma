import { Outlet } from "react-router-dom";
import "./PageLayout.scss";
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
              right: "-15px",
              bottom: "55px",
              marginRight: "30px",

              textAlign: "center",
            }}
            color="success"
            href="http://api.whatsapp.com/send?phone=+917802813843&text=Slab%20Measurement%20Estimate"
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
              right: "-25px",
              bottom: "55px",
              marginRight: "30px",

              textAlign: "center",
            }}
            color="success"
            href="http://api.whatsapp.com/send?phone=+917802813843&text=Slab%20Measurement%20Estimate"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon style={{ fontSize: "40px" }} />
          </Fab>
        </MediaQuery>
      </main>

      <footer>
        <p>Aasma Technology Solutions © 2023 - All rights reserved</p>
      </footer>
    </>
  );
};

export default PageLayout;
