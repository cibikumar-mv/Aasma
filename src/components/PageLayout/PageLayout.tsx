import { Outlet } from "react-router-dom";
import "./PageLayout.scss";
import {
  Button,
  Divider,
  Fab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  createTheme,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MediaQuery from "react-responsive";
import Drawer from "@mui/material/Drawer";
import GoogleIcon from "@mui/icons-material/Google";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import React from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const PageLayout = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    console.log("yes");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
            <ListItemButton
              style={{
                padding: 4,
                margin: 8,
                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "grey",
                borderRadius: "8px",
              }}
            >
              <ListItemIcon
                style={{ padding: 5, minWidth: 0, width: 18, height: 18 }}
              >
                <AddIcon style={{ height: 18, width: 18 }} />
              </ListItemIcon>
              <ListItemText primary="New Form" style={{ fontSize: "8px" }} />
            </ListItemButton>
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
          <div style={{ marginTop: "auto", marginBottom: 8 }}>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleClose}>
                {" "}
                <ListItemIcon>
                  <DeleteOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Clear Forms</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
            <center>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                startIcon={<GoogleIcon fontSize="small" />}
                endIcon={<MoreHorizIcon fontSize="small" />}
                style={{
                  fontSize: "14px",
                  width: 160,
                  color: "#ffffff",
                  textTransform: "none",
                }}
              >
                Sukirtharajan
              </Button>
            </center>
          </div>
          {/* <div style={{ marginTop: "auto" }}>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
            <List>
              <ListItemButton
                style={{ padding: 4 }}
                onClick={() => handleClick}
              >
                <ListItemIcon
                  style={{ padding: 5, minWidth: 0, width: 18, height: 18 }}
                >
                  <GoogleIcon style={{ height: 18, width: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Sukirtharajan"
                  style={{ fontSize: "8px" }}
                />
                <ListItemIcon
                  style={{ padding: 3, minWidth: 0, width: 18, height: 18 }}
                >
                  <MoreHorizIcon style={{ height: 18, width: 18 }} />
                </ListItemIcon>
              </ListItemButton>
            </List>
            </div> */}
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
