import { useMemo } from "react";
import { useRouteMatch } from "react-router";
import { CONTRACT_PRINCIPLE_APPENDIX_ROUTER } from "../../ContractPrinciplePage";

export enum PageState {
  CREATE = "CREATE",
  EDIT = "EDIT",
  DETAIL = "DETAIL",
}

export const useCheckPageState = () => {
  const match = useRouteMatch([
    CONTRACT_PRINCIPLE_APPENDIX_ROUTER.CREATE,
    CONTRACT_PRINCIPLE_APPENDIX_ROUTER.EDIT,
    CONTRACT_PRINCIPLE_APPENDIX_ROUTER.DETAIL,
  ]);

  const state = useMemo(() => {
    switch (match?.path) {
      case CONTRACT_PRINCIPLE_APPENDIX_ROUTER.CREATE:
        return PageState.CREATE;
      case CONTRACT_PRINCIPLE_APPENDIX_ROUTER.EDIT:
        return PageState.EDIT;
      case CONTRACT_PRINCIPLE_APPENDIX_ROUTER.DETAIL:
        return PageState.DETAIL;
      default:
        break;
    }
  }, [match?.path]);

  const isEditable = useMemo(() => {
    return [CONTRACT_PRINCIPLE_APPENDIX_ROUTER.EDIT].includes(match?.path);
  }, [match?.path]);

  return {
    state,
    isEditable,
  };
};
