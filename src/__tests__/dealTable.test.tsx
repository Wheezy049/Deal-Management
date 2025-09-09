import React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import { useDealStore } from "@/store/useDealStore";
import DealTable from "../components/DealTable";

// Mock Zustand store
jest.mock("@/store/useDealStore", () => ({
  useDealStore: jest.fn(),
}));

// Type the mock properly
const mockUseDealStore = useDealStore as jest.MockedFunction<typeof useDealStore>;

const mockFetchDeals = jest.fn();
const mockDeleteDeal = jest.fn();

const mockDeals = [
  { id: 1, clientName: "Alice", productName: "Laptop", stage: "Lead Generated", createdAt: "2023-09-01T00:00:00Z" },
  { id: 2, clientName: "Bob", productName: "Phone", stage: "Contacted", createdAt: "2023-09-02T00:00:00Z" },
];

describe("DealTable Integration", () => {
  let setIsUpdateOpen: jest.Mock;
  let setIsViewOpen: jest.Mock;
  let setSelectedDeal: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });

    setIsUpdateOpen = jest.fn();
    setIsViewOpen = jest.fn();
    setSelectedDeal = jest.fn();

    // mockDeleteDeal returning promise
    mockDeleteDeal.mockResolvedValue(undefined);

    mockUseDealStore.mockReturnValue({
      deals: mockDeals,
      loading: false,
      error: null,
      fetchDeals: mockFetchDeals,
      deleteDeal: mockDeleteDeal,
    });
  });

  it("calls fetchDeals on mount", () => {
    render(
      <DealTable
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );
    expect(mockFetchDeals).toHaveBeenCalled();
  });

  it("renders loading and error states", () => {
    mockUseDealStore.mockReturnValue({
      deals: [],
      loading: true,
      error: null,
      fetchDeals: mockFetchDeals,
      deleteDeal: mockDeleteDeal,
    });

    const { rerender } = render(
      <DealTable
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    expect(screen.getByText(/Loading deals/i)).toBeInTheDocument();

    mockUseDealStore.mockReturnValue({
      deals: [],
      loading: false,
      error: "Failed to load",
      fetchDeals: mockFetchDeals,
      deleteDeal: mockDeleteDeal,
    });

    rerender(
      <DealTable
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    expect(screen.getByText(/Failed to load/i)).toBeInTheDocument();
  });

  it("renders deals in the table", () => {
    render(
      <DealTable
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("toggles column visibility and persists to localStorage", () => {
  render(
    <DealTable
      setIsUpdateOpen={setIsUpdateOpen}
      setIsViewOpen={setIsViewOpen}
      setSelectedDeal={setSelectedDeal}
    />
  );

  // Open columns dropdown
  fireEvent.click(screen.getByRole("button", { name: /columns/i }));

  // Toggle 'clientName' checkbox
  const checkbox = screen.getByLabelText("Client Name");
  fireEvent.click(checkbox);

  expect(checkbox).not.toBeChecked();
  expect(window.localStorage.setItem).toHaveBeenCalledWith(
    "dealTableColumns",
    expect.stringContaining('"clientName":false')
  );
});

 it("handles delete with loading state", async () => {
  jest.useFakeTimers();

  mockUseDealStore.mockReturnValue({
    deals: [
      {
        id: 1,
        clientName: "Alice",
        productName: "Laptop",
        stage: "Lead Generated",
        createdAt: "2024-01-01T00:00:00Z",
      },
    ],
    loading: false,
    error: null,
    fetchDeals: jest.fn(),
    deleteDeal: mockDeleteDeal,
  });

  render(
    <DealTable
      setIsUpdateOpen={jest.fn()}
      setIsViewOpen={jest.fn()}
      setSelectedDeal={jest.fn()}
    />
  );

  // Open actions dropdown and click Delete
  fireEvent.click(screen.getByRole("button", { name: /more vertical/i }));
  fireEvent.click(screen.getByText("Delete"));

  const modal = screen.getByRole("dialog");
  expect(modal).toBeInTheDocument();

  const confirmBtn = within(modal).getByText("Delete");
  fireEvent.click(confirmBtn);

  act(() => {
    // Immediately after click, should show Deleting...
    expect(screen.getByText("Deleting...")).toBeInTheDocument();
    jest.advanceTimersByTime(1000); // simulate timeout
  });

  await act(async () => Promise.resolve());
  expect(mockDeleteDeal).toHaveBeenCalledWith(1);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

  jest.useRealTimers();
});

  it("calls view and edit props correctly", () => {
  render(
    <DealTable
      setIsUpdateOpen={setIsUpdateOpen}
      setIsViewOpen={setIsViewOpen}
      setSelectedDeal={setSelectedDeal}
    />
  );

  // Find Alice's row
  const aliceRow = screen.getByText("Alice").closest("tr");
  if (!aliceRow) throw new Error("Alice row not found");

  // Open dropdown for Alice
  const moreButton = within(aliceRow).getByRole("button", { name: /More vertical/i });
  
  // ---- Test Edit ----
  fireEvent.click(moreButton);
  const editButton = within(aliceRow).getByText("Edit");
  fireEvent.click(editButton);

  expect(setSelectedDeal).toHaveBeenCalledWith(mockDeals[0]);
  expect(setIsUpdateOpen).toHaveBeenCalledWith(true);

  // ---- Test View ----
  fireEvent.click(moreButton); // re-open dropdown
  const viewButton = within(aliceRow).getByText("View");
  fireEvent.click(viewButton);

  expect(setSelectedDeal).toHaveBeenCalledWith(mockDeals[0]);
  expect(setIsViewOpen).toHaveBeenCalledWith(true);
});



it("filters deals by search query", () => {
  render(
    <DealTable
      setIsUpdateOpen={setIsUpdateOpen}
      setIsViewOpen={setIsViewOpen}
      setSelectedDeal={setSelectedDeal}
    />
  );

  const searchInput = screen.getByPlaceholderText(/search deals/i);
  fireEvent.change(searchInput, { target: { value: "Alice" } });

  expect(screen.getByText("Alice")).toBeInTheDocument();
  expect(screen.queryByText("Bob")).not.toBeInTheDocument();
});
});