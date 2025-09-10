import { numberConstants } from "core/config/consts";
import { FilterAction } from "core/services/service-types";
import {
  ProjectSettlementFilter,
  ProjectSettlementModel,
  TagFilterList,
} from "models/ProjectSettlement";
import { createContext, Dispatch } from "react";
import { ProjectSettlementModal } from "../Components/constant";

export enum ActionRowType {
  VIEW,
  VIEW_POLICY,
  EDIT,
  CANCEL,
  DELETE,
  VIEW_FROM_MASTER,
}

export interface ProjectSettlementMasterType {
  list: ProjectSettlementModel[];
  count: number;
  countFilter: number;
  loadingList: boolean;
  modelFilter: ProjectSettlementFilter;
  dispatchFilter: Dispatch<FilterAction<ProjectSettlementFilter>>;
  handleLoadList: (filterParam?: ProjectSettlementFilter) => void;
  calculatedFilterCount: number;
  handleResetList: () => void;
  projectSettlementTabsFilterRepository?: TagFilterList[];
  handleModal: (modal: null | ProjectSettlementModal) => void;
  handleOnClickRow: (
    record: ProjectSettlementModel,
    type?: ActionRowType,
    waitingForApproval?: boolean
  ) => void;
  getLinkClickRow?: (
    record: ProjectSettlementModel,
    type?: ActionRowType,
    waitingForApproval?: boolean
  ) => string;
}

const INITIAL_CONTEXT: ProjectSettlementMasterType = {
  list: [],
  count: null,
  modelFilter: new ProjectSettlementFilter(),
  dispatchFilter: null,
  loadingList: false,
  handleLoadList: () => null,
  calculatedFilterCount: numberConstants.ZERO,
  handleResetList: () => null,
  countFilter: numberConstants.ZERO,
  handleModal: null,
  handleOnClickRow: () => null,
};

export const ProjectSettlementMasterContext =
  createContext<ProjectSettlementMasterType>(INITIAL_CONTEXT);
