import { useDealStore } from "@/store/useDealStore";
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import type { Stage, Deal, MetadataVisible } from "@/types/deals";
import { createPortal } from "react-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { handleDragEnd } from "@/utils/KanbanDrag";


const stages: Stage[] = [
  "Lead Generated",
  "Contacted",
  "Application Submitted",
  "Application Under Review",
  "Deal Finalized",
  "Payment Confirmed",
  "Completed",
  "Lost",
];

export default function KanbanBoard({
  setIsViewOpen,
  setIsUpdateOpen,
  setSelectedDeal,
}: {
  setIsViewOpen: (b: boolean) => void;
  setIsUpdateOpen: (b: boolean) => void;
  setSelectedDeal: (deal: Deal | null) => void;
}) {
  const {
    deals,
    updateDeal,
    deleteDeal,
    kanbanMetadataVisible,
    setKanbanMetadataVisible,
  } = useDealStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  // Load metadata visibility from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kanbanMetadataVisible");
    if (saved) {
      const parsed: MetadataVisible = JSON.parse(saved);
      Object.keys(parsed).forEach((key) =>
        setKanbanMetadataVisible(key as keyof MetadataVisible, parsed[key as keyof MetadataVisible])
      );
    }
  }, [setKanbanMetadataVisible]);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("kanbanMetadataVisible", JSON.stringify(kanbanMetadataVisible));
  }, [kanbanMetadataVisible]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  // handle start drag function
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = String(active.id);

    const deal = deals.find((deal) => String(deal.id) === id);
    if (deal) {
      setActiveId(id);
      setActiveDeal(deal);
    }
  };

  // handle drag over function
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Find the active deal
    const activeDeal = deals.find((deal) => String(deal.id) === activeId);
    if (!activeDeal) return;

    // Check if we're dragging over a stage column (not another deal)
    const overStage = stages.find(stage => stage === overId);

    if (overStage && activeDeal.stage !== overStage) {
      // Update the deal's stage immediately for visual feedback
      const updatedDeals = deals.map(deal =>
        String(deal.id) === activeId
          ? { ...deal, stage: overStage }
          : deal
      );
    }
  };

  //  const handleDragEnd = async (event: DragEndEvent) => {
  //     const { active, over } = event;

  //     setActiveId(null);
  //     setActiveDeal(null);

  //     if (!over) return;

  //     const activeId = String(active.id);
  //     const overId = String(over.id);

  //     const activeDeal = deals.find((deal) => String(deal.id) === activeId);
  //     if (!activeDeal) return;

  //     // Check if we're dropping on a stage column
  //     const overStage = stages.find(stage => stage === overId);

  //     if (overStage && activeDeal.stage !== overStage) {
  //       try {
  //         await updateDeal(activeDeal.id, { stage: overStage });
  //         console.log(`Moved deal ${activeDeal.id} to ${overStage}`);
  //       } catch (error) {
  //         console.error("Failed to update deal stage:", error);
  //       }
  //     }
  //   };

  const toggleMetadata = (key: keyof MetadataVisible) => {
    setKanbanMetadataVisible(key, !kanbanMetadataVisible[key]);
  };

  const getDealsByStage = (stage: Stage) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  return (
    <div>
      {/* Metadata toggles */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {Object.keys(kanbanMetadataVisible).map((key) => (
          <button
            key={key}
            onClick={() => toggleMetadata(key as keyof MetadataVisible)}
            className={`px-3 py-1 rounded border transition-colors duration-200 ${kanbanMetadataVisible[key as keyof MetadataVisible]
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 hover:bg-gray-300"
              }`}
          >
            {kanbanMetadataVisible[key as keyof MetadataVisible] ? `Hide ${key}` : `Show ${key}`}
          </button>
        ))}
      </div>

      {/* Kanban board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={(event) =>
          handleDragEnd(event, deals, updateDeal).then(() => {
            setActiveId(null);
            setActiveDeal(null);
          })
        }
      >
        <div className="flex gap-4 overflow-x-auto p-2">
          {stages.map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              deals={getDealsByStage(stage)}
              metadataVisible={kanbanMetadataVisible}
              setIsViewOpen={setIsViewOpen}
              setIsUpdateOpen={setIsUpdateOpen}
              setSelectedDeal={setSelectedDeal}
              deleteDeal={deleteDeal}
            />
          ))}
        </div>

        {createPortal(
          <DragOverlay>
            {activeId && activeDeal ? (
              <DealCard
                deal={activeDeal}
                metadataVisible={kanbanMetadataVisible}
                setIsViewOpen={setIsViewOpen}
                setIsUpdateOpen={setIsUpdateOpen}
                setSelectedDeal={setSelectedDeal}
                deleteDeal={deleteDeal}
                isDragOverlay
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

function StageColumn({
  stage,
  deals,
  metadataVisible,
  setIsViewOpen,
  setIsUpdateOpen,
  setSelectedDeal,
  deleteDeal,
}: {
  stage: Stage;
  deals: Deal[];
  metadataVisible: MetadataVisible;
  setIsViewOpen: (b: boolean) => void;
  setIsUpdateOpen: (b: boolean) => void;
  setSelectedDeal: (deal: Deal | null) => void;
  deleteDeal: (id: number) => void;
}) {
  const {
    setNodeRef,
  } = useSortable({
    id: stage,
    data: {
      type: "Column",
      stage,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 p-4 rounded-lg min-w-[250px] flex-shrink-0"
    >
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-bold text-gray-800">{stage}</h2>
        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm">
          {deals.length}
        </span>
      </div>

      <SortableContext items={deals.map((d) => String(d.id))} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[200px]">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              metadataVisible={metadataVisible}
              setIsViewOpen={setIsViewOpen}
              setIsUpdateOpen={setIsUpdateOpen}
              setSelectedDeal={setSelectedDeal}
              deleteDeal={deleteDeal}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function DealCard({
  deal,
  metadataVisible,
  setIsViewOpen,
  setIsUpdateOpen,
  setSelectedDeal,
  deleteDeal,
  isDragOverlay = false,
}: {
  deal: Deal;
  metadataVisible: MetadataVisible;
  setIsViewOpen: (b: boolean) => void;
  setIsUpdateOpen: (b: boolean) => void;
  setSelectedDeal: (deal: Deal | null) => void;
  deleteDeal: (id: number) => void;
  isDragOverlay?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(deal.id),
    data: {
      type: "Deal",
      deal,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDeal(deal);
    setIsViewOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDeal(deal);
    setIsUpdateOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this deal?')) {
      deleteDeal(deal.id);
    }
  };

  if (isDragOverlay) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-blue-300 rotate-3 opacity-90">
        <DealContent
          deal={deal}
          metadataVisible={metadataVisible}
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${isDragging ? 'opacity-30' : 'opacity-100'
        }`}
    >
      <DealContent
        deal={deal}
        metadataVisible={metadataVisible}
        onView={handleViewClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    </div>
  );
}

function DealContent({
  deal,
  metadataVisible,
  onView,
  onEdit,
  onDelete
}: {
  deal: Deal;
  metadataVisible: MetadataVisible;
  onView: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  return (
    <>
      <div className="mb-3">
        {metadataVisible.clientName && (
          <p className="font-semibold text-gray-900 mb-1">{deal.clientName}</p>
        )}
        {metadataVisible.productName && (
          <p className="text-gray-700 mb-1">{deal.productName}</p>
        )}

        {metadataVisible.createdAt && (
          <p className="text-xs text-gray-500">
            {new Date(deal.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={onView}
          className="text-green-600 hover:text-green-700 text-xs font-medium"
        >
          View
        </button>
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-700 text-xs font-medium"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 text-xs font-medium"
        >
          Delete
        </button>
      </div>
    </>
  );
}