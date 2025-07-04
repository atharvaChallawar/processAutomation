import React from 'react';
import Tabular from '../../insights/Tabular';

function Tabs() {
  return (
    <div className="w-full max-w-4xl h-[400px] mt-10 ml-14 bg-[#1b1b1b] bg-opacity-50 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-[#28A263] flex flex-col overflow-hidden">
      <h1 className="text-5xl font-bold text-[#28A263] text-left">
        TABULAR
      </h1>
      <div className="mt-6 flex-1 overflow-auto"> 
        <Tabular />
      </div>
    </div>
  );
}

export default Tabs;