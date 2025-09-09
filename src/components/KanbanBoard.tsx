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
  useDroppable,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import type { Stage, Deal, MetadataVisible } from "@/types/deals";
import { createPortal } from "react-dom";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { handleDragEnd } from "@/utils/KanbanDrag";
import { Search, MoreVertical, Columns } from "lucide-react";

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
    loading,
    error,
    kanbanMetadataVisible,
    setKanbanMetadataVisible,
  } = useDealStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<{ [id: number]: boolean }>({});

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

  // Filter deals based on search query
  const filteredDeals = deals.filter(deal =>
    deal.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.stage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // handle drag start function
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = String(active.id);

    const deal = filteredDeals.find((deal) => String(deal.id) === id);
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

  const toggleMetadata = (key: keyof MetadataVisible) => {
    setKanbanMetadataVisible(key, !kanbanMetadataVisible[key]);
  };

  const getDealsByStage = (stage: Stage) => {
    return filteredDeals.filter((deal) => deal.stage === stage);
  };

  // Handle delete
  const handleDelete = (id: number) => {
    setIsDeleting(prev => ({ ...prev, [id]: true }));
    setShowActionsDropdown(null);
    setTimeout(() => {
      deleteDeal(id)
        .finally(() => {
          setIsDeleting(prev => ({ ...prev, [id]: false }));
          setConfirmDeleteId(null);
        });
    }, 1000);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-gray-600 dark:text-gray-400">Loading deals...</p>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-red-500">{error}</p>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Kanban View</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Columns Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Columns className="w-4 h-4" />
                <span className="sm:inline">Columns</span>
              </button>

              {showSettingsDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="p-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">Toggle Card Metadata</div>
                    <div className="space-y-2">
                      {Object.keys(kanbanMetadataVisible).map((key) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={kanbanMetadataVisible[key as keyof MetadataVisible]}
                            onChange={() => toggleMetadata(key as keyof MetadataVisible)}
                            className="text-blue-600 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Content */}
      <div className="p-4">
        {filteredDeals.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No deals found matching your search' : 'No deals found'}
            </p>
          </div>
        ) : (
          <DndContext
          data-testid="dnd-context"
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={(event) => handleDragEnd(event, filteredDeals, updateDeal, setActiveId, setActiveDeal)}
          >
            <div className="flex gap-4 overflow-x-auto pb-4">
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
                  showActionsDropdown={showActionsDropdown}
                  setShowActionsDropdown={setShowActionsDropdown}
                  setConfirmDeleteId={setConfirmDeleteId}
                  isDeleting={isDeleting}
                />
              ))}
            </div>

            {createPortal(
              <DragOverlay data-testid="drag-overlay">
                {activeId && activeDeal ? (
                  <DealCard
                    deal={activeDeal}
                    metadataVisible={kanbanMetadataVisible}
                    setIsViewOpen={setIsViewOpen}
                    setIsUpdateOpen={setIsUpdateOpen}
                    setSelectedDeal={setSelectedDeal}
                    deleteDeal={deleteDeal}
                    showActionsDropdown={showActionsDropdown}
                    setShowActionsDropdown={setShowActionsDropdown}
                    setConfirmDeleteId={setConfirmDeleteId}
                    isDeleting={isDeleting}
                    isDragOverlay
                  />
                ) : null}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId !== null && (
        <div role='dialog' aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this deal? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDeleteId !== null) handleDelete(confirmDeleteId);
                }}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                {isDeleting[confirmDeleteId] ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettingsDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowSettingsDropdown(false)}
        />
      )}
      {showActionsDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActionsDropdown(null)}
        />
      )}
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
  showActionsDropdown,
  setShowActionsDropdown,
  setConfirmDeleteId,
  isDeleting,
}: {
  stage: Stage;
  deals: Deal[];
  metadataVisible: MetadataVisible;
  setIsViewOpen: (b: boolean) => void;
  setIsUpdateOpen: (b: boolean) => void;
  setSelectedDeal: (deal: Deal | null) => void;
  deleteDeal: (id: number) => void;
  showActionsDropdown: number | null;
  setShowActionsDropdown: (id: number | null) => void;
  setConfirmDeleteId: (id: number | null) => void;
  isDeleting: { [id: number]: boolean };
}) {
  const { setNodeRef } = useDroppable({
    id: stage,
    data: {
      type: "Column",
      stage,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg min-w-[280px] flex-shrink-0 border border-gray-200 dark:border-gray-600"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-900 dark:text-white text-sm">{stage}</h2>
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
            {deals.length}
          </span>
        </div>
      </div>

      <SortableContext data-testid="sortable-context" items={deals.map((d) => String(d.id))} strategy={verticalListSortingStrategy}>
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
              showActionsDropdown={showActionsDropdown}
              setShowActionsDropdown={setShowActionsDropdown}
              setConfirmDeleteId={setConfirmDeleteId}
              isDeleting={isDeleting}
            />
          ))}
          {deals.length === 0 && (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              Drop deals here
            </div>
          )}
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
  showActionsDropdown,
  setShowActionsDropdown,
  setConfirmDeleteId,
  isDeleting,
  isDragOverlay = false,
}: {
  deal: Deal;
  metadataVisible: MetadataVisible;
  setIsViewOpen: (b: boolean) => void;
  setIsUpdateOpen: (b: boolean) => void;
  setSelectedDeal: (deal: Deal | null) => void;
  deleteDeal: (id: number) => void;
  showActionsDropdown: number | null;
  setShowActionsDropdown: (id: number | null) => void;
  setConfirmDeleteId: (id: number | null) => void;
  isDeleting: { [id: number]: boolean };
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

  // const handleDeleteClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (window.confirm('Are you sure you want to delete this deal?')) {
  //     deleteDeal(deal.id);
  //   }
  // };

  if (isDragOverlay) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2 border-blue-300 dark:border-blue-500 rotate-3 opacity-90 min-w-[250px] cursor-grabbing">
        <DealContent
          deal={deal}
          metadataVisible={metadataVisible}
          setIsViewOpen={setIsViewOpen}
          setIsUpdateOpen={setIsUpdateOpen}
          setSelectedDeal={setSelectedDeal}
          showActionsDropdown={showActionsDropdown}
          setShowActionsDropdown={setShowActionsDropdown}
          setConfirmDeleteId={setConfirmDeleteId}
          isDeleting={isDeleting}
          onView={handleViewClick}
          onEdit={handleEditClick}
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
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 ${isDragging ? 'opacity-50 scale-105' : 'opacity-100'
        }`}
    >

      <DealContent
        deal={deal}
        metadataVisible={metadataVisible}
        setIsViewOpen={setIsViewOpen}
        setIsUpdateOpen={setIsUpdateOpen}
        setSelectedDeal={setSelectedDeal}
        showActionsDropdown={showActionsDropdown}
        setShowActionsDropdown={setShowActionsDropdown}
        setConfirmDeleteId={setConfirmDeleteId}
        isDeleting={isDeleting}
        onView={handleViewClick}
        onEdit={handleEditClick}
      />
    </div>
  );
}

function DealContent({
  deal,
  metadataVisible,
  showActionsDropdown,
  setShowActionsDropdown,
  setConfirmDeleteId,
  isDragOverlay = false,
  onView,
  onEdit,
}: {
  deal: Deal;
  metadataVisible: MetadataVisible;
  setIsViewOpen: (b: boolean) => void;
  setIsUpdateOpen: (b: boolean) => void;
  setSelectedDeal: (deal: Deal | null) => void;
  showActionsDropdown: number | null;
  setShowActionsDropdown: (id: number | null) => void;
  setConfirmDeleteId: (id: number | null) => void;
  isDeleting: { [id: number]: boolean };
  isDragOverlay?: boolean;
  onView: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
}) {
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          {metadataVisible.clientName && (
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{deal.clientName}</p>
          )}
          {metadataVisible.productName && (
            <p className="text-gray-700 dark:text-gray-300 text-sm">{deal.productName}</p>
          )}
        </div>

        {!isDragOverlay && (
          <div className="relative">
            <button
              onClick={(e) => {
                handleButtonClick(e);
                setShowActionsDropdown(showActionsDropdown === deal.id ? null : deal.id);
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showActionsDropdown === deal.id && (
              <div className="absolute right-0 top-full mt-2 w-28 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                <button
                  aria-label="View"
                  onClick={onView}
                  className="block w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                >
                  View
                </button>
                <button
                aria-label="Edit"
                  onClick={onEdit}
                  className="block w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Edit
                </button>
                <button
                aria-label="Delete"
                  onClick={(e) => {
                    handleButtonClick(e);
                    setConfirmDeleteId(deal.id);
                    setShowActionsDropdown(null);
                  }}
                  className="block w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description & Created At */}
      <div className="flex flex-col gap-1">
        {metadataVisible.description && deal.description && (
          <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">{deal.description}</p>
        )}
        {metadataVisible.createdAt && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(deal.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}