import Navbar from '@/components/Navbar'
import React from 'react'

function page() {
  return (
    <div className="bg-gray-100 min-h-screen dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 md:ml-64 px-4 md:px-10 py-32 md:py-7 ">
        <h1 className="text-base sm:text-[28px] md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          VOBB Deal Management System Settings Page
        </h1>
      </main>
    </div>
  )
}

export default page