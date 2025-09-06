"use client";

import { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


export type Deal = {
  id: string;
  title: string;
  stage: Stage;
};

export type Stage =
  | "Lead Generated"
  | "Contacted"
  | "Application Submitted"
  | "Application Under Review"
  | "Deal Finalized"
  | "Payment Confirmed"
  | "Completed"
  | "Lost";

  export const initialDeals: Deal[] = [
  { id: "1", title: "Deal A", stage: "Lead Generated" },
  { id: "2", title: "Deal B", stage: "Contacted" },
  { id: "3", title: "Deal C", stage: "Application Submitted" },
];

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

export default function KanbanBoard() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeDeal = deals.find((d) => d.id === active.id);
    if (!activeDeal) return;

    // If dropped over a stage column
    const targetStage = over.id as Stage;
    if (targetStage && activeDeal.stage !== targetStage) {
      setDeals((prev) =>
        prev.map((d) => (d.id === activeDeal.id ? { ...d, stage: targetStage } : d))
      );
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-4">
        {stages.map((stage) => (
          <StageColumn key={stage} stage={stage} deals={deals.filter((d) => d.stage === stage)} />
        ))}
      </div>
    </DndContext>
  );
}

function StageColumn({ stage, deals }: { stage: Stage; deals: Deal[] }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg min-w-[250px] flex-shrink-0">
      <h2 className="font-bold mb-4">{stage}</h2>
      <SortableContext items={deals.map((d) => d.id)} strategy={verticalListSortingStrategy}>
        {deals.map((deal) => (
          <SortableDeal key={deal.id} deal={deal} />
        ))}
      </SortableContext>
    </div>
  );
}

function SortableDeal({ deal }: { deal: Deal }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: deal.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded shadow mb-2 cursor-grab"
    >
      {deal.title}
    </div>
  );
}
