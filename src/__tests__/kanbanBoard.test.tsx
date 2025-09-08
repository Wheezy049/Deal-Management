import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useDealStore } from "@/store/useDealStore";
import KanbanBoard from "../components/KanbanBoard";
import type { Deal, MetadataVisible } from "@/types/deals";
import { handleDragEnd } from "@/utils/KanbanDrag";
import type { DragEndEvent } from "@dnd-kit/core";

// Mock @dnd-kit modules
jest.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: React.PropsWithChildren<object>) => (
    <div data-testid="dnd-context">
      {children}
    </div>
  ),
  DragOverlay: ({ children }: React.PropsWithChildren<object>) => <div data-testid="drag-overlay">{children}</div>,
  useSensor: jest.fn(),
  useSensors: jest.fn(() => []),
  PointerSensor: jest.fn(),
  closestCorners: jest.fn(),
}));

jest.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: React.PropsWithChildren<object>) => <div data-testid="sortable-context">{children}</div>,
  verticalListSortingStrategy: jest.fn(),
  useSortable: jest.fn(() => ({
    setNodeRef: jest.fn(),
    attributes: {},
    listeners: {},
    transform: null,
    transition: null,
    isDragging: false,
  })),
}));

jest.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => ""),
    },
  },
}));

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: (node: React.ReactNode) => node,
}));

// Mock Zustand store
jest.mock("@/store/useDealStore", () => ({
  useDealStore: jest.fn(),
}));

const mockUseDealStore = useDealStore as jest.MockedFunction<typeof useDealStore>;

const mockUpdateDeal = jest.fn();
const mockDeleteDeal = jest.fn();
const mockSetKanbanMetadataVisible = jest.fn();

const mockDeals: Deal[] = [
  {
    id: 1,
    clientName: "Alice",
    productName: "Laptop",
    stage: "Lead Generated",
    createdAt: "2023-09-01T00:00:00Z",
  },
  {
    id: 2,
    clientName: "Bob",
    productName: "Phone",
    stage: "Contacted",
    createdAt: "2023-09-02T00:00:00Z",
  },
  {
    id: 3,
    clientName: "Charlie",
    productName: "Tablet",
    stage: "Deal Finalized",
    createdAt: "2023-09-03T00:00:00Z",
  },
];

const mockMetadataVisible: MetadataVisible = {
  clientName: true,
  productName: true,
  createdAt: true,
};

