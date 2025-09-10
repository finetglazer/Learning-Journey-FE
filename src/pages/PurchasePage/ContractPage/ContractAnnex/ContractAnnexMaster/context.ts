import { createContext, Dispatch, SetStateAction } from "react";
import { ActionRowType, ModelSelect, TagFilterList } from "../constants";
import { numberConstants } from "core/config/consts";
import { ContractAnnex, ContractAnnexFilter } from "models/ContractAnnex";
import { FilterAction } from "core/services/service-types";
import { RepoState } from "core/services/page-services/master-service";
import { useContractAnnexMasterHook } from "./ContractAnnexMasterHook";

export interface ContractAnnexMaster
  extends Partial<
    Pick<ReturnType<typeof useContractAnnexMasterHook>, "handleModal">
  > {
  modelFilter?: ContractAnnexFilter;
  count: number;
  countFilter: number;
  list?: ContractAnnex[];
  loadingList: boolean;
  loadingModal: boolean;
  dispatchFilter?: React.Dispatch<FilterAction<ContractAnnexFilter>>;
  calculatedFilterCount: number;
  handleLoadList: (filterParam?: ContractAnnexFilter) => void;
  handleResetList: () => void;
  handleGoToContractAnnexEdit: (received: ContractAnnex) => void;
  tabFilterRepository: TagFilterList[];
  repo?: RepoState;
  getEmptyData?: () => boolean;
  setModelSelected: Dispatch<SetStateAction<ModelSelect | null>> | null;
  modal: null | unknown;
  handleOnClickRow: (
    record: ContractAnnex,
    type?: ActionRowType,
    waitingForApproval?: boolean
  ) => void;
  getLinkClickRow?: (
    record: ContractAnnex,
    waitingForApproval?: boolean
  ) => string;
}

export const ContractAnnexMasterContext = createContext<ContractAnnexMaster>({
  modelFilter: new ContractAnnexFilter(),
  list: [],
  count: numberConstants.ZERO,
  countFilter: numberConstants.ZERO,
  loadingList: false,
  loadingModal: false,
  dispatchFilter: null,
  calculatedFilterCount: numberConstants.ZERO,
  handleLoadList: null,
  handleResetList: null,
  tabFilterRepository: [],
  handleGoToContractAnnexEdit: null,
  repo: null,
  setModelSelected: null,
  modelSelected: null,
  handleOnClickRow: null,
  modal: null,
});
