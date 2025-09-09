"use client"
import { useDealStore } from '@/store/useDealStore'
import React, { useEffect, useState, useMemo } from 'react'
import { Search, Columns, MoreVertical } from 'lucide-react'
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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState<number | null>(null);
  const [columnsVisible, setColumnsVisible] = useState<ColumnVisibility>({
    clientName: true,
    productName: true,
    stage: true,
    description: false,
    createdAt: true,
    actions: true,
  });

  const columnKeys: (keyof ColumnVisibility)[] = [
    "clientName",
    "productName",
    "stage",
    "description",
    "createdAt",
    "actions",
  ];

  const columnLabels = {
    clientName: "Client Name",
    productName: "Product Name",
    stage: "Stage",
    description: "Description",
    createdAt: "Created At",
    actions: "Actions"
  };

  const rowsPerPage = 6;

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

  // deals filter based on search query
  const filteredDeals = useMemo(() => {
    const sorted = [...deals].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (!searchQuery.trim()) return sorted;

    return sorted.filter(deal =>
      deal.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.stage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [deals, searchQuery]);

  // Pagination
  const paginatedDeals = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredDeals.slice(startIndex, endIndex);
  }, [filteredDeals, currentPage]);

  const totalPages = Math.ceil(filteredDeals.length / rowsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // toggle column visibility
  const toggleColumn = (col: keyof ColumnVisibility) => {
    setColumnsVisible(prev => ({ ...prev, [col]: !prev[col] }));
  };

  // handle delete
  const handleDelete = (id: number) => {
    setIsDeleting(prev => ({ ...prev, [id]: true }));
    setShowActionsDropdown(null);
    setTimeout(() => {
      deleteDeal(id)
        .finally(() => {
          setIsDeleting(prev => ({ ...prev, [id]: false }));
          setConfirmDeleteId(null);
        });
    }, 1000);
  };

  // Handle pagination
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 2;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 mx-1 rounded transition-colors ${currentPage === i
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(<span key="ellipsis" className="px-2 text-gray-500">...</span>);
    }

    return pages;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-gray-600 dark:text-gray-400">Loading deals...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-red-500">{error}</p>
    </div>
  );

  return (
    <div className=''>
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 w-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Table View</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Columns Dropdown */}
              <div className="relative w-full sm:w-auto">
                <button
                  onClick={() => setShowColumnsDropdown(!showColumnsDropdown)}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Columns className="w-4 h-4" />
                  <span className="sm:inline">Columns</span>
                </button>

                {showColumnsDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                    <div className="p-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Toggle Columns</div>
                      {columnKeys.filter(col => col !== 'actions').map(col => (
                        <label key={col} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={columnsVisible[col]}
                            onChange={() => toggleColumn(col)}
                            className="text-blue-600 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {columnLabels[col]}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {filteredDeals.length === 0 ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <p className="text-gray-500 dark:text-gray-400">No deals found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {columnsVisible.clientName && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Client Name
                      </th>
                    )}
                    {columnsVisible.productName && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product Name
                      </th>
                    )}
                    {columnsVisible.stage && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Stage
                      </th>
                    )}
                    {columnsVisible.description && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                    )}
                    {columnsVisible.createdAt && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created At
                      </th>
                    )}
                    {columnsVisible.actions && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white  dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedDeals.map((deal) => (
                    <tr key={deal.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      {columnsVisible.clientName && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                          {deal.clientName}
                        </td>
                      )}
                      {columnsVisible.productName && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                          {deal.productName}
                        </td>
                      )}
                      {columnsVisible.stage && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                          {deal.stage}
                        </td>
                      )}
                      {columnsVisible.description && (
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {deal.description || 'No description'}
                        </td>
                      )}
                      {columnsVisible.createdAt && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(deal.createdAt).toLocaleDateString()}
                        </td>
                      )}
                      {columnsVisible.actions && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="relative inline-block">
                            <button
                             aria-label="More vertical"
                              onClick={() => setShowActionsDropdown(showActionsDropdown === deal.id ? null : deal.id)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {showActionsDropdown === deal.id && (
                              <div className={`absolute mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 ${paginatedDeals.indexOf(deal) >= paginatedDeals.length - 2
                                ? 'bottom-full mb-2'
                                : 'top-full'
                                } right-0`}>
                                <button
                                  onClick={() => {
                                    setSelectedDeal(deal);
                                    setIsUpdateOpen(true);
                                    setShowActionsDropdown(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedDeal(deal);
                                    setIsViewOpen(true);
                                    setShowActionsDropdown(null);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(deal.id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className=" px-2 sm:px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 sm:justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {((currentPage - 1) * rowsPerPage) + 1} - {Math.min(currentPage * rowsPerPage, filteredDeals.length)} of {filteredDeals.length}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {renderPaginationNumbers()}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDeleteId !== null && (
          <div role='dialog' aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
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
                  }}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  {isDeleting[confirmDeleteId] ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Click outside handlers */}
        {showColumnsDropdown && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setShowColumnsDropdown(false)}
          />
        )}
        {showActionsDropdown && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setShowActionsDropdown(null)}
          />
        )}
      </div>
    </div>
  );
}

export default DealTable;
