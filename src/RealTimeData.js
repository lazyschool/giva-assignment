// src/RealTimeData.js
import React, { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const RealTimeData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Reference to Firestore collection
    const collectionRef = collection(db, "test");

    console.log("aaaaaaaaa",)


    // Set up real-time listener
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        console.log(snapshot.docs.length)
      const dataArray = snapshot.docs.map((doc) => ({

        id: doc.id,
        ...doc.data(),
      }));
      setData(dataArray);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Real-Time Data from Firestore</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
};

export default RealTimeData;
