"use client"
import React, { use, useState } from 'react'
import KanbanBoard from './KanbanBoard'
import DealTable from './DealTable'

function Deal() {

    const [activeView, setActiveView] = useState<"table" | "kanban">("table")

    return (
        <div>
            <div className="w-full flex justify-between items-center mb-6">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex items-center shadow-sm">
                    <button
                        className={`px-4 py-2 rounded-l-lg transition-colors duration-200 ${activeView === "table"
                            ? "bg-white text-gray-900 shadow-md"
                            : "text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveView("table")}
                    >
                        Table
                    </button>
                    <button
                        className={`px-4 py-2 rounded-r-lg transition-colors duration-200 ${activeView === "kanban"
                            ? "bg-white text-gray-900 shadow-md"
                            : "text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveView("kanban")}
                    >
                        Kanban
                    </button>
                </div>

                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-colors duration-200">
                    + Add New Deal
                </button>
            </div>
            {
                activeView === "kanban" ? <KanbanBoard /> : <DealTable />
            }
        </div>
    )
}

export default Deal