import { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import headerImage from "../resources/diversityImage.PNG";
import bgImage from "../resources/bgImage.PNG";
import "./SearchPage.css";
import {
  Hidden,
  IconButton,
  InputBase,
  Paper,
  Snackbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Alert from "@material-ui/lab/Alert";
import Axios from "axios";
import { Link } from "react-router-dom";
import jsonp from "jsonp";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "auto",
    margin: "16px 32px",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

const useStylesModal = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "70vw",
    height: "40vw",
    overflow: "Hidden",
  },
}));

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}))(Tooltip);

function BootstrapTooltip(props) {
  const classes = useStylesBootstrap();

  return <Tooltip arrow classes={classes} {...props} />;
}
function SearchPage() {
  const classesModal = useStylesModal();
  const classes = useStyles();
  const [rowData, setRowData] = useState({});
  const [rows, setRows] = useState([]);
  const [input, setInput] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [subTopics, setSubTopics] = useState({});
  const columns = [
    {
      field: "title",
      headerName: "Topics",
      headerClassName: "grid-header",
      flex: 300,
      renderCell: (params) => {
        return (
          <div
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "initial",
              lineHeight: "normal",
              maxHeight: "48px",
            }}
          >
            <Link
              style={{
                textOverflow: "ellipsis",
                whiteSpace: "initial",
                lineHeight: "normal",
                maxHeight: "48px",
              }}
              to={"/packages?id=" + params.getValue("id")}
            >
              {params.value}
            </Link>
          </div>
        );
      },
    },
    {
      field: "notes",
      headerName: "Topic Details",
      headerClassName: "grid-header",
      flex: 400,
      renderCell: (params) => {
        return (
          <span
            className="table-cell-trucate"
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "initial",
              lineHeight: "normal",
              maxHeight: "48px",
            }}
          >
            {params.value}
          </span>
          // </BootstrapTooltip>
        );
      },
    },
    {
      field: "id",
      headerName: "id",
      width: 500,
      headerClassName: "grid-header",
      hide: true,
    },
  ];
  const [warning, setWarning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const closeWarning = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarning(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (sessionStorage.getItem("modalOpen") !== "true") {
      setOpen(true);
      sessionStorage.setItem("modalOpen", true);
    }

    fetchCkanData("");
    fetchSubTopics();
  }, []);

  const fetchCkanData = (input) => {
    setLoading(true);
    Axios.post("http://"+window.location.hostname+":5000/search", {
      input: input,
    })
      .then((result) => {
        setRows(result.data.results);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };
  const fetchSubTopics = () => {
    Axios.post("http://"+window.location.hostname+":5000/subtopics", {
      input: input,
    })
      .then((result) => {
        setSubTopics(result.data.result.facets.vocab_Subtopic);
      })
      .catch((err) => {});
  };
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "250px" }}>
        <Typography
          variant="subtitle2"
          style={{ margin: "16px", marginBottom: "0px", fontWeight: "700" }}
          className="Headings"
        >
          Available Categories
        </Typography>
        <Divider />
        <List
          component="nav"
          aria-label="Sub Topics"
          dense={true}
          style={{ height: "550px", overflow: "auto" }}
        >
          {Object.keys(subTopics).map((each, id) => {
            return (
              <ListItem
                key={id}
                button
                onClick={(e) => {
                  setInput(e.target.innerText);
                  fetchCkanData(e.target.innerText);
                }}
              >
                <ListItemText primary={each} />
              </ListItem>
            );
          })}
        </List>
      </div>
      <div style={{ width: "100%" }}>
        <Paper component="form" className={classes.root}>
          <InputBase
            type="input"
            className={classes.input}
            placeholder="Search Datasets..."
            inputProps={{ "aria-label": "search datasets" }}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                fetchCkanData(input);
              }
            }}
          />
          <IconButton
            className={classes.iconButton}
            aria-label="search"
            onClick={(e) => {
              fetchCkanData(input);
            }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
        <div style={{ margin: "8px" }}>
          <Snackbar
            open={warning}
            autoHideDuration={6000}
            onClose={closeWarning}
          >
            <Alert onClose={closeWarning} severity="error">
              Unable to fetch data
            </Alert>
          </Snackbar>
        </div>
        <div style={{ height: "500px", width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            getRowId={(row) => row.id}
            pageSize={20}
            autoHeight={false}
            onRowSelected={(e) => {
              setRowData(e.data);
              setIsSelected(e.isSelected);
            }}
          />
        </div>
        {/* <div style={{margin:"16px",display:"flex"}} >
      {isSelected && <Link style={{marginLeft:"auto"}} to={"/packages?id=" + rowData.id } >
          Show Geographic datasets
        </Link>}
      </div> */}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classesModal.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classesModal.paper}>
            <div className="row">
              <div className="col-sm-11">
                <img src={headerImage} />
              </div>
              <div className="col-sm-1 close">
                <b onClick={handleClose}>X</b>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-8">
                <img src={bgImage} className="body-image" />
              </div>
              <div className="col-sm-4 font-style">
                &nbsp;&nbsp;&nbsp;&nbsp;Welcome to data diversity kids website
                we have over 6000 datasets and 324 topics available to browse
                through. <br /> &nbsp;&nbsp;&nbsp;&nbsp;We believe all children
                deserve the opportunity to thrive. We also believe that when
                opportunity is shared equitably, everyone benefits. For
                children, opportunity includes the conditions and resources they
                need to grow up healthy and learn. This includes the resources
                available to their families, in the schools they attend and in
                the neighborhoods where they live.
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default SearchPage;
