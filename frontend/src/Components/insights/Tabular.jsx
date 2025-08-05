import React from "react";
import { useRackPerformanceData } from '../data/RackPerformanceData'

const RackTable = () => {
  const { rackPerformanceData, error } = useRackPerformanceData(); 

  if (error) return <p className="text-red-500">Error: {error}</p>; 
  if (rackPerformanceData.length === 0) return <p>Loading...</p>;
  
  // Flatten rack data by iterating through racks and their products
  const formattedData = rackPerformanceData.flatMap((rack) =>
    rack.products.map((product) => ({
      productId: product.productId,
      productName: product.productName,
      batchId: product.batchId || "N/A", // Handle missing batch ID
      rackId: rack.rackId,
      weight: product.weight,
      quantity: product.quantity,
    }))
  );

  return (
    <div className="bg-[#1b1b1b] text-white p-4 rounded-lg shadow-lg overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Rack Inventory</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-800 text-gray-200">
            <th className="p-2">Product ID</th>
            <th className="p-2">Product Name</th>
            <th className="p-2">Batch No</th>
            <th className="p-2">Rack ID</th>
            <th className="p-2">Weight (kg)</th>
            <th className="p-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {formattedData.map((item, index) => (
            <tr key={index} className="border-b border-gray-700 text-center">
              <td className="p-2">{item.productId}</td>
              <td className="p-2">{item.productName}</td>
              <td className="p-2">{item.batchId}</td>
              <td className="p-2 font-bold">{item.rackId}</td>
              <td className="p-2">{item.weight} kg</td>
              <td className="p-2">{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RackTable;