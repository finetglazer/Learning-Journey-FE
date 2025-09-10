import { ConfigField, GeneralAction } from "core/services/service-types";
import { ProjectSettlementProposal } from "models/ProjectSettlement";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { ProjectSettlementModal } from "../Components/constant";

export interface ProjectSettlementDetailType {
  model: ProjectSettlementProposal;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeListField?: (config: ConfigField) => (data?: unknown[]) => void;
  orderFormSelect: ProjectSettlementProposal;
  setOrderFormSelect: Dispatch<SetStateAction<ProjectSettlementProposal>>;
  onCreate: (isDraft: boolean, callbackFc: () => void) => void;
  loading?: boolean;
  dispatch?: Dispatch<GeneralAction<ProjectSettlementProposal>>;
  state?: unknown;
  onClickButton?: (type: ProjectSettlementModal) => void;
}

const INITIAL_CONTEXT: ProjectSettlementDetailType = {
  model: null,
  orderFormSelect: null,
  setOrderFormSelect: null,
  onCreate: null,
};

const ProjectSettlementDetailContext =
  createContext<ProjectSettlementDetailType>(INITIAL_CONTEXT);

const useProjectSettlementDetailContext = () => {
  const context = useContext(ProjectSettlementDetailContext);

  return context;
};

export { ProjectSettlementDetailContext, useProjectSettlementDetailContext };
