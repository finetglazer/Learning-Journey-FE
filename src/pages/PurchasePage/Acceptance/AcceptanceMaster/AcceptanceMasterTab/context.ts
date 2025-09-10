import { numberConstants } from "core/config/consts";
import { RepoState } from "core/services/page-services/master-service";
import { FilterAction } from "core/services/service-types";
import { AcceptanceFilter, AcceptanceModel } from "models/Acceptance";
import { TagFilterList } from "models/ReceivingGood";
import { createContext, Dispatch, SetStateAction } from "react";
import { ActionRowType } from "../AcceptanceMasterHook";

export enum ConfirmModalType {
  DELETE = "DELETE",
  CANCEL = "CANCEL",
  REJECT = "REJECT",
  RETURN = "RETURN",
}
export interface ModelSelect {
  type: ConfirmModalType;
  model: AcceptanceModel;
  errorMessage?: string;
}

export interface AcceptanceMaster {
  modelFilter?: AcceptanceFilter;
  list?: AcceptanceModel[];
  count: number;
  loadingModal: boolean;
  loadingList: boolean;
  dispatchFilter?: React.Dispatch<FilterAction<AcceptanceFilter>>;
  calculatedFilterCount: number;
  handleLoadList: (filterParam?: AcceptanceFilter) => void;
  handleResetList: () => void;
  handleGoToAcceptanceEdit: (received: AcceptanceModel) => void;
  handleOnClickRow: (
    record: AcceptanceModel,
    type?: ActionRowType,
    waitingForApproval?: boolean
  ) => void;
  repo?: RepoState;
  tabFilterRepository: TagFilterList[];
  getEmptyData?: () => boolean;
  modelSelected: ModelSelect | null;
  setModelSelected: Dispatch<SetStateAction<ModelSelect | null>> | null;
  getLinkClickRow?: (
    record: AcceptanceModel,
    type?: ActionRowType,
    waitingForApproval?: boolean
  ) => string;
}

export const AcceptanceMasterContext = createContext<AcceptanceMaster>({
  modelFilter: new AcceptanceFilter(),
  list: [],
  count: numberConstants.ZERO,
  loadingModal: false,
  loadingList: false,
  dispatchFilter: null,
  calculatedFilterCount: numberConstants.ZERO,
  handleLoadList: null,
  handleResetList: null,
  handleOnClickRow: null,
  handleGoToAcceptanceEdit: null,
  repo: null,
  tabFilterRepository: [],
  setModelSelected: null,
  modelSelected: null,
});
