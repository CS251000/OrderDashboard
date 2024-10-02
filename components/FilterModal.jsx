"use client"
import { useState } from "react";
const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [flag, setFlag] = useState('');
  const [courierPartner, setCourierPartner] = useState('');

  const handleApply = () => {
    onApply({ paymentMethod, flag, courierPartner });
    onClose();
  };
  const handleCancel = () => {
    setPaymentMethod('');
    setFlag('');
    setCourierPartner('');
    onClose();  
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <input
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Courier Partner</label>
            <input
              type="text"
              value={courierPartner}
              onChange={(e) => setCourierPartner(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Repeat/New?</label>
            <input
              type="text"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Clear
            </button>
            <button
              onClick={handleApply}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default FilterModal;
