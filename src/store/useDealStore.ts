import { create } from "zustand";
import axios from "axios";
import { Deal, DealState, Entity, MetadataVisible } from "@/types/deals";

const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

type APIDeal = Omit<Deal, "amount"> & { amount?: string | number | null };

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
            const response = await axios.get<APIDeal[]>(`${API_URL}/deals`);
            const dealsWithAmount = response.data.map((deal: APIDeal) => ({
                ...deal,
                amount: deal.amount !== undefined && deal.amount !== null && !isNaN(Number(deal.amount))
                    ? Number(deal.amount)
                    : 5000 + (String(deal.id).split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) % 10) * 5000
            }));
            set({ deals: dealsWithAmount, loading: false });
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
            const newDeal = {
                ...response.data,
                amount: response.data.amount !== undefined && response.data.amount !== null
                    ? Number(response.data.amount)
                    : Number(deal.amount || 0)
            };
            set((state) => ({ deals: [...state.deals, newDeal] }));
        } catch {
            set({ error: "Failed to add deal" });
        }
    },
    // update deal function
    updateDeal: async (id, updated) => {
  try {
    const response = await axios.put(`${API_URL}/deals/${id}`, updated);
    set((state) => ({
      deals: state.deals.map((deal) =>
        deal.id === id ? { ...deal, ...response.data, amount: response.data.amount !== undefined && response.data.amount !== null ? Number(response.data.amount) : Number(updated.amount !== undefined ? updated.amount : deal.amount || 0) } : deal
      ),
    }));
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
    isMobileMenuOpen: false,
    setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
}));