import React, { useState } from "react";
import { Search } from "lucide-react";
import StockTable from "../insights/Flow/FlowTab"; 

const StockFlow = () => {
  const [searchQuery, setSearchQuery] = useState(""); 

  return (
    <div className="flex-1 bg-[#1B1B1B] h-screen overflow-y-auto px-4 ml-2">
      <div className="flex justify-start items-start w-max mt-5 px-10 py-3 bg-[#1A1F1A] 
                      text-white font-bold text-xl shadow-lg max-w-[90%] md:max-w-[60%] mx-auto text-center">
        <span className="text-[#28A263] font-jakarta text-2xl">Stock Flow</span>
        <h1>: Product Search & Queuing</h1>
      </div>

      <div className="flex justify-between items-center mt-10 mx-11">
        <h1 className="text-[#28A263] font-semibold text-4xl drop-shadow-[2px_2px_0px_white]">
          STOCK MOVEMENT AND QUEUING
        </h1>
        <div className="relative flex items-center bg-white px-4 py-2 rounded-full w-[250px] shadow-md">
          <Search className="text-gray-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search Product Here" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="ml-2 outline-none bg-transparent text-black w-full placeholder-gray-500"
          />
        </div>
      </div>

      <StockTable searchQuery={searchQuery} />
    </div>
  );
};

export default StockFlow;
