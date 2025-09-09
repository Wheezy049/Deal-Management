import type { DragEndEvent } from "@dnd-kit/core";
import type { Deal, Stage } from "@/types/deals";
import { useDealStore } from "@/store/useDealStore";

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

export const handleDragEnd = async (
  event: DragEndEvent,
  deals: Deal[],
  updateDeal: (id: number, data: Partial<Deal>) => Promise<void>,
  setActiveId: (id: string | null) => void,
  setActiveDeal: (deal: Deal | null) => void
) => {
  const { active, over } = event;

  setActiveId(null);
  setActiveDeal(null);

  if (!over) return;

  const activeId = String(active.id);
  const overId = String(over.id);

  const activeDeal = deals.find((deal) => String(deal.id) === activeId);
  if (!activeDeal) return;

  let targetStage: Stage | undefined;

  if (stages.includes(overId as Stage)) {
      targetStage = overId as Stage;
    } else {
      // Check if dropping on another deal
      const targetDeal = deals.find((deal) => String(deal.id) === overId);
      if (targetDeal) {
        targetStage = targetDeal.stage;
      }
    }

  if (!targetStage || activeDeal.stage === targetStage) return;

   // Update immediately in store for instant visual feedback
    const updatedDeals = deals.map(deal =>
      String(deal.id) === activeId
        ? { ...deal, stage: targetStage }
        : deal
    );
    
    // Update store state immediately
    useDealStore.setState({ deals: updatedDeals });
  
    // Then update via API
    updateDeal(Number(activeDeal.id), { stage: targetStage });
};
