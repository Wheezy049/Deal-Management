import React from 'react'
import type { Deal } from '@/types/deals'

type Props = {
    isOpen: boolean;
    onClose: () => void;
    deal: Deal | null;
};

function ViewDealModal({ isOpen, onClose, deal }: Props) {

    if (!isOpen || !deal) return null;

    // Helper to format currency
    const formatCurrency = (value?: number) => {
        if (value === undefined || value === null) return "$0.00";
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md sm:max-w-lg text-gray-900 dark:text-gray-100 animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">Deal Details</h2>
                <div className="space-y-4 divide-y divide-gray-100 dark:divide-gray-800">
                    <div className="pt-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Client Name</span>
                        <span className="text-base font-medium capitalize mt-0.5 block">{deal.clientName}</span>
                    </div>     
                    <div className="pt-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Product Name</span>
                        <span className="text-base font-medium capitalize mt-0.5 block">{deal.productName}</span>
                    </div>
                    <div className="pt-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Stage</span>
                        <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 capitalize mt-1">
                            {deal.stage}
                        </span>
                    </div>
                    <div className="pt-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Deal Value</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white mt-0.5 block">
                            {formatCurrency(deal.amount)}
                        </span>
                    </div>
                    {deal.description && (
                        <div className="pt-3">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Description</span>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap leading-relaxed">
                                {deal.description}
                            </p>
                        </div>
                    )}
                    <div className="pt-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Created Date</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300 mt-0.5 block">
                            {new Date(deal.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>
                <div className="flex justify-end mt-6 pt-2">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg transition-colors outline-none"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ViewDealModal;