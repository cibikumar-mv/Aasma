import { useState, useEffect, useRef, useContext } from "react";
import "./Slab.scss";
import {
  Grid,
  TextField,
  Paper,
  Box,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Radio,
  RadioGroup,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Divider,
  Snackbar,
  DialogContentText,
  Alert,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Controller, useForm } from "react-hook-form";
import useExitPrompt from "../../hooks/useExitPrompt";
import PdfFile from "../../components/PdfFile";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import logo from "/src/assets/aasmalogonew.png";
import invoicePic from "/src/assets/aasmabg2.jpg";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MediaQuery from "react-responsive";
import CloseIcon from "@mui/icons-material/Close";
import { analytics, auth, db, googleProvider } from "../../firebase-config";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { FormContext } from "../../contexts/FormContext";
import GoogleIcon from "@mui/icons-material/Google";
import { signInWithPopup } from "firebase/auth";
import { initialState } from "../../contexts/FormContext";
import { logEvent } from "firebase/analytics";

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

enum Convert {
  FeetToMeter = 0.09290304,
  CmtoMeter = 0.0001,
  InchToMeter = 0.00064516,
  MeterToFeet = 1,
  CmtoFeet = 0.00108,
  InchToFeet = 0.00694,
}

export interface tableData {
  id: number;
  srno: number;
  length: string;
  width: string;
  sqFeet: any;
  area: any;
}

const obj: tableData = {
  id: 1,
  srno: 1,
  length: "0",
  width: "0",
  sqFeet: 0,
  area: 0,
};

