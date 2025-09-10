import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { HandleLoadList } from "core/models/Filter/Filter";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction } from "core/services/service-types";
import { CostDriver } from "models/CostDriver/CostDriver";
import { CostDriverFilter } from "models/CostDriver/CostDriverFilter";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { budgetManagementBreadcrumb } from "../constants";
import costDriverRepository from "./CostDriverRepository";

export enum CostDriverModal {
  "DETAIL",
}

export interface CostDriverMaster {
  modelFilter: CostDriverFilter;
  list: CostDriver[];
  count: number;
  countFilter: number;
  loadingList: boolean;
  dispatchFilter: Dispatch<FilterAction<CostDriverFilter>>;
  handleLoadList: HandleLoadList<CostDriverFilter>;
  handleResetList: () => void;
  setModal?: Dispatch<SetStateAction<boolean>>;
  handleActionCostDriver?: (params: {
    modal: CostDriverModal;
    id?: string;
  }) => void;
}

export const CostDriverMasterContext = createContext<CostDriverMaster>({
  modelFilter: new CostDriverFilter(),
  list: [],
  count: numberConstants.ZERO,
  countFilter: numberConstants.ZERO,
  loadingList: false,
  dispatchFilter: null,
  handleLoadList: null,
  handleResetList: null,
  handleActionCostDriver: null,
});

export const useCostDriverMasterHooks = () => {
  const [translate] = useTranslation();
  const costDriverIdSelected = useRef<string | null>(null);
  const [modal, setModal] = useState<CostDriverModal | null>(null);

  const breadcrumb = useMemo(
    () => [
      ...budgetManagementBreadcrumb,
      {
        name: translate("CM.menu_title_cost_driver"),
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      CostDriverFilter,
      {
        ...new CostDriverFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: CostDriverFilter = useMemo(() => {
    return {
      ...new CostDriverFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<CostDriver, CostDriverFilter>(
      costDriverRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const handleActionCostDriver = useCallback(
    ({ modal, id }: { modal: CostDriverModal; id?: string }) => {
      setModal(modal);
      costDriverIdSelected.current = id;
    },
    []
  );

  useLayoutEffect(() => {
    handleLoadList();
  }, []);

  return {
    list,
    count,
    countFilter,
    modelFilter,
    loadingList,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    costDriverIdSelected: costDriverIdSelected.current,
    handleActionCostDriver,
    // non-context
    translate,
    breadcrumb,
    modal,
    setModal,
  };
};
