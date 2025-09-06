import React from 'react'
import Navbar from './Navbar'
import Deal from './Deal'

function HomeLayout() {
  return (
    <div className='bg-gray-100 w-full h-screen dark:bg-gray-900 transition-colors'>
        <Navbar />
        <div className='mt-10 px-4 md:px-20'>
            <h1 className='text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4'>Welcome to VOBB Deal Management System</h1>
            <Deal />
        </div>
    </div>
  )
}

export default HomeLayout