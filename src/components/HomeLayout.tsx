"use client"
import React from 'react'
import Deal from './Deal'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

function HomeLayout() {
  return (
    <div className="bg-gray-100 min-h-screen dark:bg-gray-900 transition-colors flex flex-row w-full">
      {/* Sidebar */}
      <Sidebar />
      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-52">
        <Navbar />
        {/* Main content */}
        <main className="flex-1 px-4 md:px-10 py-6 overflow-y-auto">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 dark:text-gray-200 mb-6">
            Pipeline Dashboard
          </h1>
          <Deal />
        </main>
      </div>
    </div>
  )
}

export default HomeLayout;