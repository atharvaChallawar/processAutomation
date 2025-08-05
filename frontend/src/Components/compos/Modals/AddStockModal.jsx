import React, { useState } from "react";

function AddStockModal({ closeModal }) {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    weight: "",
    rackId: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs
    if (!formData.productId || !formData.quantity || !formData.weight || !formData.rackId) {
      alert("All fields are required.");
      setLoading(false);
      return;
    }

    if (isNaN(formData.quantity) || isNaN(formData.weight)) {
      alert("Quantity and Weight must be numbers.");
      setLoading(false);
      return;
    }

    // Prepare stock data
    const stockData = {
      rackId:formData.rackId,
      productId: formData.productId,
      quantity: Number(formData.quantity),
      weight: Number(formData.weight),
    };

    try {
      const response = await fetch(`https://backend-aq7v.onrender.com/api/racks/add-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stockData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to add stock. Please check the rack ID.");

      }else{
        alert("Stock added successfully!");

      }

     
      setFormData({ productId: "", quantity: "", weight: "", rackId: "" });
      closeModal();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1B1B1B] px-2 py-6 rounded-xl shadow-lg text-white w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-6">ADD NEW STOCK</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-center">
          <input
            type="text"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            placeholder="PRODUCT ID"
            className="w-[270px] p-2 text-sm bg-[#F4F4F4] text-gray-600 rounded-3xl border border-[#28A263] focus:outline-[#28A263]"
          />

          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="QUANTITY"
            className="w-[270px] p-2 text-sm bg-[#F4F4F4] text-gray-600 rounded-3xl border border-[#28A263] focus:outline-[#28A263]"
          />

          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="WEIGHT"
            className="w-[270px] p-2 text-sm bg-[#F4F4F4] text-gray-600 rounded-3xl border border-[#28A263] focus:outline-[#28A263]"
          />

          <input
            type="text"
            name="rackId"
            value={formData.rackId}
            onChange={handleChange}
            placeholder="RACK_ID/LOCATION"
            className="w-[270px] p-2 text-sm bg-[#F4F4F4] text-gray-600 rounded-3xl border border-[#28A263] focus:outline-[#28A263]"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-max min-w-[150px] py-2 text-white font-bold rounded-xl ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#28A263] hover:opacity-80"
            }`}
          >
            {loading ? "Adding..." : "ADD STOCK"}
          </button>

          <button onClick={closeModal} className="text-sm text-gray-400 mt-2">
            Close
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStockModal;
