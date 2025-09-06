import React from 'react'
import type { Deal } from '@/store/useDealStore'

type Props = {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
};

function ViewDealModal({ isOpen, onClose, deal }: Props) {

    if (!isOpen || !deal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Deal Details</h2>

        <div className="space-y-2">
          <p>
            <span className="font-medium">Client Name:</span> {deal.clientName}
          </p>
          <p>
            <span className="font-medium">Product Name:</span> {deal.productName}
          </p>
          <p>
            <span className="font-medium">Stage:</span> {deal.stage}
          </p>
          <p>
            <span className="font-medium">Created Date:</span> {deal.createdAt}
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewDealModal