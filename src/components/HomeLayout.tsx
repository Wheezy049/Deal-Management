import React from 'react'
import Deal from './Deal'

function HomeLayout() {
  return (
    <div className='bg-gray-100 w-full h-full dark:bg-gray-900 transition-colors'>
      <div className='px-4 md:px-20 py-10 md:py-20'>
        <h1 className='text-base sm:text-[28px] md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6'>Welcome to VOBB Deal Management System</h1>
        <Deal />
      </div>
    </div>
  )
}

export default HomeLayout