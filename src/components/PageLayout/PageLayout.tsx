import { Outlet } from "react-router-dom";
import "./PageLayout.scss";
import {
  Divider,
  Fab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Toolbar,
  createTheme,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MediaQuery from "react-responsive";
import Drawer from "@mui/material/Drawer";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const PageLayout = () => {
  return (
    <>
      {/*<nav></nav>*/}
      <ThemeProvider theme={darkTheme}>
        <Drawer
          sx={{
            width: 170,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 170,
              boxSizing: "border-box",
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="New Form" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          <List>
            {[
              "Cibi_19-05-2023",
              "Cibi_18-05-2023",
              "Cibi_09-05-2023",
              "Cibi_21-04-2023",
            ].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
      </ThemeProvider>
      <main>
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
