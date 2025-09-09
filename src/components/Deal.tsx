"use client"
import React, { useState, useEffect } from 'react'
import KanbanBoard from './KanbanBoard'
import DealTable from './DealTable'
import CreateDealModal from './CreateDealModal';
import UpdateDealModal from './UpdateDealModal';
import type { Deal } from '@/types/deals';
import ViewDealModal from './ViewDealModal';
import { useDealStore } from '@/store/useDealStore';
import { KanbanSquare, LayoutGrid } from 'lucide-react';

function Deal() {
    const [isCreatOpen, setIsCreatOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const { currentView, setCurrentView } = useDealStore();

    useEffect(() => {
        const saved = localStorage.getItem('dealCurrentView');
        if (saved === 'table' || saved === 'kanban') {
            setCurrentView(saved);
        }
    }, [setCurrentView]);

    return (
        <div className="w-full overflow-x-hidden">
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                {/* Toggle buttons */}
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex flex-row items-stretch sm:items-center shadow-sm gap-2">
                    <button
                        className={`px-4 py-2 rounded-lg sm:rounded-l-lg transition-colors duration-200 ${currentView === "table"
                            ? "bg-white text-gray-900 shadow-md"
                            : "text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setCurrentView("table")}
                    >
                         <LayoutGrid className='w-5 h-5' />
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg sm:rounded-r-lg transition-colors duration-200 ${currentView === "kanban"
                            ? "bg-white text-gray-900 shadow-md"
                            : "text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setCurrentView("kanban")}
                    >
                        <KanbanSquare className='w-5 h-5' />
                    </button>
                </div>

                <button
                    onClick={() => setIsCreatOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-colors duration-200"
                >
                    + Add New Deal
                </button>
            </div>
            {/* conditional rendering of table or kanban */}
            {
                currentView === "kanban" ? <KanbanBoard setIsUpdateOpen={setIsUpdateOpen} setIsViewOpen={setIsViewOpen} setSelectedDeal={setSelectedDeal} /> : <DealTable setIsUpdateOpen={setIsUpdateOpen} setIsViewOpen={setIsViewOpen} setSelectedDeal={setSelectedDeal} />
            }

            {/* create deal modal */}
            <CreateDealModal isOpen={isCreatOpen} onClose={() => setIsCreatOpen(false)} />
            {/* update deal modal */}
            <UpdateDealModal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} deal={selectedDeal} />
            {/* view deal modal */}
            <ViewDealModal isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} deal={selectedDeal} />
        </div>
    )
}

export default Deal