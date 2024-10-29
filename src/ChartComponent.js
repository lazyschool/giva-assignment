// src/ChartComponent.js
import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Line, Bar, Pie } from "react-chartjs-2";
import ChartJS from "chart.js/auto";

const ChartComponent = ({ chartId }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [type, setType] = useState("line");
  const [newDataPoint, setNewDataPoint] = useState({ label: "", value: "" });

  useEffect(() => {
    const chartRef = doc(db, "charts", chartId);
    const unsubscribe = onSnapshot(chartRef, (snapshot) => {
      const data = snapshot.data();
      setType(data?.type || "line");
      setChartData({
        labels: data?.data.map((point) => point.label),
        datasets: [
          {
            label: "Dataset",
            data: data?.data.map((point) => point.value),
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    });

    return () => unsubscribe();
  }, [chartId]);

  const handleAddDataPoint = async () => {
    if (!newDataPoint.label || !newDataPoint.value) return;
    const chartRef = doc(db, "charts", chartId);
    const currentData = (await chartRef.get()).data()?.data || [];
    await updateDoc(chartRef, {
      data: [...currentData, { label: newDataPoint.label, value: Number(newDataPoint.value) }],
    });
    setNewDataPoint({ label: "", value: "" });
  };

  const handleRemoveDataPoint = async (index) => {
    const chartRef = doc(db, "charts", chartId);
    const currentData = (await chartRef.get()).data()?.data || [];
    currentData.splice(index, 1);
    await updateDoc(chartRef, { data: currentData });
  };

  const handleChangeType = async (newType) => {
    const chartRef = doc(db, "charts", chartId);
    await updateDoc(chartRef, { type: newType });
  };

  return (
    <div>
      <h2>Chart: {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      {type === "line" && <Line data={chartData} />}
      {type === "bar" && <Bar data={chartData} />}
      {type === "pie" && <Pie data={chartData} />}
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Label"
          value={newDataPoint.label}
          onChange={(e) => setNewDataPoint({ ...newDataPoint, label: e.target.value })}
        />
        <input
          type="number"
          placeholder="Value"
          value={newDataPoint.value}
          onChange={(e) => setNewDataPoint({ ...newDataPoint, value: e.target.value })}
        />
        <button onClick={handleAddDataPoint}>Add Data Point</button>
      </div>
      <div>
        <h4>Current Data Points:</h4>
        {chartData.labels.map((label, index) => (
          <div key={index}>
            <span>
              {label}: {chartData.datasets[0].data[index]}
            </span>
            <button onClick={() => handleRemoveDataPoint(index)}>Remove</button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <h4>Change Chart Type:</h4>
        <button onClick={() => handleChangeType("line")}>Line</button>
        <button onClick={() => handleChangeType("bar")}>Bar</button>
        <button onClick={() => handleChangeType("pie")}>Pie</button>
      </div>
    </div>
  );
};

export default ChartComponent;
