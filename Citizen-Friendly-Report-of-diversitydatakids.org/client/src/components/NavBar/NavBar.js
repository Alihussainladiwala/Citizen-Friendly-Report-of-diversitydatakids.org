import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    textAlign: "center",
    marginRight: "128px",
    flexGrow: 1,
  },
}));

export default function NavBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        
        <Toolbar>
        <Link to="/" style={{color:"white", marginRight:"32px", textDecoration:"none", fontSize:"x-large"}}> Home</Link>
          <Typography variant="h6" className={classes.title}>
            Citizen Friendly Report of diversitydatakids.org
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
