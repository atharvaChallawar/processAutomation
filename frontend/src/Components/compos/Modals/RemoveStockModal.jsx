import React, { useState } from "react";

function RemoveStockModal({ closeModal }) {
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    weight: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Validate input fields
    if (!formData.productId || !formData.quantity || !formData.weight) {
      alert("All fields are required.");
      setLoading(false);
      return;
    }

    if (isNaN(formData.quantity) || Number(formData.quantity) <= 0) {
      alert("Quantity must be a positive number.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/racks/remove-stock`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: formData.productId,
          weight: formData.weight,
          quantity: Number(formData.quantity),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove stock. Please check your input.");
      }

      const data = await response.json();

      let details = data.removalSummary
      .map(entry => `Rack ${entry.rackId}: ${entry.quantityRemoved}`)
      .join("\n");

      alert(`${data.message}\n${details}`);


      // Reset form and close modal
      setFormData({ productId: "", quantity: "", weight: "" });
      closeModal();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1B1B1B] p-6 rounded-xl shadow-lg text-white w-[400px]">
        <h2 className="text-2xl font-bold font-jakarta text-center mb-6">REMOVE STOCK</h2>

        <div className="flex flex-col gap-6">
          <input
            type="text"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            placeholder="PRODUCT ID"
            className="p-2 text-sm font-jakarta bg-[#F4F4F4] text-gray-600 rounded-3xl border border-[#FF4C4C] focus:outline-2 focus:outline-[#FF4C4C]"
          />

          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="QUANTITY"
            className="p-2 text-sm font-jakarta bg-[#F4F4F4] text-gray-600 rounded-3xl border border-[#FF4C4C] focus:outline-2 focus:outline-[#FF4C4C]"
          />

          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Weight"
            className="p-2 text-sm font-jakarta bg-[#F4F4F4] text-gray-600 rounded-3xl border border-[#FF4C4C] focus:outline-2 focus:outline-[#FF4C4C]"
          />

          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" required /> CONFIRM FOR REMOVING
          </label>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`p-3 rounded-3xl font-semibold mt-2 ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#FF4C4C] hover:opacity-80"
            }`}
          >
            {loading ? "Removing..." : "REMOVE STOCK"}
          </button>
          <button onClick={closeModal} className="text-sm text-gray-400 mt-2">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemoveStockModal;
