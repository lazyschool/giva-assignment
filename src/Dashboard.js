// src/Dashboard.js
import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import ChartComponent from "./ChartComponent";
import CreateChart from "./CreateChart";

const Dashboard = () => {
  const [charts, setCharts] = useState([]);

  useEffect(() => {
    const fetchCharts = async () => {
      const chartsSnapshot = await getDocs(collection(db, "charts"));
      setCharts(chartsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchCharts();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <CreateChart />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {charts.map(chart => (
          <div key={chart.id} style={{ width: "300px", margin: "20px" }}>
            <ChartComponent chartId={chart.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
