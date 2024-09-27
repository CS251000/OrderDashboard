"use client";
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';

export default function ManifestPage() {
  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
  });
  const [orderIds, setOrderIds] = useState([]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.get(`/api/manifests?from=${formData.fromDate}&to=${formData.toDate}`);
      
      const ids = response.data.map(order => order.id); 
      setOrderIds(ids);
      
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const printManifests = async () => {
    if (orderIds.length === 0) {
      console.warn("No order IDs available for printing.");
      return;
    }

    try {
      
      const response = await axios.post('/api/print-manifests', {
        order_ids: orderIds 
      });
      
      const manifestUrl = response.data.manifest_url;
  
      if (manifestUrl) {
        window.open(manifestUrl, '_blank'); 
      } else {
        console.error("Manifest URL not returned.");
      }
      
    } catch (error) {
      console.error("Error printing manifests:", error.response?.data || error.message);
    }
  };
  
  
  return (
    <div className="container mx-auto p-4">
      <Link href={'/'}>
        <button className='bg-white text-black'>HomePage</button>
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-black">Manifest</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
            From Date
          </label>
          <input
            type="date"
            id="fromDate"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
          />
        </div>

        <div>
          <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
            To Date
          </label>
          <input
            type="date"
            id="toDate"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-black"
          />
        </div>

        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Submit
        </button>
      </form>

      {orderIds.length > 0 && ( 
        <div className="mt-8">
          <h2 className="text-xl font-bold">Orders:</h2>
          <ul>
            {orderIds.map((id) => (
              <li key={id} className="text-black inline">
                {id + (orderIds.length - 1 === orderIds.indexOf(id) ? '' : ' , ')} 
              </li>
            ))}
          </ul>
        </div>
      )}
      

      <button onClick={printManifests} className='bg-black text-white p-2 my-3'>Print Manifest</button>
      
    </div>
  );
}
