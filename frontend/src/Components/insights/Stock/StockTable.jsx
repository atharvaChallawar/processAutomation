import React from 'react';
import { useRackPerformanceData } from '../../data/RackPerformanceData';

function StockTable() {
  const { rackPerformanceData, error } = useRackPerformanceData();

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!rackPerformanceData || rackPerformanceData.length === 0) return <p className="text-gray-400 text-center py-4">Loading...</p>;


  const formattedData = rackPerformanceData.flatMap(rack => {
    const totalWeight = rack.products.reduce((sum, product) => sum + product.weight, 0);
    const status = totalWeight >= rack.maxCapacity ? "Full" : "Available";

    return rack.products.map(product => ({
      productId: product.productId,
      productName: product.productName,
      batchId: product.batchId,
      rackId: rack.rackId,
      quantity: product.quantity,

      status
    }));
  });

  return (
    <div className="mx-10 mt-6">

      <div className="grid grid-cols-6 bg-[#28A263] text-white text-sm font-semibold p-3 rounded-xl">
        <div className="text-left pl-4">Product ID</div>
        <div className="text-left">Product Name</div>
        <div className="text-left">Batch No</div>
        <div className="text-left">Rack ID</div>
        <div className="text-left">Quantity</div>
        <div className="text-left pr-4">Status</div>
      </div>

      <div className="divide-y divide-gray-700">
        {formattedData.map((item, index) => (
          <div key={index} className="grid grid-cols-6 text-white text-sm p-3">
            <div className="pl-4">{item.productId}</div>
            <div>{item.productName}</div>
            <div>{item.batchId || 'N/A'}</div>
            <div className="font-bold">{item.rackId}</div>
            <div>{item.quantity}</div>
            <div className={`font-bold ${item.status === "Full" ? "text-red-500" : "text-green-500"}`}>
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StockTable;
