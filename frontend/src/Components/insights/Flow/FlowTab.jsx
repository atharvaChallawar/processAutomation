import React from "react";
import { useRackPerformanceData } from '../../data/RackPerformanceData';

const StockTable = ({ searchQuery }) => {
  const { rackPerformanceData, error } = useRackPerformanceData();

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!rackPerformanceData || rackPerformanceData.length === 0) return <p className="text-gray-400 text-center py-4">Loading...</p>;

  const sortedProducts = rackPerformanceData
    .flatMap(rack => rack.products.map(product => ({ 
      ...product, 
      rackId: rack.rackId 
    })))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const groupedProducts = sortedProducts.reduce((acc, product) => {
    if (!acc[product.productId]) {
      acc[product.productId] = {
        productId: product.productId,
        productName: product.productName,
        racks: [] 
      };
    }
    acc[product.productId].racks.push(product.rackId);
    return acc;
  }, {});

  const filteredProducts = Object.values(groupedProducts).filter(product =>
    product.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-6 mx-10">
      <div className="grid grid-cols-3 bg-[#28A263] text-white text-sm font-semibold p-3 rounded-t-xl">
        <div className="text-left pl-4">PRODUCT ID</div>
        <div className="text-left">PRODUCT NAME</div>
        <div className="text-left">RACK NO (FIFO ORDER)</div>
      </div>

      <div className="divide-y divide-gray-700 bg-[#222222] rounded-b-xl">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div 
              key={index}
              className="grid grid-cols-3 text-white text-sm p-3 items-center hover:bg-[#2d2d2d] transition-colors"
            >
              <div className="pl-4 font-medium text-[#28A263]">{product.productId}</div>
              <div className="text-gray-200">{product.productName}</div>
              <div className="font-mono text-gray-300">{product.racks.join(", ")}</div>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-center py-4 bg-[#222222]">
            No products found
          </div>
        )}
      </div>
    </div>
  );
};

export default StockTable;