const Slab = () => {
  const {
    formData,
    user,
    fetchData,
    formList,
    setFormData,
    isInitialAdd,
    idCounter,
  } = useContext(FormContext);

  const lastEditedIndex = useRef(-1);
  const showMaxAlert = useRef(true);

  const [showPDF, setShowPDF] = useState(false);
  const [pdfRows, setPdfRows] = useState<any>([]);
  const [snackBar, setSnackBar] = useState({ open: false, title: "" });
  const [rows, setRows] = useState<tableData[]>(formData.rows);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);

  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(true);

  const { register, reset, watch, getValues, setValue, control } = useForm({
    defaultValues: formData.data,
  });
  const watchPrice = watch("pricePerSqFeet");
  const watchtTotalArea = watch("totalSqFeet");
  const watchTotalAreaUnit = watch("totalAreaUnit");
  const watchMeasurementUnit = watch("measurementUnit");

  useEffect(() => {
    convertArea();
  }, [watchTotalAreaUnit, watchMeasurementUnit]);

  useEffect(() => {
    setValue(
      "totalCost",
      Math.round(getValues("pricePerSqFeet") * getValues("totalSqFeet") * 100) /
        100
    );
  }, [watchPrice, watchtTotalArea]);

  useEffect(() => {
    reset(formData.data);
    setRows(formData.rows);
  }, [formData]);

  const convertArea = () => {
    const aUnit = getValues("totalAreaUnit");
    const mUnit = getValues("measurementUnit");
    let area = 0;
    setRows((prev) => {
      switch (mUnit) {
        case "centimeter":
          prev.map((row) => {
            if (!isNaN(row.sqFeet)) {
              area =
                row.sqFeet *
                (aUnit === "Feet" ? Convert.CmtoFeet : Convert.CmtoMeter);
              row.area = Math.round(area * 100) / 100;
            }
          });
          break;
        case "feet":
          prev.map((row) => {
            if (!isNaN(row.sqFeet)) {
              area =
                row.sqFeet *
                (aUnit === "Feet" ? Convert.MeterToFeet : Convert.FeetToMeter);
              row.area = Math.round(area * 100) / 100;
            }
          });
          break;
        case "inches":
          prev.map((row) => {
            if (!isNaN(row.sqFeet)) {
              area =
                row.sqFeet *
                (aUnit === "Feet" ? Convert.InchToFeet : Convert.InchToMeter);
              row.area = Math.round(area * 100) / 100;
            }
          });
          break;
        default:
          break;
      }
      calculateTotalArea();
      return [...prev];
    });
  };

  const createRows = (count: number, pdf?: number) => {
    if (count === -1) {
      idCounter.current = 0;
      return [{ ...obj }];
    }
    const array = [];
    if (pdf) {
      for (let i = 0; i < count; i++) {
        pdf += 1;
        array.push({ ...obj, id: pdf, srno: pdf });
      }
      return array;
    }
    if (isInitialAdd.current) {
      if (parseInt(getValues("addRows")) === 0) {
        idCounter.current = 1;
      } else {
        idCounter.current = parseInt(getValues("startingRow")) - 1;
      }

      isInitialAdd.current = false;
      for (let i = 0; i < count; i++) {
        idCounter.current += 1;
        array.push({ ...obj, id: idCounter.current, srno: idCounter.current });
      }
      return array;
    }

    for (let i = 0; i < count; i++) {
      idCounter.current += 1;
      array.push({ ...obj, id: idCounter.current, srno: idCounter.current });
    }

    return array;
  };

  const handleRepeatValues = () => {
    let count = parseInt(getValues("repeatCount"));

    count =
      count + (lastEditedIndex.current + 1) > rows.length
        ? rows.length - (lastEditedIndex.current + 1)
        : count;
    if (lastEditedIndex.current === -1) {
      return;
    }
    setRows((prev) => {
      for (let i = 1; i <= count; i++) {
        prev[lastEditedIndex.current + i].length =
          prev[lastEditedIndex.current].length;
        prev[lastEditedIndex.current + i].width =
          prev[lastEditedIndex.current].width;
        prev[lastEditedIndex.current + i].area =
          prev[lastEditedIndex.current].area;
        prev[lastEditedIndex.current + i].sqFeet =
          prev[lastEditedIndex.current].sqFeet;
      }
      return [...prev];
    });
    calculateTotalArea();
  };

  const handleKeyDown = () => {
    // const keyCode = event.keyCode || event.which;
    // const keyValue = String.fromCharCode(keyCode);
    // // Prevent typing of negative symbol (minus sign)
    // if (keyValue === '-') {
    //   event.preventDefault();
    // }
  };

  const handleInputChange = (event: any) => {
    const value = event.target.value;
    event.target.value = Math.abs(value);
  };

  const handleAddRow = (count: any | null) => {
    if (count) {
      const totalCount = isInitialAdd.current
        ? rows.length + parseInt(count) - 1
        : rows.length + parseInt(count);

      if (totalCount > 700) {
        alert("Maximum limit of 700 reached");
        return;
      }
      if (totalCount > 10 && !user) {
        setShowGoogleLogin(true);
        return;
      }
      if (isInitialAdd.current) {
        setRows(createRows(count));
      } else {
        setRows((prevRows) => [...prevRows, ...createRows(count)]);
      }
    } else {
      if (!showExitPrompt) {
        setShowExitPrompt(true);
      }
      reset(initialState.data);
      setRows(createRows(-1));
      isInitialAdd.current = true;
      idCounter.current = 1;
    }
  };

  const calculateTotalArea = () => {
    let total = 0;
    rows.forEach((row) => {
      if (!isNaN(row.area)) {
        total += row.area;
      }
    });

    if (
      showMaxAlert.current &&
      getValues("maxSqFeet") != 0 &&
      total >= getValues("maxSqFeet") * 0.9
    ) {
      // setShowAlert(true);
      alert(`Total sq ${watchTotalAreaUnit} reaches near to your limit!`);
      showMaxAlert.current = false;
    }
    setValue("totalSqFeet", Math.round(total * 100) / 100);
  };

  const getLastFilledIndex = () => {
    let idx = -1;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].length != "0" && rows[i].width != "0") {
        idx = i;
      }
    }
    return idx + 1;
  };

  const handleDownloadPDF = async () => {
    const lastFilledIdx = getLastFilledIndex();
    if (lastFilledIdx === 0) {
      alert("Please fill atleast 1 record");
      return;
    }
    logEvent(analytics, "pdf_download");

    if (user) {
      await handleSave();
    }
    let netTotal = 0;
    let dataLen = rows.length;
    const pageRows = [];

    const pages = Math.ceil(lastFilledIdx / 70);
    for (let i = 0; i < pages; i++) {
      let pageTotal = 0;
      if (dataLen >= 70) {
        dataLen = dataLen - 70;
        rows.slice(i * 70, (i + 1) * 70).forEach((row) => {
          if (!isNaN(row.area)) {
            pageTotal += row.area;
          }
        });
        netTotal = pageTotal + netTotal;
        const obj = {
          rows: rows.slice(i * 70, (i + 1) * 70),
          pageTotal: Math.round(pageTotal * 100) / 100,
          pageCost:
            Math.round(getValues("pricePerSqFeet") * pageTotal * 100) / 100,
          netTotal: Math.round(netTotal * 100) / 100,
          netCost:
            Math.round(getValues("pricePerSqFeet") * netTotal * 100) / 100,
        };
        pageRows.push(obj);
      } else {
        const dataRows = rows.slice(dataLen * -1);
        dataRows.forEach((row) => {
          if (!isNaN(row.area)) {
            pageTotal += row.area;
          }
        });
        netTotal = pageTotal + netTotal;
        const padRows = createRows(
          71 - dataRows.length,
          dataRows[dataRows.length-1].srno
        );
        const obj = {
          rows: dataRows.concat(padRows),
          pageTotal: Math.round(pageTotal * 100) / 100,
          pageCost:
            Math.round(getValues("pricePerSqFeet") * pageTotal * 100) / 100,
          netTotal: Math.round(netTotal * 100) / 100,
          netCost:
            Math.round(getValues("pricePerSqFeet") * netTotal * 100) / 100,
        };
        pageRows.push(obj);
      }
    }
    setPdfRows(pageRows);
    setShowPDF(true);
  };

  const handleSave = async () => {
    if (rows.length === 1 && rows[0].length === "0" && rows[0].width === "0") {
      alert("Please fill atleast 1 record");
      return;
    }

    const postObj = {
      ...getValues(),
      rows,
      title: formData.title
        ? formData.title
        : getValues("partyName") + "_" + getValues("date"),
    };

    if (formData.id) {
      const ref = doc(db, `users/${user?.uid}/forms`, formData.id);
      await updateDoc(ref, postObj);
    } else {
      if (formList.length === 30) {
        alert("Reached Maximum record length 30");
        return;
      }
      const createdTime = Timestamp.fromDate(new Date());
      const ref = collection(db, `users/${user?.uid}/forms`);
      const res = await addDoc(ref, { createdTime, ...postObj });
      const { rows, title, ...data } = postObj;
      setFormData({ id: res.id, rows, title, data });
    }
    setSnackBar({ open: true, title: "Form Saved Successfully" });
    await fetchData();
  };

  const handleDialogClose = () => {
    setShowPDF(false);
  };

  const handleSnackBarClose = () => {
    setSnackBar({ open: false, title: "" });
  };

  return (
    <>
      <Box
        sx={{
          width: "90%",
          margin: "auto",
          paddingBottom: 10,
          paddingTop: 1,
        }}
      >
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={snackBar.open}
          autoHideDuration={5000}
          onClose={handleSnackBarClose}
        >
          <Alert onClose={handleSnackBarClose} severity="success">
            {snackBar.title}
          </Alert>
        </Snackbar>
        <Paper elevation={0} sx={{ padding: 1, borderRadius: 5 }}>
          <form>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12} pb={5} sx={{ paddingBottom: 0 }}>
                    <div style={{ display: "flex" }}>
                      <a
                        href="https://www.aasmatech.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={logo}
                          style={{ width: 202, height: 60, margin: 0 }}
                        />
                      </a>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <h1
                      style={{
                        fontFamily: "Arial",
                        textAlign: "left",
                        marginBottom: 5,
                        marginTop: 0,
                        fontWeight: "normal",
                      }}
                    >
                      Slab Measurement Estimate
                    </h1>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label>Party Name</label>
                    <TextField
                      id="partyName"
                      placeholder="Enter Party Name"
                      fullWidth
                      variant="outlined"
                      sx={{ maxHeight: 40, marginTop: "2px" }}
                      inputProps={{
                        style: {
                          padding: 5,
                        },
                      }}
                      {...register("partyName")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label>Date</label>
                    <TextField
                      id="date"
                      type="date"
                      fullWidth
                      variant="outlined"
                      sx={{ maxHeight: 40, marginTop: "2px" }}
                      InputProps={{
                        inputProps: {
                          max: new Date().toISOString().slice(0, 10),
                          style: {
                            padding: 5,
                          },
                        },
                      }}
                      InputLabelProps={{ shrink: true }}
                      {...register("date")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label>Quality</label>
                    <TextField
                      id="quality"
                      placeholder="Enter quality"
                      fullWidth
                      variant="outlined"
                      sx={{ maxHeight: 40, marginTop: "2px" }}
                      inputProps={{
                        style: {
                          padding: 5,
                        },
                      }}
                      {...register("quality")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label>Vehicle No</label>
                    <TextField
                      id="vehicleNo"
                      placeholder="Enter vehicle no"
                      fullWidth
                      variant="outlined"
                      sx={{ maxHeight: 40, marginTop: "2px" }}
                      inputProps={{
                        style: {
                          padding: 5,
                        },
                      }}
                      {...register("vehicleNo")}
                    />
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <label>Measurement Unit</label>
                    <Controller
                      name="measurementUnit"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup {...field} sx={{ flexDirection: "row" }}>
                          <FormControlLabel
                            value="centimeter"
                            control={<Radio />}
                            label="Centimeter"
                          />
                          <FormControlLabel
                            value="inches"
                            control={<Radio />}
                            label="Inches"
                          />
                          <FormControlLabel
                            value="feet"
                            control={<Radio />}
                            label="Feet"
                          />
                        </RadioGroup>
                      )}
                    ></Controller>
                  </Grid>

                  <Grid item xs={12} sm={5}>
                    <Controller
                      name="totalAreaUnit"
                      control={control}
                      render={({ field }) => (
                        <>
                          <label>Total Area Unit</label>
                          <RadioGroup {...field} sx={{ flexDirection: "row" }}>
                            <FormControlLabel
                              value="Feet"
                              control={<Radio />}
                              label="Sq. Feet"
                            />
                            <FormControlLabel
                              value="Meter"
                              control={<Radio />}
                              label="Sq. Meter"
                            />
                          </RadioGroup>
                        </>
                      )}
                    ></Controller>
                  </Grid>
                  <Grid item xs={12} sx={{ marginTop: 1 }}>
                    <label>{"Max Sq." + watchTotalAreaUnit}</label>
                    <TextField
                      id="maxSqFeet"
                      placeholder={"Enter Max Sq " + watchTotalAreaUnit}
                      fullWidth
                      variant="outlined"
                      sx={{ maxHeight: 40, marginTop: "2px" }}
                      onKeyDown={handleKeyDown}
                      inputProps={{
                        min: 0,
                        style: {
                          padding: 5,
                        },
                      }}
                      type="number"
                      {...register("maxSqFeet", {
                        onChange: handleInputChange,
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <label>Add Rows</label>
                    <TextField
                      fullWidth
                      id="addRows"
                      placeholder="Enter no of rows"
                      helperText="Max 700 rows"
                      variant="outlined"
                      sx={{ maxHeight: 40, marginTop: "2px" }}
                      onKeyDown={handleKeyDown}
                      inputProps={{
                        min: 1,
                        style: {
                          padding: 5,
                        },
                      }}
                      type="number"
                      {...register("addRows", {
                        onChange: handleInputChange,
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <label>Starting Row</label>
                    <TextField
                      fullWidth
                      id="startingRow"
                      placeholder="Enter starting row"
                      variant="outlined"
                      sx={{ maxHeight: 40, marginTop: "2px" }}
                      onKeyDown={handleKeyDown}
                      inputProps={{
                        min: 1,
                        style: {
                          padding: 5,
                        },
                      }}
                      type="number"
                      {...register("startingRow", {
                        onChange: handleInputChange,
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <ThemeProvider theme={theme}>
                      <Button
                        disableElevation
                        variant="contained"
                        color="primary"
                        onClick={() => handleAddRow(getValues("addRows"))}
                        style={{
                          marginTop: "12px",
                          borderRadius: 10,
                          color: "white",
                        }}
                        fullWidth
                      >
                        Add
                      </Button>
                    </ThemeProvider>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <ThemeProvider theme={theme}>
                      <Button
                        disableElevation
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          setValue("startingRow", 1);
                          setValue("addRows", 0);
                          setValue("totalSqFeet", 0);
                          setValue("pricePerSqFeet", 0);
                          setRows(createRows(-1));
                          idCounter.current = 1;
                          isInitialAdd.current = true;
                        }}
                        style={{
                          marginTop: "12px",
                          borderRadius: 10,
                          color: "white",
                        }}
                        fullWidth
                      >
                        Reset
                      </Button>
                    </ThemeProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
                      <Table stickyHeader aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Sr No</TableCell>
                            <TableCell>Length</TableCell>
                            <TableCell>Width</TableCell>
                            <TableCell>{"Sq. " + watchTotalAreaUnit}</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row, i) => (
                            <TableRow
                              key={row.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                                "&:nth-of-type(odd)": {
                                  backgroundColor: "#F2F2F2",
                                },
                                "&:nth-of-type(even)": {
                                  backgroundColor: "white",
                                },
                              }}
                            >
                              <TableCell component="th" scope="row">
                                {row.srno}
                              </TableCell>
                              <TableCell>
                                <input
                                  style={{
                                    width: "50px",
                                    border: "none",
                                    backgroundColor: "transparent",
                                  }}
                                  type="number"
                                  value={row.length === "0" ? "" : row.length}
                                  placeholder={row.length}
                                  onChange={(e) => {
                                    lastEditedIndex.current = i;
                                    if (!/^\d*\.?\d*$/.test(e.target.value)) {
                                      return;
                                    }
                                    const aUnit = getValues("totalAreaUnit");
                                    const mUnit = getValues("measurementUnit");
                                    setRows((prev) => {
                                      prev[i].length = e.target.value;
                                      prev[i].sqFeet =
                                        parseFloat(prev[i].length) *
                                        parseFloat(prev[i].width);
                                      let area = 0;
                                      switch (mUnit) {
                                        case "centimeter":
                                          area =
                                            prev[i].sqFeet *
                                            (aUnit === "Feet"
                                              ? Convert.CmtoFeet
                                              : Convert.CmtoMeter);
                                          break;
                                        case "feet":
                                          area =
                                            prev[i].sqFeet *
                                            (aUnit === "Feet"
                                              ? Convert.MeterToFeet
                                              : Convert.FeetToMeter);
                                          break;
                                        case "inches":
                                          area =
                                            prev[i].sqFeet *
                                            (aUnit === "Feet"
                                              ? Convert.InchToFeet
                                              : Convert.InchToMeter);
                                          break;
                                        default:
                                          break;
                                      }
                                      prev[i].area =
                                        Math.round(area * 100) / 100;
                                      calculateTotalArea();
                                      return [...prev];
                                    });
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <input
                                  style={{
                                    width: "50px",
                                    border: "none",
                                    backgroundColor: "transparent",
                                  }}
                                  type="number"
                                  value={row.width === "0" ? "" : row.width}
                                  placeholder={row.width}
                                  onChange={(e) => {
                                    lastEditedIndex.current = i;
                                    if (!/^\d*\.?\d*$/.test(e.target.value)) {
                                      return;
                                    }
                                    const aUnit = getValues("totalAreaUnit");
                                    const mUnit = getValues("measurementUnit");

                                    setRows((prev) => {
                                      prev[i].width = e.target.value;
                                      prev[i].sqFeet =
                                        parseFloat(prev[i].length) *
                                        parseFloat(prev[i].width);
                                      let area = 0;
                                      switch (mUnit) {
                                        case "centimeter":
                                          area =
                                            prev[i].sqFeet *
                                            (aUnit === "Feet"
                                              ? Convert.CmtoFeet
                                              : Convert.CmtoMeter);
                                          break;
                                        case "feet":
                                          area =
                                            prev[i].sqFeet *
                                            (aUnit === "Feet"
                                              ? Convert.MeterToFeet
                                              : Convert.FeetToMeter);
                                          break;
                                        case "inches":
                                          area =
                                            prev[i].sqFeet *
                                            (aUnit === "Feet"
                                              ? Convert.InchToFeet
                                              : Convert.InchToMeter);
                                          break;
                                        default:
                                          break;
                                      }
                                      prev[i].area =
                                        Math.round(area * 100) / 100;
                                      calculateTotalArea();
                                      return [...prev];
                                    });
                                  }}
                                />
                              </TableCell>
                              <TableCell>{row.area}</TableCell>
                              <TableCell>
                                {i != 0 && (
                                  <div
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setRows((prev) => {
                                        prev[i].width = "---- || ----";
                                        prev[i].length = "---- || ----";
                                        prev[i].area = "---- || ----";
                                        prev[i].sqFeet = "---- || ----";
                                        calculateTotalArea();
                                        return [...prev];
                                      });
                                    }}
                                  >
                                    <CancelOutlinedIcon />
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12}>
                    <OutlinedInput
                      size="small"
                      sx={{
                        width: 90,
                        float: "right",
                        borderRadius: 4,
                      }}
                      id="outlined-adornment-password"
                      {...register("repeatCount")}
                      autoComplete="off"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                              handleRepeatValues();
                            }}
                            edge="end"
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <label>{"Total Sq. " + watchTotalAreaUnit}</label>
                    <TextField
                      fullWidth
                      disabled
                      id="totalSqFeet"
                      variant="outlined"
                      inputProps={{
                        style: {
                          padding: 5,
                        },
                      }}
                      type="number"
                      sx={{
                        maxHeight: 40,
                        marginTop: "2px",
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
                      {...register("totalSqFeet")}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <label>{"Price/Per Sq. " + watchTotalAreaUnit}</label>
                    <TextField
                      fullWidth
                      id="pricePerSqFeet"
                      variant="outlined"
                      sx={{ maxHeight: 40, marginTop: "2px" }}
                      onKeyDown={handleKeyDown}
                      inputProps={{
                        min: 1,
                        style: {
                          padding: 5,
                        },
                      }}
                      type="number"
                      {...register("pricePerSqFeet", {
                        onChange: handleInputChange,
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <label>Total Cost</label>
                    <TextField
                      fullWidth
                      disabled
                      id="totalCost"
                      variant="outlined"
                      inputProps={{
                        style: {
                          padding: 5,
                        },
                      }}
                      type="number"
                      sx={{
                        maxHeight: 40,
                        marginTop: "2px",
                        "& .MuiInputBase-input.Mui-disabled": {
                          WebkitTextFillColor: "#000000",
                        },
                      }}
                      {...register("totalCost")}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <ThemeProvider theme={theme}>
                      <Button
                        disableElevation
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        disabled={!user}
                        onClick={handleSave}
                        style={{
                          borderRadius: "20px 0px 20px 20px",
                          color: "white",
                        }}
                      >
                        Save
                      </Button>
                    </ThemeProvider>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <ThemeProvider theme={theme}>
                      <Button
                        disableElevation
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={() => {
                          handleDownloadPDF();
                        }}
                        style={{
                          borderRadius: "20px 0px 20px 20px",
                          color: "white",
                        }}
                      >
                        Generate PDF
                      </Button>
                    </ThemeProvider>
                  </Grid>
                  <Dialog
                    open={showPDF}
                    onClose={handleDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    style={{ borderRadius: 50 }}
                    PaperProps={{
                      style: { borderRadius: 15, width: "300px" },
                    }}
                  >
                    <DialogTitle
                      style={{ backgroundColor: "#f9f9fa" }}
                      sx={{ m: 0, p: 2 }}
                    >
                      PDF Created!
                      {handleDialogClose ? (
                        <IconButton
                          aria-label="close"
                          onClick={handleDialogClose}
                          sx={{
                            position: "absolute",
                            right: 8,
                            top: 10,
                            color: (theme) => theme.palette.grey[500],
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      ) : null}
                    </DialogTitle>
                    <Divider />
                    <center>
                      <DialogContent>
                        <PDFDownloadLink
                          document={
                            <PdfFile
                              invoiceData={getValues()}
                              rowData={pdfRows}
                            />
                          }
                          fileName="Slab_Measurement_Estimate"
                        >
                          {({ loading }) =>
                            loading ? (
                              <ThemeProvider theme={theme}>
                                <Button
                                  autoFocus
                                  variant="contained"
                                  color="primary"
                                  style={{ borderRadius: 10, color: "white" }}
                                >
                                  Preparing...
                                </Button>
                              </ThemeProvider>
                            ) : (
                              <ThemeProvider theme={theme}>
                                <Button
                                  variant="contained"
                                  autoFocus
                                  fullWidth
                                  color="primary"
                                  style={{ borderRadius: 10, color: "white" }}
                                >
                                  Download PDF
                                </Button>
                              </ThemeProvider>
                            )
                          }
                        </PDFDownloadLink>
                      </DialogContent>
                    </center>
                  </Dialog>
                  <Grid item xs={12} md={4}>
                    <ThemeProvider theme={theme}>
                      <Button
                        disableElevation
                        variant="contained"
                        color="secondary"
                        fullWidth
                        size="large"
                        onClick={() => {
                          reset();
                          handleAddRow(null);
                        }}
                        style={{
                          borderRadius: "20px 0px 20px 20px",
                          color: "white",
                        }}
                      >
                        Reset Form
                      </Button>
                    </ThemeProvider>
                  </Grid>
                </Grid>
              </Grid>
              <MediaQuery minWidth={1224}>
                <Grid item xs={12} lg={6} marginBottom={0}>
                  <Paper
                    elevation={0}
                    sx={{
                      paddingLeft: 0,
                      paddingRight: 0,
                      marginTop: 10,
                      paddingBottom: 4,
                      borderRadius: 5,

                      height: "100%",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <center>
                      <img
                        src={invoicePic}
                        style={{ width: "100%", objectFit: "cover" }}
                      />
                    </center>
                  </Paper>
                </Grid>
              </MediaQuery>
            </Grid>
          </form>
        </Paper>
      </Box>

      <Dialog
        open={showGoogleLogin}
        onClose={() => {
          setShowGoogleLogin(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Sign In</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please sign in to continue adding more than 10 rows
          </DialogContentText>
          <Button
            onClick={async () => {
              await signInWithPopup(auth, googleProvider);
              setShowGoogleLogin(false);
            }}
            startIcon={<GoogleIcon fontSize="small" />}
            variant="outlined"
            fullWidth
            sx={{ marginTop: 4 }}
          >
            Google Sign In
          </Button>
        </DialogContent>
      </Dialog>
      <MediaQuery maxWidth={1223}>
        <div className="footer">
          <p style={{ marginTop: "5px" }}>Made with ❤️ in India</p>
          <p>
            <a
              href="https://www.aasmatech.com"
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
        </div>
      </MediaQuery>
    </>
  );
};

export default Slab;
