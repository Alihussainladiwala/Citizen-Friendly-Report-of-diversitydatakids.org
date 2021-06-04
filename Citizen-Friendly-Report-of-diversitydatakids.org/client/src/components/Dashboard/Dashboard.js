import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import TextCard from "../TextCard/TextCard";
import Axios from "axios";
import "./Dashboard.css";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SimpleContainer() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getDisabilityChartData().then((result) => {
      console.log(result.data);
      setData(result.data);
    });
  }, []);

  const getDisabilityChartData = () => {
    return new Promise((resolve, reject) => {
      Axios.get("http://"+window.location.hostname+":5000/nationDisabilityChart/asian").then(
        (result) => {
          resolve(result);
        }
      );
    });
  };

  return (
    <div className="chart-bg">
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="percent" fill="#8884d8" />
          </BarChart>
        </Container>
        <TextCard />
      </React.Fragment>
    </div>
  );
}
