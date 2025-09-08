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
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl">
                <h2 className="text-xl font-semibold mb-4">Update Deal</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select Client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.name}>{client.name}</option>
                        ))}
                    </select>
                    <select
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select Product</option>
                        {products.map(product => (
                            <option key={product.id} value={product.name}>{product.name}</option>
                        ))}
                    </select>
                    <select
                        name="stage"
                        value={formData.stage}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
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
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Description (optional)"
                        rows={3}
                    />

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
                            Cancel
                        </button>
                        <button disabled={isUpdating} type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 transition-colors duration-200  text-white rounded disabled:opacity-50 disabled:cursor-not-allowed">
                            {isUpdating ? "Updating Deal..." : "Update Deal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateDealModal
