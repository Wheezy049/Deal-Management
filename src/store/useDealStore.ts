import { create } from "zustand";
import axios from "axios";

export type Deal = {
    id: number;
    clientName: string;
    productName: string;
    stage: string;
    createdAt: string;
}

type DealState = {
    deals: Deal[];
    fetchDeals: () => Promise<void>;
    loading: boolean;
    error: string | null;
    addDeal: (deal: Omit<Deal, "id">) => Promise<void>;
    updateDeal: (id: number, updated: Partial<Deal>) => Promise<void>;
    deleteDeal: (id: number) => Promise<void>;
}

// create the zustand store
export const useDealStore = create<DealState>((set) => ({
    deals: [],
    loading: false,
    error: null,
    // fetch deals function
    fetchDeals: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get("http://localhost:4000/deals");
            set({ deals: response.data, loading: false });
        } catch {
            set({ error: "Failed to fetch deals", loading: false });
        }
    },
    // add new deal function
    addDeal: async (deal) => {
        try {
            const response = await axios.post("http://localhost:4000/deals", deal);
            set((state) => ({ deals: [...state.deals, response.data] }));
        } catch {
            set({ error: "Failed to add deal" });
        }
    },
    // update deal function
    updateDeal: async (id, updated) => {
        try {
            const response = await axios.put(`http://localhost:4000/deals/${id}`, updated);
            set((state) => ({ deals: state.deals.map((deal) => deal.id === id ? response.data : deal) }));
        } catch {
            set({ error: "Failed to update deal" });
        }
    },
    // delete deal function
    deleteDeal: async (id) => {
        try {
            await axios.delete(`http://localhost:4000/deals/${id}`);
            set((state) => ({ deals: state.deals.filter((deal) => deal.id !== id) }));
        } catch {
            set({ error: "Failed to delete deal" })
        }
    },
}))