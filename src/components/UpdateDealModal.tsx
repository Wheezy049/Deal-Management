import { useDealStore } from '@/store/useDealStore';
import React, { useState, useEffect } from 'react'
import type { Deal } from '@/types/deals';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    deal: Deal | null;
};

function UpdateDealModal({ isOpen, onClose, deal }: Props) {
    const { updateDeal, fetchEntities, clients, products } = useDealStore();
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState<Deal | null>(deal);

    // populate form when deal changes
    useEffect(() => {
        setFormData(deal);
    }, [deal]);

    // fetch clients and products on mount
    useEffect(() => {
        const fetchData = async () => {
            await fetchEntities();
        };
        fetchData();
    }, []);

    // handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (!formData) return;
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            [name]: name === "amount" ? (value === "" ? 0 : Number(value)) : value 
        });
    };

    // handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        if (!formData) return;
        setTimeout(() => {
            updateDeal(formData.id, formData).then(() => {
                setIsUpdating(false);
                onClose();
            });
        }, 1000);
    };

    if (!isOpen || !formData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl text-gray-900 dark:text-gray-100 animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent dark:from-green-400 dark:to-teal-400">Update Deal</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="update-client" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Client</label>
                        <select
                            id="update-client"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                            required
                        >
                            <option value="">Select Client</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.name}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="update-product" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Product</label>
                        <select
                            id="update-product"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                            required
                        >
                            <option value="">Select Product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.name}>{product.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="update-stage" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Stage</label>
                        <select
                            id="update-stage"
                            name="stage"
                            value={formData.stage}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                        >
                            <option>Lead Generated</option>
                            <option>Contacted</option>
                            <option>Application Submitted</option>
                            <option>Application Under Review</option>
                            <option>Deal Finalized</option>
                            <option>Payment Confirmed</option>
                            <option>Completed</option>
                            <option>Lost</option>
                        </select>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="update-amount" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Deal Value ($)</label>
                        <input
                            type="number"
                            id="update-amount"
                            name="amount"
                            value={formData.amount === 0 ? "" : formData.amount}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                            placeholder="e.g. 15000"
                            min="0"
                        />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="update-description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            id="update-description"
                            name="description"
                            value={formData.description || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                            placeholder="Description (optional)"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            disabled={isUpdating} 
                            type="submit" 
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-green-500/10 hover:shadow-green-500/20"
                        >
                            {isUpdating ? "Updating..." : "Update Deal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateDealModal;