import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Axios from "axios";
import "./TextCard.css";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function TextCard() {
  const [content, setContent] = useState([]);
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  const getDisabilitytext = () => {
    return new Promise((resolve, reject) => {
      Axios.get("http://"+window.location.hostname+":5000/nationDisabilityText/asian").then(
        (result) => {
          resolve(result);
        }
      );
    });
  };

  useEffect(() => {
    getDisabilitytext().then((result) => {
      console.log(result.data.ans);
      setContent(result.data.ans);
    });
  }, []);

  return (
    <Card className={classes.root} className="text-card-bg">
      {content.map((data) => (
        <CardContent>{data}</CardContent>
      ))}
    </Card>
  );
}
