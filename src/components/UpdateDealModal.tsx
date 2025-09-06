import { useDealStore, Deal } from '@/store/useDealStore';
import React, { useState, useEffect } from 'react'

type Props = {
    isOpen: boolean;
    onClose: () => void;
    deal: Deal | null;
};

function UpdateDealModal({ isOpen, onClose, deal }: Props) {

    const { updateDeal } = useDealStore();
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState<Deal | null>(deal);

    useEffect(() => {
        setFormData(deal);
    }, [deal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!formData) return;
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        if (!formData) return;
        setTimeout(() => {
            updateDeal(formData.id, formData).then(() => {
                setIsUpdating(false);
                onClose();
            });
        }, 2000);
    };

    if (!isOpen || !formData) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Update Deal</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    <input
                        name="productName"
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
                        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
                            {isUpdating ? "Updating Deal..." : "Update Deal"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateDealModal