import { Outlet } from "react-router-dom";
import "./PageLayout.scss";
import { Box, Fab, ThemeProvider, createTheme } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MediaQuery from "react-responsive";
import SideNav from "../SideNav/SideNav";
import SideBar from "../SideBar/SideBar";
import { FormContext } from "../../contexts/FormContext";
import logo from "/src/assets/aasmalogonew.png";
import LinearProgress from "@mui/material/LinearProgress";
import { useContext } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#13C9F1",
    },
    secondary: {
      main: "#FFA500",
    },
  },
});

const PageLayout = () => {
  const { loading } = useContext(FormContext);
  return (
    <>
      <div className="navbar">
        <MediaQuery minWidth={1224}>
          <SideNav />
        </MediaQuery>
        <MediaQuery maxWidth={1223}>
          <SideBar />
        </MediaQuery>
      </div>
      <main>
        {loading ? (
          <div
            className="loading"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              WebkitTransform: "translate(-50%,-50%)",
              transform: "translate(-50%,-50%)",
            }}
          >
            <center>
              <a
                href="http://www.aasmatech.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={logo} style={{ width: 202, height: 60, margin: 0 }} />
              </a>
              <Box sx={{ width: 202 }}>
                <ThemeProvider theme={theme}>
                  <LinearProgress color="primary" />
                </ThemeProvider>
              </Box>
            </center>
          </div>
        ) : (
          <>
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
          </>
        )}
      </main>
      <MediaQuery minWidth={1224}>
        <footer>
          <p style={{ marginTop: "5px" }}>Made with ❤️ in India</p>
          <p>
            <a
              href="http://www.aasmatech.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Aasma Technology Solutions
            </a>{" "}
            © 2023 - All rights reserved
          </p>
        </footer>
      </MediaQuery>
    </>
  );
};

export default PageLayout;
