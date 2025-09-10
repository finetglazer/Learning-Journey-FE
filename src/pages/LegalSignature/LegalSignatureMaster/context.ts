import { createContext } from "react";
import { TagFilterList } from "../constants";
import { numberConstants } from "core/config/consts";
import { Legal, LegalSignatureFilter } from "models/LegalSignature";
import { FilterAction } from "core/services/service-types";
import { RepoState } from "core/services/page-services/master-service";

export interface LegalSignatureMaster {
  modelFilter?: LegalSignatureFilter;
  count: number;
  list?: Legal[];
  loadingList: boolean;
  loadingPreview: boolean;
  dispatchFilter?: React.Dispatch<FilterAction<LegalSignatureFilter>>;
  calculatedFilterCount: number;
  handleLoadList: (filterParam?: LegalSignatureFilter) => void;
  handleResetList: () => void;
  tabFilterRepository: TagFilterList[];
  repo?: RepoState;
  getEmptyData?: () => boolean;
  countFilter?: number;
  handlePreview: (data: any) => void;
  model: any;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSignature: (record: Legal[]) => void;
}

export const LegalSignatureMasterContext = createContext<LegalSignatureMaster>({
  modelFilter: new LegalSignatureFilter(),
  list: [],
  count: numberConstants.ZERO,
  loadingList: false,
  loadingPreview: false,
  dispatchFilter: null,
  calculatedFilterCount: numberConstants.ZERO,
  handleLoadList: null,
  handleResetList: null,
  tabFilterRepository: [],
  repo: null,
  handlePreview: null,
  model: null,
  loading: false,
  setLoading: null,
  handleSignature: null,
});
