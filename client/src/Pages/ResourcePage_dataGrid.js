import Axios from "axios";
import { useEffect, useState } from "react";
import jsonp from "jsonp";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { Button, FormControl, FormGroup, Snackbar, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

function ResourcePage(props) {
  const [genText, setGenText] = useState([]);
  // const [resourceID, setResourceId] = useState(
  //   "61430b80-e431-4db0-a7f1-490ec1c9a7d8"
  // );
  const { resourceId, NLGData, displayData } = props.data;
  const [warning, setWarning] = useState(false);
  const [rowData, setRowData] = useState({});
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortModel, setSortModel] = useState();
  const [limit, setLimit] = useState(10);
  const [gridData, setGridData] = useState({});
  const [columnMap, setColumnMap] = useState({});

  let myUrl = "";

  useEffect(() => {
    fetchCkanData();
  }, [props]);
  const createUrl = () => {
    const base =
      "https://data.diversitydatakids.org/api/3/action/datastore_search";
    myUrl = new URL(base);
    myUrl.searchParams.append("limit", limit);
    myUrl.searchParams.append("resource_id", resourceId);
  };
  const fetchCkanData = () => {
    if (resourceId === "") {
      setWarning(true);
      return;
    }
    createUrl();
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
                // label = field.info.label.split(";")[1];
                label = field.id;
                // if (!label) {
                //   label = field.info.label;
                // }
                setColumnMap((old) => {
                  if (field.info.label.includes(";")) {
                    return {
                      ...old,
                      [field.id]: field.info.label.split(";")[1],
                    };
                  } else {
                    return { ...old, [field.id]: field.info.label };
                  }
                });
                return {
                  field: field.id,
                  headerName: label,
                  width: 150,
                };
              } else {
                setColumnMap((old) => {
                  return { ...old, id: "id" };
                });
                return { field: field.id, headerName: "id", hide:true };
              }
            })
        );
        setRows(res.result.records);
        setLoading(false);
      }
    });
  };

  const updateRows = (params) => {};

  const closeWarning = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };
  return (
    <div className="App">
      <Snackbar open={warning} autoHideDuration={6000} onClose={closeWarning}>
        <Alert onClose={closeWarning} severity="error">
          Please enter correct resource id
        </Alert>
      </Snackbar>
      <Typography variant="h4" gutterBottom>
        {displayData.title}
      </Typography>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id}
          // navigation
          pagination
          pageSize={pageSize}
          rowCount={rowCount}
          paginationMode="server"
          rowsPerPageOptions={[5, 10, 20, 50, 100]}
          onPageChange={(params) => {
            updateRows(params);
          }}
          onPageSizeChange={(params) => {
            updateRows(params);
          }}
          //sorting
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={updateRows}
          //filters
          filterMode="server"
          onFilterModelChange={updateRows}
          components={{
            Toolbar: GridToolbar,
          }}
          onRowSelected={(rowData) => {
            setRowData(rowData);
          }}
        />
        <Button
          style={{ margin: "8px", display: "block", marginLeft: "auto" }}
          variant="contained"
          color="primary"
          disabled={!(rowData && rowData.isSelected)}
          onClick={() => {
            console.log({
              NLGData: NLGData,
              columnMap: columnMap,
              rowData: rowData.data,
            });
          }}
        >
          Generate Text for selected row
        </Button>
      </div>
    </div>
  );
}

export default ResourcePage;
