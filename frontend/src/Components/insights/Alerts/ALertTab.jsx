import React from 'react';
import { useRackPerformanceData } from "../../data/RackPerformanceData"; 

function AlertTab() {
  const { rackPerformanceData, error } = useRackPerformanceData();

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (rackPerformanceData.length === 0) return <p>Loading...</p>;


  const getStatus = (totalWeight, maxCapacity) => {
    if (totalWeight >= maxCapacity * 0.75) return { label: "CRITICAL", color: "bg-red-600 text-white" };
    if (totalWeight >= maxCapacity * 0.5) return { label: "WARNING", color: "bg-yellow-500 text-white" };
    return { label: "LOW", color: "bg-green-600 text-white" };
  };


  const getWarnings = () => {
    const warnings = [];
 
    rackPerformanceData.forEach(rack => {
      const totalWeight = rack.products.reduce((sum, p) => sum + p.weight, 0);
      const capacityPercentage = (totalWeight / rack.maxCapacity) * 100;

      if (capacityPercentage >= 75) {
        warnings.push({
          type: 'capacity',
          message: `Rack ${rack.rackId} is reaching its full capacity (${Math.round(capacityPercentage)}%)`,
          severity: capacityPercentage >= 90 ? 'critical' : 'warning'
        });
      }
    });

    rackPerformanceData.forEach(rack => {
      rack.products.forEach(product => {
        if (product.quantity <= 10) {
          warnings.push({
            type: 'stock',
            message: `Low stock alert: ${product.productName} (${product.quantity} remaining) in Rack ${rack.rackId}`,
            severity: 'warning'
          });
        }
      });
    });

    return warnings;
  };

  return (
    <div className="mx-10 mt-6">
      {/* Original Table */}
      <div className="grid grid-cols-7 bg-[#28A263] text-white text-sm font-semibold p-3 rounded-xl">
        <div className="text-left pl-4">RACK ID</div>
        <div className="text-left">PRODUCT ID</div>
        <div className="text-left">PRODUCT NAME</div>
        <div className="text-left">BATCH NO</div>
        <div className="text-left">QUANTITY</div>
        <div className="text-left">WEIGHT</div>
        <div className="text-left">STATUS</div>
      </div>

      <div className="divide-y divide-gray-700 bg-[#222222] rounded-b-xl">
        {rackPerformanceData.map((rack, rackIndex) => {
          const totalWeight = rack.products.reduce((sum, p) => sum + p.weight, 0);
          const status = getStatus(totalWeight, rack.maxCapacity);

          return (
            <div key={rackIndex} className="border-b border-gray-700">
              {rack.products.map((product, productIndex) => (
                <div key={productIndex} className="grid grid-cols-7 text-white text-sm p-3 items-center">
                  <div className="pl-4">{rackIndex === 0 || productIndex === 0 ? rack.rackId : ""}</div>
                  <div>{product.productId}</div>
                  <div>{product.productName}</div>
                  <div>{product.batchId}</div>
                  <div>{product.quantity}</div>
                  <div>{product.weight}KG</div>
                  {productIndex === 0 && (
                    <div 
                      className={`w-full h-8 flex items-center justify-center font-bold rounded-3xl ${status.color}`}
                      rowSpan={rack.products.length}
                    >
                      {status.label}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Warnings Section */}
      <div className="mt-8 p-6 bg-[#1b1b1b] rounded-xl border border-[#28A263]/30">
        <h2 className="text-2xl font-bold text-[#28A263] mb-4 flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          ACTIVE WARNINGS
        </h2>

        {getWarnings().length === 0 ? (
          <div className="text-gray-400 text-center py-4">
            No active warnings - All systems normal
          </div>
        ) : (
          <div className="space-y-3">
            {getWarnings().map((warning, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg flex items-center ${
                  warning.severity === 'critical' 
                    ? 'bg-red-900/20 border border-red-600/50' 
                    : 'bg-yellow-900/20 border border-yellow-600/50'
                }`}
              >
                <span className={`mr-3 text-xl ${
                  warning.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  ⚠️
                </span>
                <div className="text-sm font-medium text-white">
                  {warning.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AlertTab;