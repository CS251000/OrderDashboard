"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchingData, setFetchingData] = useState(false);
  const [updatingData, setUpdatingData] = useState(false);

  // Fetch orders from the database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders`);
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const emailSet = new Set();
  const phoneSet = new Set();

  const flaggedOrders = orders.map((order) => {
    const isDuplicate =
      emailSet.has(order.customerEmail) && phoneSet.has(order.customerPhone);

    emailSet.add(order.customerEmail);
    phoneSet.add(order.customerPhone);

    return { ...order, flag: isDuplicate ? "flag Yes" : "flag No" };
  });

  const filteredOrders = flaggedOrders.filter((order) => {
    return (
      order.customerName.toLowerCase().includes(searchQuery) ||
      order.channelOrderId.toLowerCase().includes(searchQuery) ||
      order.customerEmail.toLowerCase().includes(searchQuery) ||
      order.customerPhone.toLowerCase().includes(searchQuery) ||
      order.customerPincode.toLowerCase().includes(searchQuery) ||
      order.customerCity.toLowerCase().includes(searchQuery) ||
      order.flag.toLowerCase().includes(searchQuery) ||
      order.customerState.toLowerCase().includes(searchQuery)
    );
  });

  
  const handleFetchData = async () => {
    setFetchingData(true);
    try {
      const response = await fetch(`/api/fetchsave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Data successfully fetched and saved!");
      } else {
        console.error("Error fetching data:", result.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setFetchingData(false);
  };

  const handleUpdateData = async () => {
    setUpdatingData(true);
    try {
      const response = await fetch(`/api/updateOrders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok) {
        alert("Missing data successfully updated!");
      } else {
        console.error("Error updating data:", result.message);
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
    setUpdatingData(false);
  };

  return (
    <div className="min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Order Dashboard</h1>

      {/* Manifest Button */}
      <Link href={"/manifest"}>
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4">
          Manifest
        </button>
      </Link>

      <input
        type="text"
        placeholder="Search by Name, Order ID, Email, Phone, Pincode, City, or State..."
        className="w-full mb-4 p-2 border border-gray-900 rounded"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
      />

      {/* Fetch Data Button */}
      <div className="mb-4">
        <button
          className={`bg-green-500 text-white py-2 px-4 rounded ${fetchingData ? "opacity-50 cursor-not-allowed" : ""}`}
          // onClick={handleFetchData}
          disabled={fetchingData}
        >
          {fetchingData ? "Fetching Data..." : "Fetch & Save Orders"}
        </button>
        <button
          className={`bg-yellow-500 text-white py-2 px-4 mx-4 rounded ${updatingData ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleUpdateData}
          disabled={updatingData}
        >
          {updatingData ? "Updating Data..." : "Update Missing Data"}
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Customer Email</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Address Line 1</th>
              <th className="px-4 py-2">Address Line 2</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">Pincode</th>
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Flag (Duplicate)</th>
            </tr>
          </thead>
          <tbody id="ordersTableBody">
            {filteredOrders.map((order) => (
              <tr key={order.channelOrderId} className="border-t">
                <td className="px-3 py-2 text-center">{order.channelOrderId}</td>
                <td className="px-3 py-2 text-center">{order.customerName}</td>
                <td className="px-3 py-2 text-center">{order.customerEmail}</td>
                <td className="px-3 py-2 text-center">{order.createdAt}</td>
                <td className="px-3 py-2 text-center">{order.customerPhone}</td>
                <td className="px-3 py-2 text-center">{order.customerAddress}</td>
                <td className="px-3 py-2 text-center">{order.customerAddress2}</td>
                <td className="px-3 py-2 text-center">{order.customerCity}</td>
                <td className="px-3 py-2 text-center">{order.customerState}</td>
                <td className="px-3 py-2 text-center">{order.customerPincode}</td>
                <td className="px-3 py-2 text-center">{order.customerCountry}</td>
                <td className="px-3 py-2 text-center">{order.flag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
