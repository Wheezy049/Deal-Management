import React from 'react'
import type { Deal } from '@/types/deals'

type Props = {
    isOpen: boolean;
    onClose: () => void;
    deal: Deal | null;
};

function ViewDealModal({ isOpen, onClose, deal }: Props) {

    if (!isOpen || !deal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl">
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
                        {deal.description && (
                            <span className="font-medium">Description: {deal.description}</span>
                        )}
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
