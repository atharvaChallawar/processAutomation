import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useRackPerformanceData } from "../../data/RackPerformanceData";

function Stockchart() {
  const { rackPerformanceData, error } = useRackPerformanceData();

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!rackPerformanceData || rackPerformanceData.length === 0) return <p className="text-gray-400 text-center py-4">Loading...</p>;


  const transformedData = rackPerformanceData.map((rack) => {
    const totalWeight = rack.products.reduce((sum, product) => sum + product.weight, 0);
    return {
      rackId: rack.rackId,
      totalWeight,
      remainingCapacity: rack.maxCapacity - totalWeight, 
    };
  });

  return (
    <div className="w-full flex flex-col justify-center items-center bg-[#1B1B1B] py-6">
      <ResponsiveContainer width="60%" height={350}>
        <BarChart data={transformedData} barCategoryGap="5%">  
          <XAxis 
            dataKey="rackId" 
            stroke="#FFF" 
            label={{ value: "Rack ID", position: "insideBottom", dy: 10, fill: "#FFF" }}
            tick={{ fill: "#FFF", fontSize: 14 }} 
            padding={{ left: 10, right: 10 }} 
          />
          <YAxis 
            stroke="#FFF" 
            domain={[0, 20]} 
            label={{ value: "Weight (kg)", angle: -90, position: "insideLeft", fill: "#FFF" }}
            tick={{ fill: "#FFF", fontSize: 14 }} 
          />

          <Tooltip cursor={{ fill: "transparent" }} />
          <Legend 
            verticalAlign="top"
            align="right"
            wrapperStyle={{ color: "#FFF", fontSize: 14 }}
            payload={[
              { value: "Current Weight", type: "circle", color: "#2DDB81" },
              { value: "Remaining Capacity", type: "circle", color: "#FF8486" }
            ]}
          />
          <Bar dataKey="totalWeight" fill="#2DDB81" barSize={35} name="Current Weight" stackId="a" />
          <Bar dataKey="remainingCapacity" fill="#FF8486" barSize={35} name="Remaining Capacity" stackId="a" />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Stockchart;
