import { useDebounceFn } from "ahooks";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, FilterActionEnum } from "core/services/service-types";
import type { TFunction } from "i18next";
import { LogTrackingFilterModel, LogTrackingModel } from "models/LogTracking";
import { createContext, Dispatch, useEffect, useMemo } from "react";
import { DEBOUNCE_TIME_300 } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { logTrackingRepository } from "./LogTrackingRepository";

export interface LogTrackingContextType {
  translate?: TFunction<"translation", undefined>;
  logList?: LogTrackingModel[];
  totalLogs?: number;
  loadingList?: boolean;
  modelFilter?: LogTrackingFilterModel;
  countFilter?: number;
  onSearchingLogs?: (search: string) => void;
  handleResetList?: () => void;
  handleLoadList?: (
    filterParam?: LogTrackingFilterModel,
    isOverrideFilter?: boolean
  ) => void;
  dispatchFilter?: Dispatch<FilterAction<LogTrackingFilterModel>>;
}

export const LogTrackingContext = createContext<LogTrackingContextType>({});

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 50;

export const useLogTrackingHook = () => {
  const [translate] = useTranslation();

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      LogTrackingFilterModel,
      {
        ...new LogTrackingFilterModel(),
        pageIndex: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter = useMemo(() => {
    return {
      ...new LogTrackingFilterModel(),
      pageIndex: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const {
    list: logList,
    count: totalLogs,
    loadingList,
    handleResetList,
    handleLoadList,
  } = listService.useList<LogTrackingModel, LogTrackingFilterModel>(
    logTrackingRepository.getLogList,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const { run: onSearchingLogs } = useDebounceFn(
    (search: string) => {
      const payload = {
        search: search,
        pageIndex: DEFAULT_PAGE,
      };

      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload,
      });
      handleLoadList({ ...payload });
    },
    {
      wait: DEBOUNCE_TIME_300,
    }
  );

  useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  return {
    translate,
    logList,
    totalLogs,
    loadingList,
    modelFilter,
    countFilter,
    handleResetList,
    handleLoadList,
    dispatchFilter,
    onSearchingLogs,
  };
};