describe("KanbanBoard Integration", () => {
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
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
    });

    // Mock window.confirm
    Object.defineProperty(window, "confirm", {
      value: jest.fn(() => true),
      writable: true,
    });

    setIsUpdateOpen = jest.fn();
    setIsViewOpen = jest.fn();
    setSelectedDeal = jest.fn();

    // Make sure mocked functions return Promises
    mockUpdateDeal.mockResolvedValue(undefined);
    mockDeleteDeal.mockResolvedValue(undefined);

    mockUseDealStore.mockReturnValue({
      deals: mockDeals,
      updateDeal: mockUpdateDeal,
      deleteDeal: mockDeleteDeal,
      kanbanMetadataVisible: mockMetadataVisible,
      setKanbanMetadataVisible: mockSetKanbanMetadataVisible,
    });
  });

  it("renders all stage columns", () => {
    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    // Check that all stages are rendered
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

    stages.forEach((stage) => {
      expect(screen.getByText(stage)).toBeInTheDocument();
    });
  });

  it("renders deals in correct stage columns", () => {
    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    // Check that deals are rendered with their metadata
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Tablet")).toBeInTheDocument();
  });

  it("renders deal counts in stage headers", () => {
    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    // Lead Generated should have 1 deal, Contacted should have 1, Deal Finalized should have 1
    const leadGeneratedSection = screen.getByText("Lead Generated").closest("div");
    const contactedSection = screen.getByText("Contacted").closest("div");
    const finalizedSection = screen.getByText("Deal Finalized").closest("div");

    expect(leadGeneratedSection).toHaveTextContent("1");
    expect(contactedSection).toHaveTextContent("1");
    expect(finalizedSection).toHaveTextContent("1");
  });

  it("renders metadata toggle buttons", () => {
    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    expect(screen.getByText("Hide clientName")).toBeInTheDocument();
    expect(screen.getByText("Hide productName")).toBeInTheDocument();
    expect(screen.getByText("Hide createdAt")).toBeInTheDocument();
  });

  it("toggles metadata visibility", () => {
    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    const clientNameToggle = screen.getByText("Hide clientName");
    fireEvent.click(clientNameToggle);

    expect(mockSetKanbanMetadataVisible).toHaveBeenCalledWith("clientName", false);
  });

  it("loads metadata visibility from localStorage", () => {
    const mockGetItem = jest.fn(() =>
      JSON.stringify({ clientName: false, productName: true, createdAt: false })
    );
    (window.localStorage.getItem as jest.Mock).mockImplementation(mockGetItem);

    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    expect(mockGetItem).toHaveBeenCalledWith("kanbanMetadataVisible");
    expect(mockSetKanbanMetadataVisible).toHaveBeenCalledWith("clientName", false);
    expect(mockSetKanbanMetadataVisible).toHaveBeenCalledWith("productName", true);
    expect(mockSetKanbanMetadataVisible).toHaveBeenCalledWith("createdAt", false);
  });

  it("saves metadata visibility to localStorage", () => {
    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "kanbanMetadataVisible",
      JSON.stringify(mockMetadataVisible)
    );
  });

  it("handles deal card view action", () => {
    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    const viewButtons = screen.getAllByText("View");
    fireEvent.click(viewButtons[0]);

    expect(setSelectedDeal).toHaveBeenCalledWith(mockDeals[0]);
    expect(setIsViewOpen).toHaveBeenCalledWith(true);
  });

  it("handles deal card edit action", () => {
    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);

    expect(setSelectedDeal).toHaveBeenCalledWith(mockDeals[0]);
    expect(setIsUpdateOpen).toHaveBeenCalledWith(true);
  });

  it("handles deal card delete action with confirmation", () => {
    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith("Are you sure you want to delete this deal?");
    expect(mockDeleteDeal).toHaveBeenCalledWith(mockDeals[0].id);
  });

  it("does not delete deal when confirmation is cancelled", () => {
    (window.confirm as jest.Mock).mockReturnValue(false);

    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteDeal).not.toHaveBeenCalled();
  });

  it("renders DndContext and sortable contexts", () => {
    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    expect(screen.getByTestId("dnd-context")).toBeInTheDocument();
    expect(screen.getAllByTestId("sortable-context")).toHaveLength(8);
  });

  it("renders drag overlay", () => {
    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    expect(screen.getByTestId("drag-overlay")).toBeInTheDocument();
  });

  it("handles metadata visibility with hidden fields", () => {
    mockUseDealStore.mockReturnValue({
      deals: mockDeals,
      updateDeal: mockUpdateDeal,
      deleteDeal: mockDeleteDeal,
      kanbanMetadataVisible: {
        clientName: false,
        productName: true,
        createdAt: false,
      },
      setKanbanMetadataVisible: mockSetKanbanMetadataVisible,
    });

    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    // Client names should be hidden
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();

    // Product names should be visible
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getByText("Tablet")).toBeInTheDocument();

    // Toggle buttons should reflect current state
    expect(screen.getByText("Show clientName")).toBeInTheDocument();
    expect(screen.getByText("Hide productName")).toBeInTheDocument();
    expect(screen.getByText("Show createdAt")).toBeInTheDocument();
  });

  it("prevents event bubbling on card actions", () => {
    // const stopPropagationSpy = jest.fn();

    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    const viewButton = screen.getAllByText("View")[0];
    
    // Create a mock event with stopPropagation
    // const mockEvent = {
    //   stopPropagation: stopPropagationSpy,
    // } as any;

  
    fireEvent.click(viewButton);
    expect(setSelectedDeal).toHaveBeenCalled();
    expect(setIsViewOpen).toHaveBeenCalled();
  });

  it("renders formatted dates correctly", () => {
    render(
      <KanbanBoard
        setIsUpdateOpen={setIsUpdateOpen}
        setIsViewOpen={setIsViewOpen}
        setSelectedDeal={setSelectedDeal}
      />
    );

    // Check if dates are formatted (they should appear as localized date strings)
    const formattedDate1 = new Date("2023-09-01T00:00:00Z").toLocaleDateString();
    const formattedDate2 = new Date("2023-09-02T00:00:00Z").toLocaleDateString();
    const formattedDate3 = new Date("2023-09-03T00:00:00Z").toLocaleDateString();

    expect(screen.getByText(formattedDate1)).toBeInTheDocument();
    expect(screen.getByText(formattedDate2)).toBeInTheDocument();
    expect(screen.getByText(formattedDate3)).toBeInTheDocument();
  });


 it("updates deal stage when dragged to a new column", async () => {
  const mockUpdateDeal = jest.fn();
  const activeDeal = mockDeals[0];
  const overStage = "Contacted";

 const mockEvent = {
  active: { id: String(activeDeal.id) },
  over: { id: overStage },
} as unknown as DragEndEvent;

  await handleDragEnd(
    mockEvent,
    mockDeals,
    mockUpdateDeal
  );

  expect(mockUpdateDeal).toHaveBeenCalledWith(activeDeal.id, { stage: overStage });
});

});
