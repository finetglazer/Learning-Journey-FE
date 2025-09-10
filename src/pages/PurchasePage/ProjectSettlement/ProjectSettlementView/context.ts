import { ProjectSettlementProposal } from "models/ProjectSettlement";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export interface ProjectSettlementViewType {
  model: ProjectSettlementProposal;
  orderFormSelect: ProjectSettlementProposal;
  setOrderFormSelect: Dispatch<SetStateAction<ProjectSettlementProposal>>;
}

const INITIAL_CONTEXT: ProjectSettlementViewType = {
  model: null,
  orderFormSelect: null,
  setOrderFormSelect: null,
};

const ProjectSettlementViewContext =
  createContext<ProjectSettlementViewType>(INITIAL_CONTEXT);

const useProjectSettlementViewContext = () => {
  const context = useContext(ProjectSettlementViewContext);

  return context;
};

export { ProjectSettlementViewContext, useProjectSettlementViewContext };
