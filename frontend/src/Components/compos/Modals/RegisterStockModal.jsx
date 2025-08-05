import React, { useState } from "react";

function RegisterProductModal({ closeModal }) {
  const [formData, setFormData] = useState({
    productId: "",
    productName: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    
    if (!formData.productId || !formData.productName) {
      alert("All fields are required.");
      return;
    }

  

    setLoading(true);

    try {
      const response = await fetch(`https://backend-aq7v.onrender.com/api/products/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: formData.productId,
          productName: formData.productName
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to register product.");
      }

      alert("Product registered successfully!");
      closeModal();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1B1B1B] px-2 py-6 rounded-xl shadow-lg text-white w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-6">REGISTER PRODUCT</h2>

        <div className="flex flex-col gap-4 items-center">
          <input
            type="text"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            placeholder="PRODUCT ID"
            className="w-[270px] p-2 text-sm bg-gray-200 text-gray-700 rounded-xl border border-green-500"
          />

          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="PRODUCT NAME"
            className="w-[270px] p-2 text-sm bg-gray-200 text-gray-700 rounded-xl border border-green-500"
          />

        

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Registering..." : "REGISTER PRODUCT"}
          </button>
          <button onClick={closeModal} className="text-sm text-gray-400 mt-2">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterProductModal;
