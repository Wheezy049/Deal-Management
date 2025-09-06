"use client"
import { useDealStore } from '@/store/useDealStore';
import axios from 'axios';
import React, { useState } from 'react'

type DealFormState = {
    clientName: string;
    productName: string;
    stage: string;
    createdAt: string;
}

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

type ProductState = {
    id: number;
    name: string;
}

function CreateDealModal({ isOpen, onClose }: Props) {
    const [loading, setloading] = useState(false);
    const { addDeal } = useDealStore();
    const [formData, setFormData] = useState<DealFormState>({
        clientName: "",
        productName: "",
        stage: "Lead Generated",
        createdAt: new Date().toISOString()
    })
    const [product, setProduct] = useState<ProductState | null>(null)


    const handleProduct = async () => {
       const response = await axios.get("http://localhost:4000/products");
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setloading(true);
        if (!formData.clientName || !formData.productName) {
            alert("All fields are required");
            setloading(false);
            return;
        }
        setTimeout(() => {
            addDeal(formData).then(() => {
                setloading(false);
                setFormData({
                    clientName: "",
                    productName: "",
                    stage: "Lead Generated",
                    createdAt: new Date().toISOString().split('T')[0],
                });
                onClose();
            });
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Create Deal</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="clientName"
                        placeholder="Client Name"
                        value={formData.clientName}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        name="productName"
                        placeholder="Product Name"
                        value={formData.productName}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
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

                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
                            Cancel
                        </button>
                        <button disabled={loading || !formData.clientName || !formData.productName} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed">
                            {
                                loading ? "Creating Deal..." : "Create Deal"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateDealModal