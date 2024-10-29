// src/CreateChart.js
import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const CreateChart = () => {
  const [chartName, setChartName] = useState("");
  const [chartType, setChartType] = useState("line");

  const handleCreateChart = async () => {
    const newChart = {
      name: chartName,
      type: chartType,
      data: [],
    };

    await addDoc(collection(db, "charts"), newChart);
    setChartName("");
  };

  return (
    <div>
      <h3>Create a New Chart</h3>
      <input
        type="text"
        placeholder="Chart Name"
        value={chartName}
        onChange={(e) => setChartName(e.target.value)}
      />
      <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
        <option value="line">Line</option>
        <option value="bar">Bar</option>
        <option value="pie">Pie</option>
      </select>
      <button onClick={handleCreateChart}>Create Chart</button>
    </div>
  );
};

export default CreateChart;
