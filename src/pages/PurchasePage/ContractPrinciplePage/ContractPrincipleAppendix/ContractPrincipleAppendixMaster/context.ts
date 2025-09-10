import { numberConstants } from "core/config/consts";
import { FilterAction } from "core/services/service-types";
import {
  ContractPrincioleAppendixFilter,
  ContractPrincipleAppendixListModel,
} from "models/ContractPrincipleAppendix";
import { createContext, Dispatch } from "react";
import { ActionRowType, TagFilterList } from "../constants";

export interface ContractPrincipleAppendixMaster {
  modelFilter?: ContractPrincioleAppendixFilter;
  count: number;
  countFilter: number;
  list?: ContractPrincipleAppendixListModel[];
  loadingList: boolean;
  loadingModal: boolean;
  calculatedFilterCount: number;
  handleLoadList: (filterParam?: ContractPrincioleAppendixFilter) => void;
  dispatchFilter?: Dispatch<FilterAction<ContractPrincioleAppendixFilter>>;
  handleResetList: () => void;
  tabFilterRepository: TagFilterList[];
  handleOnClickRow: (
    record: ContractPrincipleAppendixListModel,
    type?: ActionRowType,
    waitingForApproval?: boolean
  ) => void;
  handleGoToContractPrincipleAppendixEdit: (
    received: ContractPrincipleAppendixListModel
  ) => void;
  modal?: null | unknown;
  handleModal?: (modal: null | unknown) => void;
  getLinkClickRow?: (
    record: ContractPrincipleAppendixListModel,
    waitingForApproval?: boolean
  ) => string;
}

export const ContractPrincipleAppendixMasterContext =
  createContext<ContractPrincipleAppendixMaster>({
    modelFilter: null,
    list: [],
    count: numberConstants.ZERO,
    countFilter: numberConstants.ZERO,
    loadingList: false,
    loadingModal: false,
    handleLoadList: null,
    dispatchFilter: null,
    calculatedFilterCount: numberConstants.ZERO,
    handleResetList: null,
    tabFilterRepository: [],
    handleGoToContractPrincipleAppendixEdit: null,
    handleOnClickRow: null,
  });
