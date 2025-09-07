import { create } from "zustand";
import axios from "axios";
import { DealState, MetadataVisible } from "@/types/deals";


// create the zustand store
export const useDealStore = create<DealState>((set) => ({
    deals: [],
    clients: [],
    products: [],
    loading: false,
    error: null,
    currentView: 'table',
    setCurrentView: (view: 'table' | 'kanban') => {
        set({ currentView: view });
        localStorage.setItem('dealCurrentView', view);
    },
    kanbanMetadataVisible: {
  clientName: true,
  productName: true,
  createdAt: true,
},
setKanbanMetadataVisible: (key: keyof MetadataVisible, value: boolean) =>
  set((state) => ({
    kanbanMetadataVisible: { ...state.kanbanMetadataVisible, [key]: value }
  })),

    // fetch deals function
    fetchDeals: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get("http://localhost:4000/deals");
            set({ deals: response.data, loading: false });
        } catch {
            set({ deals: [], error: "Failed to fetch deals", loading: false });
        }
    },
    // fetch clients function
    fetchClients: async () => {
        try {
            const res = await axios.get("http://localhost:4000/clients");
            set({ clients: res.data });
        } catch {
            set({ error: "Failed to fetch clients" });
        }
    },
    // fetch products function
    fetchProducts: async () => {
        try {
            const res = await axios.get("http://localhost:4000/products");
            set({ products: res.data });
        } catch {
            set({ error: "Failed to fetch products" });
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
            const response = await axios.patch(`http://localhost:4000/deals/${id}`, updated);
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