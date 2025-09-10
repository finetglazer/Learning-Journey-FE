import type { AxiosResponse } from "axios";
import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import appMessageService from "core/services/common-services/app-message-service";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { tableService } from "core/services/page-services/table-service";
import { FilterAction, FilterActionEnum } from "core/services/service-types";
import { saveAs } from "file-saver";
import { Promotion, PromotionFilter } from "models/Promotion";
import { CostItems } from "models/Report/CostItems";
import { reportRepository } from "pages/ReportPage/ReportRepository";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { ModelFilter } from "react-3layer-common";

export interface PromotionContextType {
  modelFilter: PromotionFilter;
  countFilter: number;
  list: Promotion[];
  count: number;
  loadingList: boolean;
  handleResetList: () => void;
  handleLoadList: () => void;
  dispatchFilter: React.Dispatch<FilterAction<PromotionFilter>>;
  error: AxiosResponse["data"];
  isReset?: boolean;
  isHaveDate?: boolean;
}

export const PromotionContext = React.createContext<PromotionContextType>({
  modelFilter: new PromotionFilter(),
  countFilter: 0,
  list: [],
  count: 0,
  loadingList: false,
  handleResetList: null,
  handleLoadList: null,
  dispatchFilter: null,
  error: null,
  isReset: false,
  isHaveDate: false,
});

export function usePromotionHook() {
  const [isShowResult, setIsShowResult] = useState<boolean>(false);
  const [loadingFile, setLoadingFile] = useState<boolean>(false);
  const [isReset, setIsReset] = useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const [originFilter, dispatchOriginFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      PromotionFilter,
      {
        ...new PromotionFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType"]
    );

  const { modelFilter, dispatchFilter } = filterService.useModelFilter(
    PromotionFilter,
    originFilter
  );
  const isReloadPage = modelFilter?.isReloadPage;

  const baseFilter = React.useMemo(() => {
    return {
      ...new PromotionFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: modelFilter?.pageSize,
      isReset: modelFilter?.isReset,
    };
  }, [modelFilter]);

  const { list, count, error, loadingList, handleResetList, handleLoadList } =
    listService.useList<CostItems, PromotionFilter>(
      reportRepository.promotionList,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const handleApplyFilter = useCallback(() => {
    const filter = {
      ...modelFilter,
      isReloadPage: true,
      pageSize: originFilter?.pageSize,
      pageIndex: 1,
    };
    dispatchOriginFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
    handleLoadList(filter, true);
    setIsReset(false);
    setIsShowResult(true);
  }, [dispatchFilter, handleLoadList, modelFilter, list]);

  const { handlePagination } = tableService.useTable(
    originFilter,
    dispatchOriginFilter,
    handleLoadList as (newFilter?: ModelFilter) => void
  );

  const handleFilter = () => {
    dispatchFilter({
      type: FilterActionEnum.UPDATE,
      payload: { isReloadPage: true },
    });
    handleLoadList();
    setIsShowResult(true);
  };

  const handleResetFilter = () => {
    const resetParams = {
      type: FilterActionEnum.SET,
      payload: baseFilter,
    };

    dispatchFilter(resetParams);
    setIsReset(true);
  };

  useLayoutEffect(() => {
    if (isReloadPage) {
      handleLoadList();
      setIsShowResult(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExportExcelFile = React.useCallback(
    (filter: PromotionFilter, fileName: string) => {
      setLoadingFile(true);
      reportRepository.getPromotionFile(filter).subscribe({
        next: (response: AxiosResponse["data"]) => {
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(blob, fileName);
        },
        complete: () => {
          setLoadingFile(false);
        },
      });
    },
    []
  );

  const createDateRangeFrom = modelFilter?.createDate?.greaterEqual;
  const createDateRangeTo = modelFilter?.createDate?.lessEqual;

  const isHaveDate = createDateRangeFrom && createDateRangeTo;

  return {
    list,
    count,
    loadingList,
    handleLoadList,
    handleResetList,
    handleApplyFilter,
    modelFilter,
    dispatchFilter,
    countFilter,
    notifyToast,
    handlePagination,
    handleExportExcelFile,
    handleFilter,
    isShowResult,
    loadingFile,
    handleResetFilter,
    isReset,
    error: error?.data,
    isHaveDate: !!isHaveDate,
  };
}
