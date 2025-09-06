import React from 'react'

function DealTable() {

   const deals = [
     {
        id: 1,
        clientName: "Client A",
        productName: "Product X",
        stage: "Lead Generated",
        createdAt: "2023-10-01"
     }
   ]


  return (
    <div className="p-4 overflow-x-auto">
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 border">Client Name</th>
            <th className="p-3 border">Product Name</th>
            <th className="p-3 border">Stage</th>
            <th className="p-3 border">Created At</th>
            <th className='p-3 border'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.id} className="text-center border-b">
              <td className="p-3">{deal.clientName}</td>
              <td className="p-3">{deal.productName}</td>
              <td className="p-3">{deal.stage}</td>
              <td className="p-3">{new Date(deal.createdAt).toLocaleDateString()}</td>
              <td className="p-3">
                <button className="text-blue-500 hover:underline">Edit</button>
                <button className="text-green-500 hover:underline ml-2">View</button>
                <button className="text-red-500 hover:underline ml-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )
}

export default DealTable