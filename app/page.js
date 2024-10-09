"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import FilterModal from "@/components/FilterModal";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchingData, setFetchingData] = useState(false);
  const [updatingData, setUpdatingData] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); 
  const [filters, setFilters] = useState({ paymentMethod: "", flag: "Repeat", courierPartner: "" }); 
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      if (formData.fromDate && formData.toDate) {
        try {
          const response = await axios.get(`/api/orders?from=${formData.fromDate}&to=${formData.toDate}`);
          console.log("Fetched Orders:", response.data.orders);
          setOrders(response.data.orders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        }
      }
    };
    fetchOrders();
  }, [formData]);

  const emailSet = new Set();
  const phoneSet = new Set();
  const addressSet = new Set();

  //DeliveredDate - CreatedAt = Time taken in days
  const calculateTimeTaken = (createdAt, deliveredDate) => {
    if (createdAt && deliveredDate) {
      const created = new Date(createdAt);
      const delivered = new Date(deliveredDate);
      const diffTime = Math.abs(delivered - created);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    }
    return "N/A";
  };

  // Finding the flagged orders
  const flaggedOrders = orders.map((order) => {
    const isDuplicate =
      emailSet.has(order.customerEmail) &&
      phoneSet.has(order.customerPhone) ||
      addressSet.has(order.customerAddress);

    emailSet.add(order.customerEmail);
    phoneSet.add(order.customerPhone);
    addressSet.add(order.customerAddress);

    return { ...order, flag: isDuplicate ? "Repeat" : "New" };
  });

  //Filter orders by applying the filters in modal
  const filteredOrders = flaggedOrders.filter((order) => {
    const matchesFilters =
      (filters.paymentMethod ? order.paymentMethod.toLowerCase().includes(filters.paymentMethod.toLowerCase()) : true) &&
      (filters.flag ? order.flag.toLowerCase().includes(filters.flag.toLowerCase()) : true) &&
      (filters.courierPartner ? order.shipments && order.shipments[0]?.courier.toLowerCase().includes(filters.courierPartner.toLowerCase()) : true);
  
//Search functionality
    return (
      matchesFilters &&
      (order.customerEmail.toLowerCase().includes(searchQuery) ||
      order.customerPhone.toLowerCase().includes(searchQuery) ||
      order.customerPincode.toLowerCase().includes(searchQuery))
    );
  });

  //Function to fetch and save all the data in the datbase
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

  //Function to refresh the data on button click
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //Date filter button submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.get(`/api/orders?from=${formData.fromDate}&to=${formData.toDate}`);
      setOrders(response.data.orders);  
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  

  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters);
  };

  return (
    <div className="min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">MyNachiketa Order Dashboard</h1>

      {/* <Link href={"/manifest"}>
        <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4">
          Manifest
        </button>
      </Link> */}


      {/* SearchBar */}
      <input
        type="text"
        placeholder="Search by Email, Phone, Pincode..."
        className="w-full mb-4 p-2 border border-gray-900 rounded"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
      />
      {/* Fetch, Update and Filters button */}
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
          // onClick={handleUpdateData}
          disabled={updatingData}
        >
          {updatingData ? "Refreshing Data..." : "Refresh Data"}
        </button>
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded"
          onClick={() => setIsFilterModalOpen(true)}
        >
          Open Filters
        </button>
      </div>

      {/* Date form to input from and to Dates */}
      <form onSubmit={handleSubmit} className="space-y-4 my-3">
        <div className="flex flex-col space-x-4">
          <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
            From Date
          </label>
          <input
            type="date"
            id="fromDate"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="mt-1  border border-gray-300 rounded-md shadow-sm p-2 text-black"
          />
          <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
            To Date
          </label>
          <input
            type="date"
            id="toDate"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="mt-1  border border-gray-300 rounded-md shadow-sm p-2 text-black"
          />
        </div>

        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </form>


      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Channel Order ID</th>
              <th className="px-4 py-2">Customer Name</th>
              <th className="px-4 py-2">Customer Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Payment Method</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">ETD</th>
              <th className="px-4 py-2">Delivered Date</th>
              <th className="px-4 py-2">Time Taken</th>
              <th className="px-4 py-2">Courier Partner Name</th>
              <th className="px-4 py-2">Address Line 1</th>
              <th className="px-4 py-2">Address Line 2</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">Pincode</th>
              <th className="px-4 py-2">Flag(Repeat/New?)</th>
            </tr>
          </thead>
          <tbody id="ordersTableBody">
            {filteredOrders.map((order) => (
              <tr key={order.channelOrderId} className="border-t">
                <td className="px-3 py-2 text-center">{order.channelOrderId}</td>
                <td className="px-3 py-2 text-center">{order.customerName}</td>
                <td className="px-3 py-2 text-center">{order.customerEmail}</td>
                <td className="px-3 py-2 text-center">{order.customerPhone}</td>
                <td className="px-3 py-2 text-center">{order.paymentMethod}</td>
                <td className="px-3 py-2 text-center">{order.createdAt}</td>
                <td className="px-3 py-2 text-center">
                  {order.shipments && order.shipments.length > 0 ? order.shipments[0].etd : "No ETD "}
                </td>
                <td className="px-3 py-2 text-center">
                  {order.shipments && order.shipments.length > 0 ? order.shipments[0].deliveredDate : "No Delivered Date "}
                </td>
                <td className="px-3 py-2 text-center">
                  {calculateTimeTaken(order.createdAt, order.shipments && order.shipments[0]?.deliveredDate)}
                </td>
                <td className="px-3 py-2 text-center">
                  {order.shipments && order.shipments.length > 0 ? order.shipments[0].courier : "No Courier "}
                </td>
                <td className="px-3 py-2 text-center">{order.customerAddress}</td>
                <td className="px-3 py-2 text-center">{order.customerAddress2}</td>
                <td className="px-3 py-2 text-center">{order.customerCity}</td>
                <td className="px-3 py-2 text-center">{order.customerState}</td>
                <td className="px-3 py-2 text-center">{order.customerPincode}</td>
                <td className={`px-3 py-2 text-center text-black ${order.flag == "New" ? "bg-green-300" : "bg-red-300"}`}>
                  {order.flag}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={handleApplyFilters}
          filters={filters}
        />
      )}
    </div>
  );
}
