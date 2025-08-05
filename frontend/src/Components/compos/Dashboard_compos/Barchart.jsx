import React from 'react';
import RackBar from '../../insights/Bar';

function Barchart() {
  return (
    <div className="w-full max-w-4xl h-[400px] mt-10 ml-14 bg-[#1b1b1b] bg-opacity-50 backdrop-blur-md shadow-lg rounded-2xl p-4 border border-[#28A263] overflow-hidden">
      <div>
        <h1 className="text-5xl font-bold text-[#28A263]">
          BARCHART
        </h1>
        <div className="mt-6 h-[calc(100%-80px)]"> {/* Adjust height to fit container */}
          <RackBar />
        </div>
      </div>
    </div>
  );
}

export default Barchart;