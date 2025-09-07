
export type Deal = {
    id: number;
    clientName: string;
    productName: string;
    stage: string;
    description?: string;
    createdAt: string;
}

export type DealState = {
    deals: Deal[];
    clients: ClientState[];
    products: ProductState[];
    fetchDeals: () => Promise<void>;
    fetchClients: () => Promise<void>;
    fetchProducts: () => Promise<void>;
    loading: boolean;
    error: string | null;
    addDeal: (deal: Omit<Deal, "id">) => Promise<void>;
    updateDeal: (id: number, updated: Partial<Deal>) => Promise<void>;
    deleteDeal: (id: number) => Promise<void>;
    currentView: 'table' | 'kanban';
    setCurrentView: (view: 'table' | 'kanban') => void;
}

export type DealFormState = {
    clientName: string;
    productName: string;
    stage: string;
    createdAt: string;
    description?: string;
}

export type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export type ProductState = {
    id: number;
    name: string;
}

export type ClientState = {
    id: number;
    name: string;
}

export type ColumnVisibility = {
    clientName: boolean;
    productName: boolean;
    stage: boolean;
    createdAt: boolean;
    actions: boolean;
};