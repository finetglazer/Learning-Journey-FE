import { CONTRACT_ANNEX_ROUTER } from "pages/PurchasePage/ContractPage/ContractPage";
import { useMemo } from "react";
import { useRouteMatch } from "react-router";

export const useCheckStateContractAnnex = () => {
  const match = useRouteMatch([
    CONTRACT_ANNEX_ROUTER.CREATE,
    CONTRACT_ANNEX_ROUTER.EDIT,
    CONTRACT_ANNEX_ROUTER.DETAIL,
  ]);

  const state = useMemo(() => {
    switch (match?.path) {
      case CONTRACT_ANNEX_ROUTER.CREATE:
        return "CREATE";
      case CONTRACT_ANNEX_ROUTER.EDIT:
        return "EDIT";
      case CONTRACT_ANNEX_ROUTER.DETAIL:
        return "DETAIL";
      default:
        break;
    }
  }, []);

  const isEditable = useMemo(() => {
    return [CONTRACT_ANNEX_ROUTER.EDIT].includes(match?.path);
  }, [match?.path]);

  return {
    state,
    isEditable,
  };
};
