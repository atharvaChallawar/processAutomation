import { useState, useEffect } from "react";

export const rackPerformanceData = []; 

const fetchData = async (setData, setError) => {
  try {
    const response = await fetch("http://localhost:3000/getdata");
    if (!response.ok) throw new Error("Failed to fetch data");
    const result = await response.json();
    setData(result);
  } catch (err) {
    setError(err.message);
  }
};

export const useRackPerformanceData = () => {
  const [rackPerformanceData, setRackPerformanceData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(setRackPerformanceData, setError);
  }, []);

  return { rackPerformanceData, error };
};
