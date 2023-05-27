import Drawer from "@mui/material/Drawer";
import GoogleIcon from "@mui/icons-material/Google";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Button,
  Divider,
  List,
  IconButton,
  TextField,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useContext, useEffect, useState } from "react";
import { auth, db, googleProvider } from "../../firebase-config";
import { signInWithPopup, signOut } from "firebase/auth";
import { FormContext } from "../../contexts/FormContext";
import CreateIcon from "@mui/icons-material/Create";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useForm } from "react-hook-form";
const SideNav = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { setFormData, user, formList, fetchData, newForm, formData } =
    useContext(FormContext);
  const { register, getValues } = useForm();
  const handleGoogleClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (user) {
      setAnchorEl(event.currentTarget);
    } else {
      await signInWithPopup(auth, googleProvider);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    await signOut(auth);
    setAnchorEl(null);
  };
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const [maxch] = useState("20ch");

  const [action, setaction] = useState("false");
  const [enableText, setenableText] = useState("false");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [snackBar, setSnackBar] = useState({ open: false, title: "" });

  const handleDelete = async () => {
    setaction("false");
    await deleteDoc(doc(db, `users/${user?.uid}/forms/${formData.id}`));
    await fetchData();
    newForm();
    setSnackBar({ open: true, title: "Record Deleted Successfully!" });
  };

  const handleTitleEdit = async (i: number) => {
    const { id, ...postData } = formData;

    console.log("post:", postData, getValues(`title${i}`));
    setenableText("false");
    setaction("false");
    await updateDoc(doc(db, `users/${user?.uid}/forms/${formData.id}`), {
      ...postData,
      title: getValues(`title${i}`),
    });
    await fetchData();
    setSnackBar({ open: true, title: "Title updated Successfully!" });
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleSetForm = (form: any) => {
    const { rows, id, title, ...data } = form;
    setFormData({ rows, data, id, title });
  };

  useEffect(() => {
    console.log("formList:", formList);
    console.log("formData:", formData);
    const index = formList.findIndex((form: any) => form.id === formData.id);
    console.log("index:", index);
    setSelectedIndex(index);
  }, [formData, formList]);

  return (
    <>
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
              onClick={() => {
                setSelectedIndex(-1);
                newForm();
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
          {user && <Divider />}
          {!user && (
            <Typography>Please Sign in to save your records.</Typography>
          )}
          <List>
            {formList.map((form: any, index: number) => (
              <ListItem
                key={form.id}
                disablePadding
                onClick={() => {
                  handleSetForm(form);
                }}
              >
                <ListItemButton
                  style={{
                    padding: 5,
                    alignItems: "center",
                    height: 50,
                    width: 170,
                  }}
                  selected={selectedIndex === index}
                >
                  {selectedIndex === index && enableText === "true" ? (
                    <TextField
                      margin="dense"
                      defaultValue={form.title}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: 30,
                        },
                      }}
                      {...register(`title${index}`)}
                    />
                  ) : (
                    <Tooltip title={form.title}>
                      <ListItemText
                        primary={form.title}
                        primaryTypographyProps={{
                          fontSize: "14px",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          maxWidth: maxch,
                        }}
                      />
                    </Tooltip>
                  )}

                  {selectedIndex === index ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "nowrap",
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      {action === "false" ? (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          <IconButton
                            onClick={() => {
                              setaction("edit");
                              setenableText("true");
                            }}
                          >
                            <CreateIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setaction("delete");
                            }}
                          >
                            <DeleteForeverIcon fontSize="small" />
                          </IconButton>
                        </div>
                      ) : null}

                      {action === "edit" ? (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          <IconButton
                            onClick={() => {
                              handleTitleEdit(index);
                            }}
                          >
                            <DoneIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setaction("false");
                              setenableText("false");
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </div>
                      ) : null}

                      {action === "delete" ? (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            padding: 0,
                            margin: 0,
                          }}
                        >
                          <IconButton onClick={handleDelete}>
                            <DoneIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setaction("false");
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {user && formList.length > 0 && <Divider />}
          <div style={{ marginTop: "auto", marginBottom: 8 }}>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              open={open}
              onClose={handleClose}
              sx={{ marginBottom: 33 }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <DeleteOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Clear Forms</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
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
                onClick={handleGoogleClick}
                startIcon={!user && <GoogleIcon fontSize="small" />}
                endIcon={user && <MoreHorizIcon fontSize="small" />}
                style={{
                  fontSize: "14px",
                  width: 160,
                  color: "#ffffff",
                  textTransform: "none",
                }}
              >
                {user ? user.displayName : "Google Sign In"}
              </Button>
            </center>
          </div>
        </Drawer>
      </ThemeProvider>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackBar.open}
        autoHideDuration={5000}
        onClose={() => {
          setSnackBar({ open: false, title: "" });
        }}
      >
        <Alert
          onClose={() => {
            setSnackBar({ open: false, title: "" });
          }}
          severity="success"
        >
          {snackBar.title}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SideNav;
