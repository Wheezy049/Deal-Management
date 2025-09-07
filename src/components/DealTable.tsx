"use client"
import { useDealStore } from '@/store/useDealStore'
import React, { useEffect, useState } from 'react'
import type { Deal, ColumnVisibility } from '@/types/deals';

type Props = {
  setIsUpdateOpen: (isOpen: boolean) => void;
  setIsViewOpen: (isOpen: boolean) => void;
  setSelectedDeal: (deal: Deal | null) => void;
};

function DealTable({ setIsUpdateOpen, setIsViewOpen, setSelectedDeal }: Props) {
  const { deals, loading, error, fetchDeals, deleteDeal } = useDealStore();
  const [isDeleting, setIsDeleting] = useState<{ [id: number]: boolean }>({});
  const [columnsVisible, setColumnsVisible] = useState<ColumnVisibility>({
    clientName: true,
    productName: true,
    stage: true,
    createdAt: true,
    actions: true,
  });
  const columnKeys: (keyof ColumnVisibility)[] = [
    "clientName",
    "productName",
    "stage",
    "createdAt",
    "actions",
  ];

  // Fetch deals on mount
  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  // Load visibility from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dealTableColumns');
    if (saved) {
      const parsed = JSON.parse(saved);
      setColumnsVisible(prev => {
        const clean: ColumnVisibility = { ...prev };
        columnKeys.forEach(key => {
          if (key in parsed) clean[key] = parsed[key];
        });
        return clean;
      });
    }
  }, []);

  // Save visibility to localStorage
  useEffect(() => {
    localStorage.setItem('dealTableColumns', JSON.stringify(columnsVisible));
  }, [columnsVisible]);

  // toggle column visibility
  const toggleColumn = (col: keyof ColumnVisibility) => {
    setColumnsVisible(prev => ({ ...prev, [col]: !prev[col] }));
  };

  // handle delete
  const handleDelete = (id: number) => {
    setIsDeleting(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      deleteDeal(id)
        .finally(() => setIsDeleting(prev => ({ ...prev, [id]: false })));
    }, 2000);
  };

  if (loading) return <p>Loading deals...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 overflow-x-auto">
      {/* Toggle buttons */}
      <div className="mb-2 flex gap-2">
        {columnKeys.map(col => (
          <button
            key={col}
            onClick={() => toggleColumn(col)}
            className={`px-2 py-1 rounded ${columnsVisible[col] ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
          >
            {columnsVisible[col] ? `Hide ${col}` : `Show ${col}`}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            {columnsVisible.clientName && <th className="p-3 border">Client Name</th>}
            {columnsVisible.productName && <th className="p-3 border">Product Name</th>}
            {columnsVisible.stage && <th className="p-3 border">Stage</th>}
            {columnsVisible.createdAt && <th className="p-3 border">Created At</th>}
            {columnsVisible.actions && <th className="p-3 border">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {deals.map(deal => (
            <tr key={deal.id} className="text-center border-b">
              {columnsVisible.clientName && <td className="p-3 capitalize dark:text-white">{deal.clientName}</td>}
              {columnsVisible.productName && <td className="p-3 capitalize dark:text-white">{deal.productName}</td>}
              {columnsVisible.stage && <td className="p-3 capitalize dark:text-white">{deal.stage}</td>}
              {columnsVisible.createdAt && <td className="p-3 dark:text-white">{new Date(deal.createdAt).toLocaleDateString()}</td>}
              {columnsVisible.actions && (
                <td className="p-3 dark:text-white">
                  <button onClick={() => { setSelectedDeal(deal); setIsViewOpen(true); }} className="text-green-500 hover:underline">View</button>
                  <button onClick={() => { setSelectedDeal(deal); setIsUpdateOpen(true); }} className="text-blue-500 hover:underline ml-2">Edit</button>
                  <button onClick={() => handleDelete(deal.id)} className="text-red-500 hover:underline ml-2">
                    {isDeleting[deal.id] ? "Deleting..." : "Delete"}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DealTable;
