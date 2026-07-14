import { useDealStore } from '@/store/useDealStore';
import React, { useState } from 'react'
import type { DealFormState, Props } from '@/types/deals';

function CreateDealModal({ isOpen, onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const { addDeal, clients, products } = useDealStore();
    const [formData, setFormData] = useState<DealFormState>({
        clientName: "",
        productName: "",
        stage: "Lead Generated",
        createdAt: new Date().toISOString(),
        description: "",
        amount: 0
    })

    // handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "amount" ? (value === "" ? 0 : Number(value)) : value
        });
    };

    // handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (!formData.clientName || !formData.productName) {
            alert("All fields are required");
            setLoading(false);
            return;
        }
        setTimeout(() => {
            addDeal(formData).then(() => {
                setLoading(false);
                setFormData({
                    clientName: "",
                    productName: "",
                    stage: "Lead Generated",
                    description: "",
                    createdAt: new Date().toISOString().split('T')[0],
                    amount: 0
                });
                onClose();
            });
        }, 1000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl text-gray-900 dark:text-gray-100 animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">Create Deal</h2>
                <form role='form' onSubmit={handleSubmit} className="space-y-4">
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="clientName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Client</label>
                        <select
                            id="clientName"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            required
                        >
                            <option value="">Select Client</option>
                            {clients?.map(client => (
                                <option key={client.id} value={client.name}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="productName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Product</label>
                        <select
                            id="productName"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            required
                        >
                            <option value="">Select Product</option>
                            {products?.map(product => (
                                <option key={product.id} value={product.name}>{product.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor="stage" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Stage</label>
                        <select
                            id='stage'
                            name="stage"
                            value={formData.stage}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
                        <label htmlFor='amount' className="text-sm font-semibold text-gray-700 dark:text-gray-300">Deal Value ($)</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount === 0 ? "" : formData.amount}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="e.g. 15000"
                            min="0"
                        />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label htmlFor='description' className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
                        <textarea
                            id='description'
                            name="description"
                            value={formData.description || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
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
                            disabled={loading || !formData.clientName || !formData.productName}
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
                        >
                            {loading ? "Creating Deal..." : "Create Deal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateDealModal;