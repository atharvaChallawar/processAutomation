import React, { useState } from 'react';
import Stockchart from '../insights/Stock/StockChart';
import StockTable from '../insights/Stock/StockTable';
import AddStockModal from '../../Components/compos/Modals/AddStockModal';
import RemoveStockModal from '../compos/Modals/RemoveStockModal';
import RegisterProductModal from '../compos/Modals/RegisterStockModal';

function StockOps() {
  const [modalType, setModalType] = useState(null); 

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <div className="flex-1 ml-2 bg-[#1B1B1B] h-screen overflow-y-auto">

      <div className="flex justify-start items-start w-max mt-5 px-10 py-3 bg-[#1A1F1A] 
                      text-white font-bold text-xl shadow-lg max-w-[90%] md:max-w-[60%] mx-auto 
                      text-center">  
        <span className="text-[#28A263]">StockOps</span> : Inventory | Management & Operations
      </div>


      <div className="flex items-center justify-between mt-10 mx-10">
        <h1 className="text-[#28A263] font-semibold text-4xl drop-shadow-[2px_2px_0px_white]">
          EXISTING STOCK
        </h1>
        <button 
          onClick={() => setModalType("register")}
          className="bg-[#28A263] text-center px-4 py-3 font-jakarta font-semibold 
                          text-sm rounded-xl hover:drop-shadow-[0px_0px_2px_white]">
          REGISTER PRODUCT
        </button>
      </div>

      <div className="flex flex-col">
        <Stockchart />
        <StockTable />
      </div>

      <div className="flex justify-center items-center mt-10 gap-4">
        <button 
          onClick={() => setModalType("add")}
          className="bg-[#28A263] text-white px-6 py-3 text-sm font-semibold rounded-xl 
                          hover:drop-shadow-[0px_0px_5px_white] min-w-[140px]">
          ADD STOCK
        </button>
        <button 
          onClick={() => setModalType("remove")}
          className="bg-[#FF4C4C] text-white px-6 py-3 text-sm font-semibold rounded-xl 
                          hover:drop-shadow-[0px_0px_5px_white] min-w-[140px]">
          REMOVE STOCK
        </button>
      </div>
      {modalType === "add" && <AddStockModal closeModal={closeModal} />}
      {modalType === "remove" && <RemoveStockModal closeModal={closeModal} />}
      {modalType === "register" && <RegisterProductModal closeModal={closeModal} />}
    </div>
  );
}

export default StockOps;
