import { useDealStore } from '@/store/useDealStore';
import React, { useEffect, useState } from 'react'
import type { DealFormState, Props } from '@/types/deals';

function CreateDealModal({ isOpen, onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const { addDeal, fetchEntities, clients, products } = useDealStore();
    const [formData, setFormData] = useState<DealFormState>({
        clientName: "",
        productName: "",
        stage: "Lead Generated",
        createdAt: new Date().toISOString(),
        description: ""
    })

    // fetch clients and products on mount
    useEffect(() => {
        const fetchData = async () => {
            await fetchEntities();
        };
        fetchData();
    }, []);

    // handle form field changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                });
                onClose();
            });
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl">
                <h2 className="text-xl font-semibold mb-4">Create Deal</h2>
                <form role='form' onSubmit={handleSubmit} className="space-y-4">
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="clientName">Client</label>
                        <select
                            id="clientName"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">Select Client</option>
                            {clients?.map(client => (
                                <option key={client.id} value={client.name}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="productName">Product</label>
                        <select
                            id="productName"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        >
                            <option value="">Select Product</option>
                            {products?.map(product => (
                                <option key={product.id} value={product.name}>{product.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="stage">Stage:</label>
                        <select
                            id='stage'
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
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='description'>Description:</label>
                        <textarea
                            id='description'
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            placeholder="Description (optional)"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
                            Cancel
                        </button>
                        <button
                            disabled={loading || !formData.clientName || !formData.productName}
                            type="submit"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 transition-colors duration-200 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating Deal..." : "Create Deal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateDealModal
