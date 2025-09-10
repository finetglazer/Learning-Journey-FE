import { numberConstants } from "core/config/consts";
import { RepoState } from "core/services/page-services/master-service";
import { FilterAction } from "core/services/service-types";
import {
  ReceivingGoodFilter,
  ReceivingGoodModel,
  TagFilterList,
} from "models/ReceivingGood";
import { createContext, Dispatch, SetStateAction } from "react";

// config enum Tab
export enum TagFilterEnum {
  ALL = "0",
  MINE = "1",
  IN_PROGRESS = "2",
  APPROVAL = "3",
}

export enum TabKeyEnum {
  CONTRACTS = "0",
  CONTRACT_PLAN = "1",
}

export enum ConfirmModalType {
  DELETE = "DELETE",
  CANCEL = "CANCEL",
  REJECT = "REJECT",
  RETURN = "RETURN",
}

export enum ActionRowType {
  VIEW,
  VIEW_CONTRACT,
  VIEW_CONTRACT_WAITING,
  VIEW_PURCHASE_REQUEST,
  EDIT,
  VIEW_FROM_MASTER,
}

export interface ModelSelect {
  type: ConfirmModalType;
  model: ReceivingGoodModel;
  errorMessage?: string;
}

export interface ReceivingGoodsContextType {
  list?: ReceivingGoodModel[];
  modelFilter?: ReceivingGoodFilter;
  loadingList: boolean;
  repo?: RepoState;
  receivingTabsFilterRepository: TagFilterList[];
  count: number;
  countFilter: number;
  calculatedFilterCount: number;
  loadingModal: boolean;
  modelSelected: ModelSelect | null;
  setModelSelected: Dispatch<SetStateAction<ModelSelect | null>> | null;
  dispatchFilter?: Dispatch<FilterAction<ReceivingGoodFilter>>;
  handleLoadList: (filterParam?: ReceivingGoodFilter) => void;
  handleResetList: () => void;
  handleOnClickRow: (
    record: ReceivingGoodModel,
    type?: ActionRowType,
    waitingForApproval?: boolean
  ) => void;
  handleGoToReceivedEdit: (received: ReceivingGoodModel) => void;
  handleGoToReceivedClone: (received: ReceivingGoodModel) => void;
  handleApplyButtonInConfirmModal: (
    model: ReceivingGoodModel,
    reason?: string
  ) => void;
  getLinkClickRow?: (
    record: ReceivingGoodModel,
    type?: ActionRowType,
    waitingForApproval?: boolean
  ) => string;
}

const INITIAL_CONTEXT: ReceivingGoodsContextType = {
  modelFilter: new ReceivingGoodFilter(),
  list: [],
  dispatchFilter: null,
  repo: null,
  loadingList: false,
  count: numberConstants.ZERO,
  countFilter: numberConstants.ZERO,
  calculatedFilterCount: numberConstants.ZERO,
  receivingTabsFilterRepository: [],
  handleLoadList: null,
  handleResetList: null,
  handleOnClickRow: null,
  handleGoToReceivedEdit: null,
  handleGoToReceivedClone: null,
  setModelSelected: null,
  modelSelected: null,
  loadingModal: false,
  handleApplyButtonInConfirmModal: null,
};

export const ReceivingGoodsContext =
  createContext<ReceivingGoodsContextType>(INITIAL_CONTEXT);
