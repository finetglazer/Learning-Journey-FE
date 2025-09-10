import { PROJECT_SETTLEMENT_ROUTER } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementPage";
import { useMemo } from "react";
import { useRouteMatch } from "react-router";

export const useCheckState = () => {
  const match = useRouteMatch([
    PROJECT_SETTLEMENT_ROUTER.CREATE,
    PROJECT_SETTLEMENT_ROUTER.EDIT,
    PROJECT_SETTLEMENT_ROUTER.DETAIL,
  ]);

  const state = useMemo(() => {
    switch (match?.path) {
      case PROJECT_SETTLEMENT_ROUTER.CREATE:
        return "CREATE";
      case PROJECT_SETTLEMENT_ROUTER.EDIT:
        return "EDIT";
      case PROJECT_SETTLEMENT_ROUTER.DETAIL:
        return "DETAIL";
      default:
        break;
    }
  }, []);

  const isEditable = useMemo(() => {
    return [PROJECT_SETTLEMENT_ROUTER.EDIT].includes(match?.path);
  }, [match?.path]);

  return {
    state,
    isEditable,
  };
};
