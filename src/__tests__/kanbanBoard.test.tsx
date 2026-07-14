import React from "react";
import { render, screen, fireEvent, within, act, waitFor } from "@testing-library/react";
import { useDealStore } from "@/store/useDealStore";
import KanbanBoard from "../components/KanbanBoard";
import type { Deal, MetadataVisible } from "@/types/deals";
import { handleDragEnd } from "@/utils/KanbanDrag";
import type { DragEndEvent } from "@dnd-kit/core";

jest.mock("@dnd-kit/sortable", () => ({
  useSortable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
  SortableContext: ({ children, ...props }: React.PropsWithChildren<object>) => <div {...props}>{children}</div>,
  verticalListSortingStrategy: jest.fn(),
}));

jest.mock("@dnd-kit/core", () => ({
  DndContext: ({ children, ...props }: React.PropsWithChildren<object>) => <div {...props}>{children}</div>,
  DragOverlay: ({ children, ...props }: React.PropsWithChildren<object>) => <div {...props}>{children}</div>,
  useDroppable: jest.fn(() => ({ setNodeRef: jest.fn() })),
  useDraggable: jest.fn(() => ({ attributes: {}, listeners: {}, setNodeRef: jest.fn(), transform: null, isDragging: false })),
  PointerSensor: jest.fn(),
  useSensor: jest.fn((sensor, options) => ({ sensor, options })),
  useSensors: jest.fn((...sensors) => sensors),
  closestCorners: jest.fn(),
}));

jest.mock("@dnd-kit/utilities", () => ({
  CSS: { Transform: { toString: jest.fn(() => "") } },
}));

jest.mock("react-dom", () => ({ ...jest.requireActual("react-dom"), createPortal: (node: React.ReactNode) => node }));

jest.mock('@/store/useDealStore', () => {
  return {
    useDealStore: jest.fn(() => ({
      deals: [],
      updateDeal: jest.fn(),
      deleteDeal: jest.fn(),
      kanbanMetadataVisible: {
        clientName: true,
        productName: true,
        createdAt: true,
        description: false,
      },
      setKanbanMetadataVisible: jest.fn(),
    })),
  };
});

const mockUseDealStore = useDealStore as jest.MockedFunction<typeof useDealStore>;
mockUseDealStore.setState = jest.fn();

// Mock data
const mockDeals: Deal[] = [
  { id: 1, clientName: "Alice", productName: "Laptop", stage: "Lead Generated", createdAt: "2023-09-01T00:00:00Z" },
  { id: 2, clientName: "Bob", productName: "Phone", stage: "Contacted", createdAt: "2023-09-02T00:00:00Z" },
  { id: 3, clientName: "Charlie", productName: "Tablet", stage: "Deal Finalized", createdAt: "2023-09-03T00:00:00Z" },
];

const mockMetadataVisible: MetadataVisible = { clientName: true, productName: true, createdAt: true, description: false };
const mockUpdateDeal = jest.fn();
const mockDeleteDeal = jest.fn(() => Promise.resolve());
const mockSetKanbanMetadataVisible = jest.fn();

