import React from 'react'
import Deal from './Deal'
import Navbar from './Navbar'

function HomeLayout() {
  return (
    <div className="bg-gray-100 min-h-screen dark:bg-gray-900 transition-colors flex flex-col md:flex-row w-full">
      {/* Sidebar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 md:ml-48 px-4 md:px-10 py-28 md:py-6 overflow-x-hidden">
        <h1 className="text-base sm:text-[28px] md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Dashboard
        </h1>
        <Deal />
      </main>
    </div>
  )
}

export default HomeLayout