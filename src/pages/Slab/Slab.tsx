import { useState, useEffect, useRef } from "react";
import "./Slab.scss";
import {
  Grid,
  TextField,
  Paper,
  Box,
  MenuItem,
  Button,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
  InputBase,
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
import { useForm } from "react-hook-form";
import useExitPrompt from "../../hooks/useExitPrompt";
import PdfFile from "../../components/PdfFile";
import { PDFDownloadLink } from "@react-pdf/renderer";
import {
  ThemeProvider,
  alpha,
  createTheme,
  styled,
} from "@mui/material/styles";
import logo from "/src/assets/logo.png";
import invoicePic from "/src/assets/invoicevector.png";
import gridbg from "/src/assets/gridpattern2.png";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

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

const measurementUnitValues = [
  {
    value: "Centimeter",
  },
  {
    value: "Inches",
  },
  {
    value: "Feet",
  },
];

const totalAreaUnitValues = [
  {
    value: "Feet",
    label: "Sq. Feet",
  },
  { value: "Meter", label: "Sq. Meter" },
];

export interface tableData {
  id: number;
  srno: number;
  length: string;
  width: string;
  sqMeter: any;
  lInput: boolean;
  wInput: boolean;
}

const obj: tableData = {
  id: 1,
  srno: 1,
  length: "0",
  width: "0",
  sqMeter: 0,
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
    console.log("asdf:", count);
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
      setValue("pricePerSqFeet", "");
      setValue("startingRow", "");
      setValue("addRows", "");
    }
  };
  const [areaUnit, setAreaUnit] = useState("Feet");
  const activeInput = useRef(-1);
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const watchPrice = watch("pricePerSqFeet");
  const [data, setData] = useState({
    partyName: "",
    date: "",
    quality: "",
    vehicleNo: "",
    measurementUnit: "",
    maxSqFeet: "",
    totalAreaUnit: "",
  });

  useEffect(() => {
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

  const createRandomRow = (count: number) => {
    if (count === -1) {
      idCounter.current = 0;
      return [{ ...obj }];
    }
    const array = [];

    if (isInitialAdd.current) {
      const initialCount = getValues("startingRow");
      idCounter.current = initialCount ? parseInt(initialCount) - 1 : 0;
      console.log("starting:", idCounter.current);
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
    let count = parseInt(getValues("repeateCount"));
    console.log({
      lastEdit: lastEditedIndex.current,
      rowLen: rows.length,
      count,
    });

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
        prev[lastEditedIndex.current + i].sqMeter =
          prev[lastEditedIndex.current].sqMeter;
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
      if (!isNaN(row.sqMeter)) {
        total += row.sqMeter;
      }
    });
    settotalArea(total);
  };

  const handleDownloadPDF = () => {
    console.log("len:", rows.length, 70 - rows.length);
    const padRows = createRandomRow(71 - rows.length);
    console.log(rows.concat(padRows));
    setPdfRows(rows.concat(padRows));
    console.log("padRows:", padRows);
    setShowPDF(true);
  };

  const handleDialogClose = () => {
    setShowPDF(false);
  };

  return (
    <Box
      sx={{ width: "85%", margin: "auto", paddingBottom: 10, paddingTop: 10 }}
    >
      <Paper elevation={0} sx={{ padding: 5, borderRadius: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            container
            spacing={3}
            alignContent={"center"}
            alignItems={"center"}
          >
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
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
                <Grid item xs={12} sm={6}>
                  <FormLabel id="measurementUnitRadioLabel">
                    Measurement Unit
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="measurementUnitRadioGroupLabel"
                    name="measurementUnitRadioGroup"
                  >
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
                  {/* <TextField
                    id="measurementUnit"
                    select
                    name="measurementUnit"
                    label="Measurement Unit"
                    fullWidth
                    variant="standard"
                  >
                    {measurementUnitValues.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.value}
                      </MenuItem>
                    ))}
                    </TextField> */}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormLabel id="totalAreaUnitRadioLabel">
                    Total Area Unit
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="totalAreaUnitRadioGroupLabel"
                    name="totalAreaUnitRadioGroup"
                  >
                    <FormControlLabel
                      value="sqFeet"
                      control={<Radio />}
                      label="Sq. Feet"
                    />
                    <FormControlLabel
                      value="sqMeter"
                      control={<Radio />}
                      label="Sq. Meter"
                    />
                  </RadioGroup>
                  {/* <TextField
                    id="totalAreaUnit"
                    name="totalAreaUnit"
                    select
                    label="Total Area Unit"
                    fullWidth
                    variant="standard"
                    onChange={(e: any) => {
                      setAreaUnit(e.target.value);
                    }}
                  >
                    {totalAreaUnitValues.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))} 
                  </TextField>*/}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="maxSqFeet"
                    name="maxSqFeet"
                    label={"Max Sq " + areaUnit}
                    fullWidth
                    variant="standard"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    id="addRows"
                    label="Add Rows"
                    variant="standard"
                    type="number"
                    {...register("addRows")}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
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
                          <TableCell>{"Sq." + areaUnit}</TableCell>
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
                                  value={row.length}
                                  ref={ref}
                                  onChange={(e) => {
                                    lastEditedIndex.current = i;
                                    if (!/^\d*\.?\d*$/.test(e.target.value)) {
                                      return;
                                    }
                                    setRows((prev) => {
                                      prev[i].length = e.target.value;
                                      prev[i].sqMeter =
                                        parseFloat(prev[i].length) *
                                        parseFloat(prev[i].width);
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
                                  value={row.width}
                                  onChange={(e) => {
                                    lastEditedIndex.current = i;
                                    if (!/^\d*\.?\d*$/.test(e.target.value)) {
                                      return;
                                    }
                                    setRows((prev) => {
                                      prev[i].width = e.target.value;
                                      prev[i].sqMeter =
                                        parseFloat(prev[i].length) *
                                        parseFloat(prev[i].width);
                                      calculateTotalArea();
                                      return [...prev];
                                    });
                                    console.log("rows:", rows);
                                  }}
                                />
                              ) : (
                                row.width
                              )}
                            </TableCell>
                            <TableCell>{row.sqMeter}</TableCell>
                            <TableCell>
                              {i != 0 && (
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setRows((prev) => {
                                      prev[i].width = "---- || ----";
                                      prev[i].length = "---- || ----";
                                      prev[i].sqMeter = "---- || ----";
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
                <Grid item sm={12} md={12}>
                  <OutlinedInput
                    size="small"
                    sx={{ width: 80, float: "right" }}
                    id="outlined-adornment-password"
                    {...register("repeateCount")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={(e) => {
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
                <Grid item sm={12} md={4}>
                  <TextField
                    id="totalSqFeet"
                    label="Total Sq. Feet"
                    variant="standard"
                    type="number"
                    value={totalArea}
                    {...register("totalSqFeet")}
                  />
                </Grid>
                <Grid item sm={12} md={4}>
                  <TextField
                    id="pricePerSqFeet"
                    label="Price/Per Sq. Feet"
                    variant="standard"
                    type="number"
                    {...register("pricePerSqFeet")}
                  />
                </Grid>
                <Grid item sm={12} md={4}>
                  <TextField
                    id="totalCost"
                    label="Total Cost"
                    variant="standard"
                    type="number"
                    value={watchPrice ? watchPrice * totalArea : 0}
                    {...register("totalCost")}
                  />
                </Grid>
                <Grid item sm={12} md={8}>
                  <Button
                    variant="outlined"
                    color="success"
                    fullWidth
                    onClick={handleDownloadPDF}
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
                <Grid item sm={12} md={4}>
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
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Slab;
