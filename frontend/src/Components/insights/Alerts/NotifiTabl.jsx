import React from 'react';
import { useRackPerformanceData } from '../../data/RackPerformanceData';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiPackage } from 'react-icons/fi';

const NotifiTab = () => {
  const { rackPerformanceData, error } = useRackPerformanceData();

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!rackPerformanceData || rackPerformanceData.length === 0) return <p className="text-gray-400 text-center py-4">Loading...</p>;


  const getAlerts = () => {
    const alerts = [];

    rackPerformanceData.forEach(rack => {
      const totalWeight = rack.products.reduce((sum, p) => sum + p.weight, 0);
      const capacityPercentage = (totalWeight / rack.maxCapacity) * 100;

      if (capacityPercentage >= 75) {
        alerts.push({
          type: 'rack',
          message: `Rack ${rack.rackId} is at ${Math.round(capacityPercentage)}% capacity`,
          severity: capacityPercentage >= 90 ? 'critical' : 'warning',
          timestamp: new Date().toLocaleTimeString()
        });
      }
    });


    rackPerformanceData.forEach(rack => {
      rack.products.forEach(product => {
        if (product.quantity <= 10) {
          alerts.push({
            type: 'product',
            message: `Low stock: ${product.productName} (${product.quantity} remaining)`,
            severity: 'warning',
            timestamp: new Date().toLocaleTimeString()
          });
        }
      });
    });

    return alerts;
  };

  const alerts = getAlerts();

  return (
    <div className="bg-[#222222] rounded-xl p-4 mt-4 max-h-96 overflow-y-auto">
      {alerts.length === 0 ? (
        <div className="text-gray-400 text-center py-4">
          No active alerts
        </div>
      ) : (
        alerts.map((alert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 mb-3 rounded-lg flex items-center ${
              alert.severity === 'critical' ? 'bg-red-900/50' : 'bg-yellow-900/50'
            }`}
          >
            <div className="mr-3">
              {alert.type === 'rack' ? (
                <FiAlertCircle className={`w-6 h-6 ${
                  alert.severity === 'critical' ? 'text-red-400' : 'text-yellow-400'
                }`} />
              ) : (
                <FiPackage className="text-blue-400 w-6 h-6" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{alert.message}</div>
              <div className="text-xs text-gray-400 mt-1">{alert.timestamp}</div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default NotifiTab;