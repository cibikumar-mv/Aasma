import {
  Page,
  Text,
  Document,
  StyleSheet,
  View,
  Link,
  Font,
  Image,
} from "@react-pdf/renderer";
import { tableData } from "../pages/Slab/Slab";
import roboRegular from "/src/assets/fonts/Roboto-Regular.ttf";
import roboBold from "/src/assets/fonts/Roboto-Bold.ttf";
import copyright from "/src/assets/copyright.png";

Font.register({
  family: "Roboto Regular",
  src: roboRegular,
});

Font.register({
  family: "Roboto Bold",
  src: roboBold,
});

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
    fontFamily: "Roboto Regular",
  },
  textBold: {
    marginTop: 5,
    fontSize: 10,
    textAlign: "justify",
    fontFamily: "Roboto Bold",
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
    backgroundColor: "#fff",
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
  evenRow: {
    backgroundColor: "#f2f2f2",
  },
  oddRow: {
    backgroundColor: "#fff",
  },
  footer: {
    marginTop: 55,
    fontSize: 10,
    textAlign: "justify",
    fontFamily: "Roboto Regular",
  },
});

const PdfFile = ({ rowData, invoiceData }: any) => {
  return (
    <Document>
      <Page size={"A4"} style={{}}>
        <Link
          style={style.title}
          src="https://aasma-slab-measurements.netlify.app/"
        >
          SLAB MEASUREMENT ESTIMATE
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
          <Text style={style.textBold}>
            Name of Party:{" "}
            <Text style={style.text}>{invoiceData.partyName}</Text>
          </Text>
          <Text style={style.textBold}>
            Date: <Text style={style.text}>{invoiceData.date}</Text>
          </Text>
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
          <Text style={style.textBold}>
            Quality: <Text style={style.text}>{invoiceData.quality}</Text>
          </Text>
          <Text style={style.textBold}>
            Vehicle Number:{" "}
            <Text style={style.text}>{invoiceData.vehicleNo}</Text>
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
                <Text
                  style={style.tableCellHead}
                >{`Sq. ${invoiceData.totalAreaUnit}`}</Text>
              </View>
              <View style={style.tableCol}>
                <Text style={style.tableCellHead}>Sr No</Text>
              </View>
              <View style={style.tableCol}>
                <Text style={style.tableCellHead}>Measurement</Text>
              </View>
              <View style={style.tableCol}>
                <Text
                  style={style.tableCellHead}
                >{`Sq. ${invoiceData.totalAreaUnit}`}</Text>
              </View>
            </View>
            {rowData[0].rows.slice(0, 35).map((d: tableData, i: number) => {
              return (
                <View
                  style={[
                    style.tableRow,
                    i % 2 === 0 ? style.evenRow : style.oddRow,
                  ]}
                >
                  <View style={style.tableCol}>
                    <Text style={style.tableCell}>{d?.srno}</Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text style={style.tableCell}>
                      {d?.length + "X" + d?.width}
                    </Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text style={style.tableCell}>{d?.area}</Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text style={style.tableCell}>
                      {rowData[0].rows[i + 35]?.srno}
                    </Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text style={style.tableCell}>
                      {rowData[0].rows[i + 35]?.length +
                        "X" +
                        rowData[0].rows[i + 35]?.width}
                    </Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text style={style.tableCell}>
                      {rowData[0].rows[i + 35]?.area}
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
          <Text style={style.textBold}>
            {`Sheet Sq. ${invoiceData.totalAreaUnit}: `}
            <Text style={style.text}>{rowData[0].pageTotal}</Text>
          </Text>
          <Text style={style.textBold}>
            {`Price/Per Sq. ${invoiceData.totalAreaUnit}: `}
            <Text style={style.text}>{"Rs." + invoiceData.pricePerSqFeet}</Text>
          </Text>
          <Text style={style.textBold}>
            {"Sheet Cost: "}
            <Text style={style.text}>Rs.{rowData[0].pageCost}</Text>
          </Text>
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
          <Text style={style.textBold}>
            {`Net Sq. ${invoiceData.totalAreaUnit}: `}
            <Text style={style.text}>{rowData[0].netTotal}</Text>
          </Text>
          <Text style={style.text}></Text>
          <Text style={style.textBold}>
            {"Net Cost: "}
            <Text style={style.text}> Rs.{rowData[0].netCost} </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginRight: 50,
            marginLeft: 50,
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <Text style={style.footer}>
            <Link src="http://www.aasmatech.com">
              Aasma Technology Solutions
            </Link>
            &nbsp; <Image src={copyright} />
            2023 - All rights reserved
          </Text>
        </View>
      </Page>
      {rowData.slice(1).map((row: any) => {
        return (
          <Page size={"A4"} style={{}}>
            <View
              style={{
                marginRight: 50,
                marginLeft: 50,
                marginTop: 70,
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
                    <Text style={style.tableCellHead}>
                      {"Sq. " + invoiceData.totalAreaUnit}
                    </Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text style={style.tableCellHead}>Sr No</Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text style={style.tableCellHead}>Measurement</Text>
                  </View>
                  <View style={style.tableCol}>
                    <Text style={style.tableCellHead}>
                      {"Sq. " + invoiceData.totalAreaUnit}
                    </Text>
                  </View>
                </View>
                {row.rows.slice(0, 35).map((d: tableData, i: number) => {
                  return (
                    <View
                      style={[
                        style.tableRow,
                        i % 2 === 0 ? style.evenRow : style.oddRow,
                      ]}
                    >
                      <View style={style.tableCol}>
                        <Text style={style.tableCell}>{d?.srno}</Text>
                      </View>
                      <View style={style.tableCol}>
                        <Text style={style.tableCell}>
                          {d?.length + "X" + d?.width}
                        </Text>
                      </View>
                      <View style={style.tableCol}>
                        <Text style={style.tableCell}>{d?.area}</Text>
                      </View>
                      <View style={style.tableCol}>
                        <Text style={style.tableCell}>
                          {row.rows[i + 35]?.srno}
                        </Text>
                      </View>
                      <View style={style.tableCol}>
                        <Text style={style.tableCell}>
                          {row.rows[i + 35]?.length +
                            "X" +
                            row.rows[i + 35]?.width}
                        </Text>
                      </View>
                      <View style={style.tableCol}>
                        <Text style={style.tableCell}>
                          {row.rows[i + 35]?.area}
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
              <Text style={style.textBold}>
                {`Sheet Sq. ${invoiceData.totalAreaUnit}: `}
                <Text style={style.text}>{row.pageTotal} </Text>
              </Text>
              <Text style={style.textBold}>
                {`Price/Per Sq. ${invoiceData.totalAreaUnit}: `}
                <Text style={style.text}>
                  {"Rs." + invoiceData.pricePerSqFeet}
                </Text>
              </Text>
              <Text style={style.textBold}>
                {"Sheet Cost: "}
                <Text style={style.text}>{"Rs." + row.pageCost} </Text>
              </Text>
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
              <Text style={style.textBold}>
                {`Net Sq. ${invoiceData.totalAreaUnit}: `}
                <Text style={style.text}>{row.netTotal}</Text>
              </Text>
              <Text style={style.text}></Text>
              <Text style={style.textBold}>
                {"Net Cost: "}
                <Text style={style.text}>{"Rs." + row.netCost}</Text>
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginRight: 50,
                marginLeft: 50,
                marginTop: 45,
                alignItems: "center",
              }}
            >
              <Text style={style.footer}>
                <Link src="http://www.aasmatech.com">
                  Aasma Technology Solutions
                </Link>
                &nbsp; <Image src={copyright} />
                2023 - All rights reserved
              </Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export default PdfFile;
