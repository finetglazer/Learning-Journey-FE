import { createContext, Dispatch, SetStateAction } from "react";
import { ActionRowType, ModelSelect, TagFilterList } from "../constants";
import { numberConstants } from "core/config/consts";
import {
  ContractAdjustment,
  ContractAdjustmentFilter,
} from "models/ContractAdjustment";
import { FilterAction } from "core/services/service-types";
import { RepoState } from "core/services/page-services/master-service";

export interface ContractAdjustmentMaster {
  modelFilter?: ContractAdjustmentFilter;
  count: number;
  list?: ContractAdjustment[];
  loadingList: boolean;
  loadingModal: boolean;
  dispatchFilter?: React.Dispatch<FilterAction<ContractAdjustmentFilter>>;
  calculatedFilterCount: number;
  handleLoadList: (filterParam?: ContractAdjustmentFilter) => void;
  handleResetList: () => void;
  tabFilterRepository: TagFilterList[];
  repo?: RepoState;
  getEmptyData?: () => boolean;
  modelSelected: ModelSelect | null;
  setModelSelected: Dispatch<SetStateAction<ModelSelect | null>> | null;
  modal: null | unknown;
  handleOnClickRow: (record: ContractAdjustment, type?: ActionRowType) => void;
  handleModal: (model: null | unknown) => void;
  countFilter?: number;
  loadingButtonConfirm?: boolean;
  handleApplyButtonInConfirmModal: (
    model: ContractAdjustment,
    reason?: string,
    action?: number
  ) => void;
}

export const ContractAdjustmentMasterContext =
  createContext<ContractAdjustmentMaster>({
    modelFilter: new ContractAdjustmentFilter(),
    list: [],
    count: numberConstants.ZERO,
    loadingList: false,
    loadingModal: false,
    dispatchFilter: null,
    calculatedFilterCount: numberConstants.ZERO,
    handleLoadList: null,
    handleResetList: null,
    tabFilterRepository: [],
    repo: null,
    setModelSelected: null,
    modelSelected: null,
    handleOnClickRow: null,
    modal: null,
    handleModal: null,
    handleApplyButtonInConfirmModal: null,
  });
