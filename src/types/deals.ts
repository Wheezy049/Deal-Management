export type Stage =
    | "Lead Generated"
    | "Contacted"
    | "Application Submitted"
    | "Application Under Review"
    | "Deal Finalized"
    | "Payment Confirmed"
    | "Completed"
    | "Lost";


export type Deal = {
    id: number;
    clientName: string;
    productName: string;
    stage: Stage;
    description?: string;
    createdAt: string;
}

export type MetadataVisible = {
    clientName: boolean;
    productName: boolean;
    createdAt: boolean;
    description: boolean;
};

export type DealState = {
    deals: Deal[];
    clients: ClientState[];
    products: ProductState[];
    fetchDeals: () => Promise<void>;
    fetchEntities: () => Promise<void>;
    loading: boolean;
    error: string | null;
    addDeal: (deal: Omit<Deal, "id">) => Promise<void>;
    updateDeal: (id: number, updated: Partial<Deal>) => Promise<void>;
    deleteDeal: (id: number) => Promise<void>;
    currentView: 'table' | 'kanban';
    setCurrentView: (view: 'table' | 'kanban') => void;
    kanbanMetadataVisible: MetadataVisible;
    setKanbanMetadataVisible: (key: keyof MetadataVisible, value: boolean) => void;
}

export type DealFormState = {
    clientName: string;
    productName: string;
    stage: Stage;
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
    description: boolean;
};

export type Entity = {
  id: number;
  type: "client" | "product";
  name: string;
};

