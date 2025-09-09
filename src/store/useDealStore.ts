import { create } from "zustand";
import axios from "axios";
import { DealState, Entity, MetadataVisible } from "@/types/deals";

const API_URL = "https://68bec5be9c70953d96ed8e58.mockapi.io"

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
        description: false,
    },
    setKanbanMetadataVisible: (key: keyof MetadataVisible, value: boolean) =>
        set((state) => ({
            kanbanMetadataVisible: { ...state.kanbanMetadataVisible, [key]: value }
        })),

    // fetch deals function
    fetchDeals: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/deals`);
            set({ deals: response.data, loading: false });
        } catch {
            set({ deals: [], error: "Failed to fetch deals", loading: false });
        }
    },

    // fetch clients and product select function
    fetchEntities: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get<Entity[]>(`${API_URL}/products`);
            const clients = res.data.filter((item) => item.type === "client");
            const products = res.data.filter((item) => item.type === "product");
            set({ clients, products, loading: false });
        } catch {
            set({ error: "Failed to fetch entities", loading: false });
        }
    },

    // add new deal function
    addDeal: async (deal) => {
        try {
            const response = await axios.post(`${API_URL}/deals`, deal);
            set((state) => ({ deals: [...state.deals, response.data] }));
        } catch {
            set({ error: "Failed to add deal" });
        }
    },
    // update deal function
    updateDeal: async (id, updated) => {
        try {
            const response = await axios.patch(`${API_URL}/deals/${id}`, updated);
            set((state) => ({ deals: state.deals.map((deal) => deal.id === id ? response.data : deal) }));
        } catch {
            set({ error: "Failed to update deal" });
        }
    },
    // delete deal function
    deleteDeal: async (id) => {
        try {
            await axios.delete(`${API_URL}/deals/${id}`);
            set((state) => ({ deals: state.deals.filter((deal) => deal.id !== id) }));
        } catch {
            set({ error: "Failed to delete deal" })
        }
    },
}))