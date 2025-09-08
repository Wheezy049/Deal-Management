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
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
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
    }, 1000);
  };

  if (loading) return <p>Loading deals...</p>;
  if (error) return <p>{error}</p>;
  if (deals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px] w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 p-4 rounded">
        <p>No deals found</p>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-x-auto">
      {/* Toggle buttons */}
      <div className="mb-2 flex gap-2">
        {columnKeys.map(col => (
          <button
            key={col}
            onClick={() => toggleColumn(col)}
            className={`px-2 py-1 rounded transition-colors duration-200 ${columnsVisible[col] ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'
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
                  <button
                    onClick={() => setConfirmDeleteId(deal.id)}
                    className="text-red-500 hover:underline ml-2"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this deal? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDeleteId !== null) handleDelete(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                {isDeleting ? "Deleting" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default DealTable;