describe("KanbanBoard Integration", () => {
  let setIsViewOpen: jest.Mock;
  let setIsUpdateOpen: jest.Mock;
  let setSelectedDeal: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, "localStorage", { value: { getItem: jest.fn(), setItem: jest.fn() }, writable: true });
    Object.defineProperty(window, "confirm", { value: jest.fn(() => true), writable: true });

    setIsViewOpen = jest.fn();
    setIsUpdateOpen = jest.fn();
    setSelectedDeal = jest.fn();

    mockUseDealStore.mockImplementation(() => ({
      deals: mockDeals,
      updateDeal: mockUpdateDeal,
      deleteDeal: mockDeleteDeal,
      kanbanMetadataVisible: mockMetadataVisible,
      setKanbanMetadataVisible: mockSetKanbanMetadataVisible,
    }));
  });

  it("renders all stage columns and their deals", () => {
    render(<KanbanBoard setIsUpdateOpen={setIsUpdateOpen} setIsViewOpen={setIsViewOpen} setSelectedDeal={setSelectedDeal} />);
    const stages = [
      "Lead Generated",
      "Contacted",
      "Application Submitted",
      "Application Under Review",
      "Deal Finalized",
      "Payment Confirmed",
      "Completed",
      "Lost",
    ];
    stages.forEach(stage => expect(screen.getByText(stage)).toBeInTheDocument());
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("Tablet")).toBeInTheDocument();
  });

  it("toggles metadata visibility via checkbox", () => {
    render(<KanbanBoard setIsUpdateOpen={setIsUpdateOpen} setIsViewOpen={setIsViewOpen} setSelectedDeal={setSelectedDeal} />);

    const columnButton = screen.getByRole('button', { name: /column/i});
    fireEvent.click(columnButton);

    const toggleCheckbox = screen.getAllByRole("checkbox");
    fireEvent.click(toggleCheckbox[0]);

    expect(mockSetKanbanMetadataVisible).toHaveBeenCalled();
  });

  it("opens view modal on 'View' click", () => {
    render(<KanbanBoard setIsUpdateOpen={setIsUpdateOpen} setIsViewOpen={setIsViewOpen} setSelectedDeal={setSelectedDeal} />);
    const moreButton = screen.getAllByRole('button', { name: /more vertical/i});
    fireEvent.click(moreButton[0]); 

    const viewButton = screen.getByRole("button", { name: /View/i});
    fireEvent.click(viewButton);

    expect(setSelectedDeal).toHaveBeenCalledWith(mockDeals[0]);
    expect(setIsViewOpen).toHaveBeenCalledWith(true);
  });

  it("opens edit modal on 'Edit' click", () => {
    render(<KanbanBoard setIsUpdateOpen={setIsUpdateOpen} setIsViewOpen={setIsViewOpen} setSelectedDeal={setSelectedDeal} />);
    const moreButtons = screen.getAllByRole("button", {name: /more vertical/i});
    fireEvent.click(moreButtons[0]);

    const editButton = screen.getByRole("button", { name: /Edit/i});
    fireEvent.click(editButton);

    expect(setSelectedDeal).toHaveBeenCalledWith(mockDeals[0]);
    expect(setIsUpdateOpen).toHaveBeenCalledWith(true);
  });

 it("handles delete action correctly", async () => {
  jest.useFakeTimers();

  render(
    <KanbanBoard
      setIsUpdateOpen={jest.fn()}
      setIsViewOpen={jest.fn()}
      setSelectedDeal={jest.fn()}
    />
  );

  const moreButtons = screen.getAllByRole("button", { name: /more vertical/i });
  fireEvent.click(moreButtons[0]);


  fireEvent.click(screen.getByText("Delete"));

  const modal = screen.getByRole("dialog");
  expect(modal).toBeInTheDocument();

  const confirmButton = within(modal).getByText("Delete");
  fireEvent.click(confirmButton);

  act(() => {
      expect(screen.getByText("Deleting...")).toBeInTheDocument();
      jest.advanceTimersByTime(1000)
  });

    await waitFor(() => {
    expect(mockDeleteDeal).toHaveBeenCalledWith(mockDeals[0].id);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  jest.useRealTimers();

});

  it("renders drag and sortable contexts and overlay", () => {
    render(<KanbanBoard setIsUpdateOpen={setIsUpdateOpen} setIsViewOpen={setIsViewOpen} setSelectedDeal={setSelectedDeal} />);
    expect(screen.getByTestId("dnd-context")).toBeInTheDocument();
    expect(screen.getAllByTestId("sortable-context")).toHaveLength(8);
    expect(screen.getByTestId("drag-overlay")).toBeInTheDocument();
  });

  it("updates deal stage when dragged", async () => {
    const activeDeal = mockDeals[0];
    const overStage = "Contacted";
    const mockEvent = { active: { id: String(activeDeal.id) }, over: { id: overStage } } as unknown as DragEndEvent;
    await handleDragEnd(mockEvent, mockDeals, mockUpdateDeal, jest.fn(), jest.fn());
    expect(mockUpdateDeal).toHaveBeenCalledWith(activeDeal.id, { stage: overStage });
  });

  it("renders formatted createdAt dates correctly", () => {
    render(<KanbanBoard setIsUpdateOpen={setIsUpdateOpen} setIsViewOpen={setIsViewOpen} setSelectedDeal={setSelectedDeal} />);
    mockDeals.forEach(deal => {
      expect(screen.getByText(new Date(deal.createdAt).toLocaleDateString())).toBeInTheDocument();
    });
  });
});
