import type { DragEndEvent } from "@dnd-kit/core";
import type { Deal, Stage } from "@/types/deals";

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

export const handleDragEnd = async (
    event: DragEndEvent,
    deals: Deal[],
    updateDeal: (id: number, data: Partial<Deal>) => Promise<void>
) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeDeal = deals.find((deal) => String(deal.id) === activeId);
    if (!activeDeal) return;

    const overStage = stages.find((stage) => stage === overId);

    if (overStage && activeDeal.stage !== overStage) {
        await updateDeal(activeDeal.id, { stage: overStage as Stage });
        console.log(`Moved deal ${activeDeal.id} to ${overStage}`);
    }
};
