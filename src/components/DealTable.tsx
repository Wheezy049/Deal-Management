"use client"
import { useDealStore } from '@/store/useDealStore'
import React, { useEffect } from 'react'
import type { Deal } from '@/store/useDealStore';

type Props = {
  setIsUpdateOpen: (isOpen: boolean) => void;
  setIsViewOpen: (isOpen: boolean) => void;
  setSelectedDeal: (deal: Deal | null) => void;
}


function DealTable({ setIsUpdateOpen, setIsViewOpen, setSelectedDeal }: Props) {

  const { deals, loading, error, fetchDeals, deleteDeal } = useDealStore();

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals])

  const handleDelete = async (id: number) => {
    await deleteDeal(id);
  }


  if (loading) return <p>Loading deals...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">Client Name</th>
            <th className="p-3 border">Product Name</th>
            <th className="p-3 border">Stage</th>
            <th className="p-3 border">Created At</th>
            <th className='p-3 border'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.id} className="text-center border-b">
              <td className="p-3 capitalize dark:text-white">{deal.clientName}</td>
              <td className="p-3 capitalize dark:text-white">{deal.productName}</td>
              <td className="p-3 capitalize dark:text-white">{deal.stage}</td>
              <td className="p-3 dark:text-white">{new Date(deal.createdAt).toLocaleDateString()}</td>
              <td className="p-3">
                <button onClick={() => { setSelectedDeal(deal); setIsViewOpen(true); }} className="text-green-500 hover:underline">View</button>
                <button onClick={() => { setSelectedDeal(deal); setIsUpdateOpen(true); }} className="text-blue-500 hover:underline ml-2">Edit</button>
                <button onClick={() => handleDelete(deal.id)} className="text-red-500 hover:underline ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )
}

export default DealTable