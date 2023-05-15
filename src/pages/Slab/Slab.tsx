import { useState, useEffect, useRef } from "react";
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
  FormLabel,
  RadioGroup,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Controller, useForm } from "react-hook-form";
import useExitPrompt from "../../hooks/useExitPrompt";
import PdfFile from "../../components/PdfFile";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import logo from "/src/assets/logo.png";
import invoicePic from "/src/assets/invoicevector.png";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MediaQuery from "react-responsive";

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#37CB95",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#DE3C63",
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
  lInput: boolean;
  wInput: boolean;
}

const obj: tableData = {
  id: 1,
  srno: 1,
  length: "0",
  width: "0",
  sqFeet: 0,
  area: 0,
  lInput: false,
  wInput: false,
};

const Slab = () => {
  const ref = useRef<any>(null);
  const ref2 = useRef<any>(null);
  const lastEditedIndex = useRef(-1);
  const idCounter = useRef(1);
  const [showPDF, setShowPDF] = useState(false);
  const isInitialAdd = useRef(true);
  const [pdfRows, setPdfRows] = useState<any>([]);
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(true);
  const [totalArea, settotalArea] = useState(0);
  const handleAddRow = (count: number | null) => {
    if (count) {
      if (isInitialAdd.current) {
        setRows(createRandomRow(count));
      } else {
        setRows((prevRows) => [...prevRows, ...createRandomRow(count)]);
      }
    } else {
      setRows(createRandomRow(-1));
      isInitialAdd.current = true;
      settotalArea(0);
      setValue("pricePerSqFeet", 0);
      setValue("startingRow", "");
      setValue("addRows", null);
    }
  };
  const activeInput = useRef(-1);
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      partyName: "",
      date: "",
      quality: "",
      vehicleNo: "",
      addRows: null,
      startingRow: "",
      repeatCount: "",
      totalSqFeet: 0,
      pricePerSqFeet: 0,
      totalCost: 0,
      totalAreaUnit: "Feet",
      measurementUnit: "feet",
    },
  });
  const watchPrice = watch("pricePerSqFeet");
  const watchTotalAreaUnit = watch("totalAreaUnit");
  const watchMeasurementUnit = watch("measurementUnit");

  useEffect(() => {
    console.log("values:", getValues());

    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setRows((prev) => {
          prev[activeInput.current].lInput = false;
          return [...prev];
        });
      }
      if (ref2.current && !ref2.current.contains(event.target)) {
        setRows((prev) => {
          prev[activeInput.current].wInput = false;
          return [...prev];
        });
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    convertArea();
  }, [watchTotalAreaUnit, watchMeasurementUnit]);

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

  const createRandomRow = (count: number) => {
    if (count === -1) {
      idCounter.current = 0;
      return [{ ...obj }];
    }
    const array = [];

    if (isInitialAdd.current) {
      const initialCount = getValues("startingRow");
      idCounter.current = initialCount ? parseInt(initialCount) - 1 : 0;
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

  const [rows, setRows] = useState([{ ...obj }]);

  const onSubmit = (data: any) => console.log(data);

  const calculateTotalArea = () => {
    let total = 0;
    rows.forEach((row) => {
      if (!isNaN(row.area)) {
        total += row.area;
      }
    });
    settotalArea(Math.round(total * 100) / 100);
  };

  const handleDownloadPDF = (count: number) => {
    let netTotal = 0;
    let dataLen = rows.length;
    const pageRows = [];
    const pages = Math.ceil(count / 70);
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
          pageTotal,
          pageCost:
            Math.round(getValues("pricePerSqFeet") * pageTotal * 100) / 100,
          netTotal,
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
        const padRows = createRandomRow(71 - dataRows.length);
        const obj = {
          rows: dataRows.concat(padRows),
          pageTotal,
          pageCost:
            Math.round(getValues("pricePerSqFeet") * pageTotal * 100) / 100,
          netTotal,
          netCost:
            Math.round(getValues("pricePerSqFeet") * netTotal * 100) / 100,
        };
        pageRows.push(obj);
      }
    }
    setPdfRows(pageRows);
    setShowPDF(true);
  };

  const handleDialogClose = () => {
    setShowPDF(false);
  };

  return (
    <Box
      sx={{ width: "80%", margin: "auto", paddingBottom: 10, paddingTop: 5 }}
    >
      <Paper elevation={0} sx={{ padding: 5, borderRadius: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={3}
            alignContent={"center"}
            alignItems={"center"}
          >
            <Grid item xs={12} lg={8}>
              <Grid container spacing={2}>
                <MediaQuery maxWidth={1223}>
                  <Grid item xs={12}>
                    <center>
                      <img src={logo} style={{ width: 60, height: 60 }} />
                      <h2
                        style={{
                          marginTop: "5px",
                          fontFamily: "Helvetica",
                        }}
                      >
                        Aasma <br />
                        Slab Measurements
                      </h2>
                    </center>
                  </Grid>
                </MediaQuery>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="partyName"
                    label="Party name"
                    fullWidth
                    variant="standard"
                    {...register("partyName")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="date"
                    type="date"
                    label="Date"
                    fullWidth
                    variant="standard"
                    InputLabelProps={{ shrink: true }}
                    {...register("date")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="quality"
                    label="Quality"
                    fullWidth
                    variant="standard"
                    {...register("quality")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="vehicleNo"
                    label="Vehicle No"
                    fullWidth
                    variant="standard"
                    {...register("vehicleNo")}
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <FormLabel id="measurementUnitRadioLabel">
                    Measurement Unit
                  </FormLabel>
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

                <Grid item xs={12} sm={4}>
                  <Controller
                    name="totalAreaUnit"
                    control={control}
                    render={({ field }) => (
                      <>
                        <FormLabel id="totalAreaUnitRadioLabel">
                          Total Area Unit
                        </FormLabel>
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
                <Grid item xs={12} sm={3} sx={{marginTop: 1}}>
                  <TextField
                    id="maxSqFeet"
                    name="maxSqFeet"
                    label={"Max Sq " + watchTotalAreaUnit}
                    fullWidth
                    variant="standard"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="addRows"
                    label="Add Rows"
                    variant="standard"
                    type="number"
                    {...register("addRows")}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    id="startingRow"
                    label="Starting Row"
                    variant="standard"
                    type="number"
                    {...register("startingRow")}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => handleAddRow(getValues("addRows"))}
                    style={{ marginTop: "12px" }}
                    fullWidth
                  >
                    Add
                  </Button>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleAddRow(null)}
                    style={{ marginTop: "12px" }}
                    fullWidth
                  >
                    Reset
                  </Button>
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
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.srno}
                            </TableCell>
                            <TableCell
                              onClick={() => {
                                activeInput.current = i;
                                setRows((prev) => {
                                  prev[i].lInput = true;
                                  return [...prev];
                                });
                              }}
                            >
                              {row.lInput ? (
                                <input
                                  autoFocus
                                  style={{ width: "50px" }}
                                  value={row.length === "0" ? "" : row.length}
                                  ref={ref}
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
                              ) : (
                                row.length
                              )}
                            </TableCell>
                            <TableCell
                              onClick={() => {
                                activeInput.current = i;
                                setRows((prev) => {
                                  prev[i].wInput = true;
                                  return [...prev];
                                });
                              }}
                            >
                              {row.wInput ? (
                                <input
                                  autoFocus
                                  style={{ width: "50px" }}
                                  ref={ref2}
                                  value={row.width === "0" ? "" : row.width}
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
                              ) : (
                                row.width
                              )}
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
                    sx={{ width: 90, float: "right" }}
                    id="outlined-adornment-password"
                    {...register("repeatCount")}
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
                  <TextField
                    fullWidth
                    id="totalSqFeet"
                    label={"Total Sq. " + watchTotalAreaUnit}
                    variant="standard"
                    type="number"
                    value={totalArea}
                    {...register("totalSqFeet")}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="pricePerSqFeet"
                    label={"Price/Per Sq. " + watchTotalAreaUnit}
                    variant="standard"
                    type="number"
                    {...register("pricePerSqFeet")}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    id="totalCost"
                    label="Total Cost"
                    variant="standard"
                    type="number"
                    value={
                      watchPrice
                        ? Math.round(watchPrice * totalArea * 100) / 100
                        : 0
                    }
                    {...register("totalCost")}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Button
                    type="submit"
                    variant="outlined"
                    color="success"
                    fullWidth
                    onClick={() => {
                      handleDownloadPDF(rows.length);
                    }}
                  >
                    Save as PDF
                  </Button>
                </Grid>
                <Dialog
                  open={showPDF}
                  onClose={handleDialogClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle>Download PDF</DialogTitle>
                  <DialogContent>
                    <PDFDownloadLink
                      document={
                        <PdfFile invoiceData={getValues()} rowData={pdfRows} />
                      }
                      fileName="slab"
                    >
                      {({ loading }) =>
                        loading ? (
                          <Button variant="outlined" color="success">
                            Preparing...
                          </Button>
                        ) : (
                          <Button variant="outlined" color="success">
                            Download PDF
                          </Button>
                        )
                      }
                    </PDFDownloadLink>
                  </DialogContent>
                </Dialog>
                <Grid item xs={12} md={4}>
                  <ThemeProvider theme={theme}>
                    <Button
                      disableElevation
                      variant="contained"
                      color="secondary"
                      fullWidth
                    >
                      Reset Form
                    </Button>
                  </ThemeProvider>
                </Grid>
              </Grid>
            </Grid>
            <MediaQuery minWidth={1224}>
              <Grid item xs={12} sm={4} marginBottom={0}>
                <Paper
                  elevation={0}
                  sx={{
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingTop: 10,
                    paddingBottom: 12,
                    borderRadius: 5,
                    height: "100%",
                    backgroundColor: "#f9f9fa",
                  }}
                >
                  <center>
                    <img src={logo} style={{ width: 60, height: 60 }} />
                    <h2
                      style={{
                        marginTop: "5px",
                        fontFamily: "Helvetica",
                      }}
                    >
                      Aasma <br />
                      Slab Measurements
                    </h2>
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
  );
};

export default Slab;
