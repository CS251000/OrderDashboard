"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchingData, setFetchingData] = useState(false);
  const [updatingData, setUpdatingData] = useState(false);
  const [deletingProducts, setDeletingProducts] = useState(false); // New state for delete operation

  // Fetch orders from the database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders?page=${page}`);
        setOrders(response.data.orders);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [page]);

  // Filter orders based on the search query
  const filteredOrders = orders.filter((order) => {
    return (
      order.channel_order_id.toLowerCase().includes(searchQuery) ||
      order.customer_email.toLowerCase().includes(searchQuery) ||
      order.customer_phone.toLowerCase().includes(searchQuery) ||
      order.customer_pincode.toLowerCase().includes(searchQuery) ||
      order.customer_city.toLowerCase().includes(searchQuery) ||
      order.customer_state.toLowerCase().includes(searchQuery)
    );
  });

  // Fetch new data and save to Prisma
  const handleFetchData = async () => {
    setFetchingData(true);
    try {
      const response = await fetch(`/api/fetchsave?totalpages=${totalPages}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totalPages }),
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

  // Update missing data from API to Prisma
  const handleUpdateData = async () => {
    setUpdatingData(true);
    try {
      const response = await fetch(`/api/updateOrders`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
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

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by Order ID, Email, Phone, Pincode, City, or State..."
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
            </tr>
          </thead>
          <tbody id="ordersTableBody">
            {filteredOrders.map((order) => (
              <tr key={order.channel_order_id} className="border-t">
                <td className="px-3 py-2 text-center">{order.channel_order_id}</td>
                <td className="px-3 py-2 text-center">{order.customer_name}</td>
                <td className="px-3 py-2 text-center">{order.customer_email}</td>
                <td className="px-3 py-2 text-center">{order.created_at}</td>
                <td className="px-3 py-2 text-center">{order.customer_phone}</td>
                <td className="px-3 py-2 text-center">{order.customer_address}</td>
                <td className="px-3 py-2 text-center">{order.customer_address_2}</td>
                <td className="px-3 py-2 text-center">{order.customer_city}</td>
                <td className="px-3 py-2 text-center">{order.customer_state}</td>
                <td className="px-3 py-2 text-center">{order.customer_pincode}</td>
                <td className="px-3 py-2 text-center">{order.customer_country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-300 text-black py-2 px-4 rounded"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="self-center">
          Page {page} of {totalPages}
        </span>
        <button
          className="bg-gray-300 text-black py-2 px-4 rounded"
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
