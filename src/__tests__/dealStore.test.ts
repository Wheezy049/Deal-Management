import { act } from 'react';
import { useDealStore } from '@/store/useDealStore';
import axios  from 'axios';
import { beforeEach, describe } from 'node:test';
import { expect, it } from '@jest/globals';
import { Stage } from '@/types/deals';

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.get.mockResolvedValue({ data: [] });

describe("Deal store", () => {
    beforeEach(() => {
        const { setState } = useDealStore;
        setState({
            deals: [],
            clients: [],
            products: [],
            loading: false,
            error: null,
            currentView: 'table',
            kanbanMetadataVisible: {
                clientName: true,
                productName: true,
                createdAt: true,
            },
        });
        jest.clearAllMocks();
    });

    it("set currentView and save to localStorage", () => {
        const { setCurrentView } = useDealStore.getState();
        act(() => {
            setCurrentView('kanban');
        });
        expect(useDealStore.getState().currentView).toBe('kanban');
        expect(localStorage.getItem('dealCurrentView')).toBe("kanban");
    });

    it("set kanbanMetadataVisible", () => {
        const { setKanbanMetadataVisible } = useDealStore.getState();
        act(() => {
            setKanbanMetadataVisible('clientName', false);
        });
        expect(useDealStore.getState().kanbanMetadataVisible.clientName).toBe(false);
    });

    it("fetch deals success", async() => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [{ id: 1, clientName: "Deal 1" }]
        });

        const { fetchDeals } = useDealStore.getState();
        await act(async () => {
            await fetchDeals();
        });

        expect(useDealStore.getState().deals).toHaveLength(1);
        expect(useDealStore.getState().loading).toBe(false);
    });


    it("fetch deals failure", async() => {
        mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

        const { fetchDeals } = useDealStore.getState();
        await act(async () => {
            await fetchDeals();
        });

        expect(useDealStore.getState().deals).toHaveLength(0);
        expect(useDealStore.getState().loading).toBe(false);
        expect(useDealStore.getState().error).toBe("Failed to fetch deals");
    });

    it('add a new deal', async() => {
        const newDealInput = { 
            clientName: "New Deal", 
            productName: "Product A", 
            createdAt: "2024-06-01T00:00:00Z", 
            stage: "Lead Generated" as Stage 
        };
        const newDeal = { id: 1, ...newDealInput };
        mockedAxios.post.mockResolvedValueOnce({
            data: newDeal 
        });

        const { addDeal } = useDealStore.getState();
        await act(async () => {
            await addDeal(newDealInput);
        });
        expect(useDealStore.getState().deals).toContainEqual(newDeal);
    });

    it("updates a deal", async () => {
    const existingDeal = { 
            id: 1,
            clientName: "New Deal", 
            productName: "Product A", 
            createdAt: "2024-06-01T00:00:00Z", 
            stage: "Lead Generated" as Stage 
        };
    useDealStore.setState({ deals: [existingDeal] });

    const updated = { id: 1, clientName: "New Deal Updated" };
    mockedAxios.patch.mockResolvedValueOnce({ data: updated });

    const { updateDeal } = useDealStore.getState();

    await act(async () => {
      await updateDeal(1, updated);
    });

    expect(useDealStore.getState().deals[0].clientName).toBe("New Deal Updated");
  });

  it("deletes a deal", async () => {
    const existingDeal = { 
            id: 1,
            clientName: "New Deal", 
            productName: "Product A", 
            createdAt: "2024-06-01T00:00:00Z", 
            stage: "Lead Generated" as Stage 
        };
    useDealStore.setState({ deals: [existingDeal] });

    mockedAxios.delete.mockResolvedValueOnce({});

    const { deleteDeal } = useDealStore.getState();

    await act(async () => {
      await deleteDeal(1);
    });

    expect(useDealStore.getState().deals).toHaveLength(0);
  });

});