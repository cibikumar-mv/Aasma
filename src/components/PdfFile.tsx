import React, { useEffect } from "react";
import {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  View,
  Link,
} from "@react-pdf/renderer";
import { Grid } from "@mui/material";
import { tableData } from "../pages/Slab/Slab";

const style = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 35,
    paddingHorizontal: 35,
  },
  title: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 18,
    textAlign: "center",
  },
  text: {
    marginTop: 5,
    fontSize: 10,
    textAlign: "justify",
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "16.66%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHead: {
    margin: "auto",
    fontWeight: "bold",
    marginTop: 5,
    fontSize: 10,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
});

const PdfFile = ({ rowData, invoiceData }: any) => {
  useEffect(() => {
    console.log("inv:", invoiceData);
  }, []);

  return (
    <Document>
      <Page size={"A4"} style={{}}>
        <Link style={style.title} src="http://127.0.0.1:5173/">
          Aasma Slab Measurements
        </Link>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginRight: 50,
            marginLeft: 50,
          }}
        >
          <Text style={style.text}>Name of Party: {invoiceData.partyName}</Text>
          <Text style={style.text}>Date: {invoiceData.date}</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginRight: 50,
            marginLeft: 50,
          }}
        >
          <Text style={style.text}>Quality: {invoiceData.quality}</Text>
          <Text style={style.text}>
            Vehicle Number: {invoiceData.vehicleNo}
          </Text>
        </View>
        <View
          style={{
            marginRight: 50,
            marginLeft: 50,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <View style={style.table}>
            <View style={style.tableRow}>
              <View style={style.tableCol}>
                <Text style={style.tableCellHead}>Sr No</Text>
              </View>
              <View style={style.tableCol}>
                <Text style={style.tableCellHead}>Measurement</Text>
              </View>
              <View style={style.tableCol}>
                <Text style={style.tableCellHead}>Sq. Feet</Text>
              </View>
              <View style={style.tableCol}>
                <Text style={style.tableCellHead}>Sr No</Text>
              </View>
              <View style={style.tableCol}>
                <Text style={style.tableCellHead}>Measurement</Text>
              </View>
              <View style={style.tableCol}>
                <Text style={style.tableCellHead}>Sq. Feet</Text>
              </View>
            </View>
            {rowData.slice(0, 35).map((d: tableData, i: number) => {
              return (
                <View style={style.tableRow}>
                  <View style={style.tableCol}>
                    <Text style={style.tableCell}>{d?.srno}</Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text style={style.tableCell}>
                      {d?.length + "X" + d?.width}
                    </Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text style={style.tableCell}>{d?.sqMeter}</Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text style={style.tableCell}>{rowData[i + 35]?.srno}</Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text style={style.tableCell}>
                      {rowData[i + 35]?.length + "X" + rowData[i + 35]?.width}
                    </Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text style={style.tableCell}>
                      {rowData[i + 35]?.sqMeter}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginRight: 50,
            marginLeft: 50,
          }}
        >
          <Text style={style.text}>
            Sheet Sq. Feet: {invoiceData.totalSqFeet}
          </Text>
          <Text style={style.text}>
            Price/Per Sq. Feet: Rs.{invoiceData.pricePerSqFeet}
          </Text>
          <Text style={style.text}>Sheet Cost: Rs.{invoiceData.totalCose}</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginRight: 50,
            marginLeft: 50,
          }}
        >
          <Text style={style.text}>
            Net Sq. Feet: {invoiceData.totalSqFeet}
          </Text>
          <Text style={style.text}></Text>
          <Text style={style.text}>Net Cost: Rs.{invoiceData.totalCose}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfFile;
