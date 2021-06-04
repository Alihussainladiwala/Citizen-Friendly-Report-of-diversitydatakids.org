import Axios from "axios";
import { useCallback } from "react";
import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import jsonp from "jsonp";
import Container from "@material-ui/core/Container";
import { Snackbar, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import ReactDataGrid from "@inovua/reactdatagrid-community";
import "@inovua/reactdatagrid-community/index.css";
import "./ResourcePage.css";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";
import endPointObj from "../endPointUrl";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart, Pie } from "recharts";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function ResourcePage(props) {
  const classes = useStyles();
  const {
    resourceId,
    yearFormat,
    resourceName,
    NLGData,
    displayData,
  } = props.data;
  const [warning, setWarning] = useState(false);
  const [chart, setChartType] = useState("bar");
  const [rowData, setRowData] = useState({});
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pageSize, setPageSize] = useState(100);
  const [loading, setLoading] = useState(true);
  const [columnMap, setColumnMap] = useState({});
  const [visibleMap, setVisibleMap] = useState({});
  const [infoMap, setInfoMap] = useState({});
  const gridStyle = {};
  const [selected, setSelected] = useState({});
  const [message, setMessage] = useState("");
  const [supported, setSupported] = useState(false);
  const [graphState, setGraphState] = useState([]);
  const [name_filter, setNameFilter] = useState([]);
  const [name, setName] = useState("");
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState({
    min: -1,
    max: -1,
    avg: -1,
  });
  const [overview, setOverview] = useState("");
  const [ethnicStats, setEthnicStats] = useState("");
  const [regionalStats, setRegionalStats] = useState("");
  const [dispRegional, setdispRegional] = useState(false);
  let myUrl = "";

  useEffect(() => {
    fetchFilterData();
    fetchCkanData();
    fetchStats();
  }, [props]);

  const createUrlFilters = (filter) => {
    if (!filter) {
      const base =
        "https://data.diversitydatakids.org/api/3/action/datastore_search";
      myUrl = new URL(base);
      myUrl.searchParams.append("offset", 0);
      myUrl.searchParams.append("fields", "name");
      myUrl.searchParams.append("distinct", "true");
      myUrl.searchParams.append("include_total", "false");
      myUrl.searchParams.append("resource_id", resourceId);
    } else {
      const base =
        "https://data.diversitydatakids.org/api/3/action/datastore_search";
      myUrl = new URL(base);
      myUrl.searchParams.append("offset", 0);
      myUrl.searchParams.append("fields", "name");
      myUrl.searchParams.append("distinct", "true");
      myUrl.searchParams.append("include_total", "false");
      myUrl.searchParams.append("resource_id", resourceId);
      myUrl.searchParams.append("q", '{ "name": "' + filter + ':*"}');
    }
  };

  const handleChangeNameFilter = (value) => {
    console.log(value);
    fetchRegionalStats(value);
    fetchCkanData(value);
    setName(value);
    setMessage("");
  };

  const createUrl = (filter) => {
    if (filter) {
      const base =
        "https://data.diversitydatakids.org/api/3/action/datastore_search";
      myUrl = new URL(base);
      myUrl.searchParams.append("limit", pageSize);
      myUrl.searchParams.append("resource_id", resourceId);
      myUrl.searchParams.append("filters", '{ "name": "' + filter + '"}');
    } else {
      const base =
        "https://data.diversitydatakids.org/api/3/action/datastore_search";
      myUrl = new URL(base);
      myUrl.searchParams.append("limit", pageSize);
      myUrl.searchParams.append("resource_id", resourceId);
    }
  };

  const fetchFilterData = (filter) => {
    if (resourceId === "") {
      setWarning(true);
      return;
    }
    createUrlFilters(filter);

    jsonp(myUrl.toString(), null, function (err, res) {
      if (err) {
        console.log("error");
        // fetchCkanData();
        setLoading(false);
        return;
      } else {
        let name_filter = res.result.records.map((record) => {
          return record.name;
        });
        if (filter == undefined) {
          console.log(filter);
          fetchRegionalStats(name_filter[0]);
          setName(name_filter[0]);
          fetchCkanData(name_filter[0]);
          setNameFilter(name_filter);
        }
      }
    });
  };

  const fetchStatistics = () => {
    let url =
      'https://data.diversitydatakids.org/api/3/action/datastore_search_sql?sql=SELECT min(total_est),max(total_est),avg(total_est) from "' +
      resourceId +
      '" where total_est > 0';
    jsonp(url, null, function (err, res) {
      if (err) {
        setWarning(true);
        setLoadingStats(false);
      } else {
        let data = res.result.records[0];
        if (data && res.success) {
          setStats({ min: data.min, max: data.max, avg: data.avg });
          Axios.post(endPointObj.url + "getOverview", {
            NLGData: NLGData,
            stats: { min: data.min, max: data.max, avg: data.avg },
            resourceName: resourceName,
            yearFormat: yearFormat,
          })
            .then((result) => {
              setLoadingStats(false);
              setOverview(result.data);
            })
            .catch((error) => {
              setLoadingStats(false);
            });
        }
      }
    });
  };

  const fetchStats = () => {
    setLoadingStats(true);
    const base =
      "https://data.diversitydatakids.org/api/3/action/datastore_search";
    let url = new URL(base);
    let titles = {};
    url.searchParams.append("limit", 0);
    url.searchParams.append("resource_id", resourceId);
    jsonp(url.toString(), null, function (err, res) {
      if (err) {
        setLoadingStats(false);
        setLoadingStats(false);
      } else {
        let isSupported = false;
        let query = res.result.fields
          .filter((each) => {
            if (each.id && each.id === "total_est") {
              isSupported = true;
            }
            if (
              (!each.info ||
                !each.info.notes.includes(
                  "(only available in download file)"
                )) &&
              each.type === "numeric" &&
              each.id !== "total_est"
            ) {
              return true;
            }
          })
          .map((each) => {
            titles[each.id] = each.info.label.split(";")[1]
              ? each.info.label.split(";")[1]
              : each.info.label.split(";")[0];
            return "avg(" + each.id + ") as avg_" + each.id;
          })
          .join();
        if (isSupported) {
          fetchStatistics();
          fetchEthnicStats(titles, query);
        } else {
          setSupported(false);
          setMessage("*NLG is not supported for this dataset");
          setLoadingStats(false);
        }
      }
    });
  };

  const fetchEthnicStats = (titles, query) => {
    let url =
      "https://data.diversitydatakids.org/api/3/action/datastore_search_sql?sql=SELECT " +
      query +
      ' from "' +
      resourceId +
      '"';
    jsonp(url, null, function (err, res) {
      if (err) {
        setWarning(true);
      } else {
        if (res.success) {
          let data = res.result.records[0];
          Object.keys(data).length > 1 &&
            Axios.post(endPointObj.url + "getEthnicStats", {
              NLGData: NLGData,
              data: data,
              titles: titles,
            })
              .then((result) => {
                setEthnicStats(result.data);
              })
              .catch((error) => {});
        }
      }
    });
  };

  const fetchRegionalStats = (filter) => {
    const base =
      "https://data.diversitydatakids.org/api/3/action/datastore_search";
    let url = new URL(base);
    let titles = {};
    url.searchParams.append("limit", 0);
    url.searchParams.append("resource_id", resourceId);
    if(filter === "" || filter ===null){
      setdispRegional(false);
      return
    }else{
      setdispRegional(true);
    }
    jsonp(url.toString(), null, function (err, res) {
      if (err) {
        setWarning(true);
      } else {
        let isSupported = false;
        let query = res.result.fields
          .filter((each) => {
            if (each.id && each.id === "total_est") {
              isSupported = true;
            }
            if (
              (!each.info ||
                !each.info.notes.includes(
                  "(only available in download file)"
                )) &&
              each.type === "numeric"
            ) {
              return true;
            }
          })
          .map((each) => {
            titles[each.id] = each.info.label.split(";")[1]
              ? each.info.label.split(";")[1]
              : each.info.label.split(";")[0];
            return "avg(" + each.id + ") as avg_" + each.id;
          })
          .join();
        if (isSupported) {
          query =
            query +
            ",min(total_est) as min_total_est, max(total_est) as max_total_est";
          let url =
            "https://data.diversitydatakids.org/api/3/action/datastore_search_sql?sql=SELECT " +
            query +
            ' from "' +
            resourceId +
            "\" where name='" +
            filter +
            "'";
          jsonp(url, null, function (err, res) {
            if (err) {
              setWarning(true);
            } else {
              if (res.success) {
                let data = res.result.records[0];
                Axios.post(endPointObj.url + "getRegionalStats", {
                  NLGData: NLGData,
                  data: data,
                  titles: titles,
                  filter: filter,
                })
                  .then((result) => {
                    setRegionalStats(result.data);
                  })
                  .catch((error) => {});
              }
            }
          });
        }
      }
    });
  };

  const fetchCkanData = (filter) => {
    console.log("inside fetch data");
    if (resourceId === "") {
      setWarning(true);
      return;
    }
    createUrl(filter);
    setLoading(true);
    jsonp(myUrl.toString(), null, function (err, res) {
      let label = "";
      if (err) {
        setWarning(true);
        setLoading(false);
        return;
      } else {
        setColumns(
          res.result.fields
            .filter((each) => {
              if (
                !each.info ||
                !each.info.notes.includes("(only available in download file)")
              ) {
                return true;
              }
            })
            .map((field) => {
              if (field.info) {
                label = field.id;
                if (field.info.label.includes(";")) {
                  columnMap[field.id] = {
                    title: field.info.label.split(";")[1],
                    visible: true,
                  };
                  return {
                    name: field.id,
                    header: field.info.label
                      .split(";")[1]
                      .replace("Census", ""),
                    minWidth: 200,
                  };
                } else {
                  columnMap[field.id] = {
                    title: field.info.label,
                    visible: true,
                  };
                  return {
                    name: field.id,
                    header: field.info.label.replace("Census", ""),
                    minWidth: 200,
                  };
                }
              } else {
                columnMap[field.id] = { title: "id", visible: true };
                return { name: field.id, header: "id", visible: false };
              }
            })
        );
        setVisibleData(columnMap);
        console.log("column map", columnMap);
        setColumnMap(columnMap);
        setRows(res.result.records);
        setLoading(false);
      }
    });
  };

  const showBarChart = () => {
    setChartType("bar");
  };

  const showPieChart = () => {
    setChartType("pie");
  };

  const setVisibleData = (columnMap) => {
    for (const [key, value] of Object.entries(columnMap)) {
      if (
        key === "_id" ||
        key === "name" ||
        key === "geoid" ||
        key === "year" ||
        key === "total_est"
      ) {
        infoMap[key] = { title: value.title };
      } else {
        visibleMap[key] = { title: value.title };
      }
    }
    if (infoMap.total_est) {
      setSupported(true);
    } else {
      setSupported(false);
    }
    setVisibleMap(visibleMap);
    setInfoMap(infoMap);
  };

  const closeWarning = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };

  const onSelectionChange = useCallback(
    ({ selected: selectedMap, data }) => {
      console.log("selection");
      setRowData(data[0]);
      for (const [key, value] of Object.entries(infoMap)) {
        value.data = data[0][key];
        infoMap[key] = value;
      }
      setInfoMap(infoMap);
      for (const [key, value] of Object.entries(visibleMap)) {
        value.data = data[0][key];
        visibleMap[key] = value;
      }
      {
        let graphData = [];
        for (var key of Object.keys(data[0])) {
          if (key.includes("_est") && !key.includes("total_est")) {
            graphData.push({
              key: columnMap[key].title,
              value: data[0][key],
            });
          }
        }
        setGraphState(graphData);
      }
      setVisibleMap(visibleMap);
      if (supported) {
        Axios.post(endPointObj.url + "getRowText", {
          NLGData: NLGData,
          info: infoMap,
          data: visibleMap,
          stats: stats,
          resourceName: resourceName,
        })
          .then((result) => {
            setMessage(result.data);
          })
          .catch((error) => {
            setMessage("");
          });
      } else {
        setMessage("*NLG is not supported for this dataset");
      }
    },
    [supported, NLGData, infoMap, visibleMap, stats, resourceName]
  );

  let CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "1px solid #cccc",
          }}
        >
          <label>{payload[0].payload.payload.key}</label>
        </div>
      );
    }

    return null;
  };

  const onColumnVisibleChange = (data) => {
    setColumnMap((old) => {
      old[data.column.name].visible = data.visible;
      return old;
    });
    setVisibleMap((old) => {
      if (data.visible) {
        if (!old[data.column.name]) {
          old[data.column.name] = { title: columnMap[data.column.name].title };
        }
      } else {
        delete old[data.column.name];
      }
    });
  };

  const onFilterTextChange = (value) => {
    fetchFilterData(value);
  };
  return (
    <div className="App">
      <div id="title" style={{ marginLeft: "48px", display: "flex" }}>
        <Autocomplete
          id="combo-box-demo"
          options={name_filter}
          getOptionLabel={(option) => option}
          style={{ width: 300 }}
          value={name}
          disabled={name_filter.length > 0 ? false : true}
          onChange={(event, newValue) => {
            handleChangeNameFilter(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            onFilterTextChange(newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select Region" />
          )}
        />
        <Typography
          variant="h6"
          gutterBottom
          style={{ margin: "auto", marginLeft: "32px" }}
          className="Headings"
        >
          {displayData.title}
        </Typography>
      </div>
      <Snackbar open={warning} autoHideDuration={6000} onClose={closeWarning}>
        <Alert onClose={closeWarning} severity="error">
          Unable to fectch data
        </Alert>
      </Snackbar>
      <div style={{ marginTop: "8px" }}>
        <ReactDataGrid
          idProperty="_id"
          columns={columns}
          dataSource={rows}
          style={gridStyle}
          loading={loading}
          onSelectionChange={onSelectionChange}
          // onColumnVisibleChange={onColumnVisibleChange}
          selected={selected}
          pagination
          // limit={10}
          pageSizes={[5, 10, 20, 50]}
          // pagination="remote"
          // limit={pageSize}
        />
      </div>
      <div id="loadingNLG" style={{ display: "block", textAlign: "center" }}>
        {loadingStats && (
          <div style={{ marginTop: "128px" }}>
            <Spinner
              as="span"
              animation="grow"
              size="m"
              role="status"
              aria-hidden="true"
            />
            <div style={{}}>Generating Natural Language...</div>
          </div>
        )}
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ margin: "8px" }}>
          {supported && message !== "" && (
            <div>
              <Typography variant="h6" gutterBottom className="Headings">
                Selected Record data:
              </Typography>
              <Typography variant="body2" gutterBottom>
                {message.replace("<p>", "").replace("</p>", "")}
              </Typography>
            </div>
          )}
          {!supported && message !== "" && (
            <div>
              <Typography
                variant="body2"
                gutterBottom
                style={{ fontWeight: "700", color: "red" }}
              >
                {message}
              </Typography>
            </div>
          )}

          {
            <React.Fragment>
              <CssBaseline />

              <Container
                maxWidth="sm"
                className={chart == "pie" ? "pie" : "bar"}
              >
                {chart == "bar" && graphState.length > 0 && (
                  <BarChart
                    width={500}
                    height={200}
                    data={graphState}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="key" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                )}
              </Container>
            </React.Fragment>
          }
        </div>

        {supported && !loadingStats && (
          <div style={{ margin: "8px" }}>
            <div id="overview">
              <Typography variant="h6" gutterBottom className="Headings">
                Do you know ?
              </Typography>
              <Typography variant="body2" gutterBottom>
                {overview.replace("<p>", "").replace("</p>", "")}{" "}
                {ethnicStats.replace("<p>", "").replace("</p>", "")}
              </Typography>
            </div>
           {dispRegional && <div id="regional">
              <Typography variant="h6" gutterBottom className = "Headings">
                Geographic Data:
              </Typography>
              <Typography variant="body2" gutterBottom>
                {regionalStats.replace("<p>", "").replace("</p>", "")}
              </Typography>
            </div>}

            {/* <div>{message.replace("<p>", "").replace("</p>", "")}</div> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResourcePage;
