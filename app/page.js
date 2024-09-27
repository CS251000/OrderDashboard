"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    return (
      order.channel_order_id.toLowerCase().includes(searchQuery) ||
      order.customer_email.toLowerCase().includes(searchQuery) ||
      order.customer_phone.toLowerCase().includes(searchQuery) ||
      order.customer_pincode.toLowerCase().includes(searchQuery) ||
      order.customer_city.toLowerCase().includes(searchQuery) ||
      order.customer_state.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <div className="min-h-screen bg-white text-black p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Order Dashboard</h1>

      <input
        type="text"
        placeholder="Search by Order ID, Email, Phone, Pincode, City, or State..."
        className="w-full mb-4 p-2 border border-gray-900 rounded"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
      />

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
            {filteredOrders.map(order => (
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
    </div>
  );
}
