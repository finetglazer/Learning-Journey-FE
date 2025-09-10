import { CONTRACT_PRINCIPLE_APPENDIX_ROUTER } from "pages/PurchasePage/ContractPrinciplePage/ContractPrinciplePage";
import { useMemo } from "react";
import { useRouteMatch } from "react-router";

export const useCheckStateContractPrincipleAppendix = () => {
  const match = useRouteMatch([
    CONTRACT_PRINCIPLE_APPENDIX_ROUTER.CREATE,
    CONTRACT_PRINCIPLE_APPENDIX_ROUTER.EDIT,
    CONTRACT_PRINCIPLE_APPENDIX_ROUTER.DETAIL,
  ]);

  const state = useMemo(() => {
    switch (match?.path) {
      case CONTRACT_PRINCIPLE_APPENDIX_ROUTER.CREATE:
        return "CREATE";
      case CONTRACT_PRINCIPLE_APPENDIX_ROUTER.EDIT:
        return "EDIT";
      case CONTRACT_PRINCIPLE_APPENDIX_ROUTER.DETAIL:
        return "DETAIL";
      default:
        break;
    }
  }, []);

  const isEditable = useMemo(() => {
    return [CONTRACT_PRINCIPLE_APPENDIX_ROUTER.EDIT].includes(match?.path);
  }, [match?.path]);

  return {
    state,
    isEditable,
  };
};
