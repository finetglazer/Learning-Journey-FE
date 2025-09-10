import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { DEFAULT_PAGE_SIZE } from "core/config/consts";
import appMessageService from "core/services/common-services/app-message-service";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { tableService } from "core/services/page-services/table-service";
import { FilterActionEnum, ListResult } from "core/services/service-types";
import saveAs from "file-saver";
import { useLayoutEffect, useState } from "react";
import { ModelFilter } from "react-3layer-common";
import { Observable } from "rxjs";

interface Params<TList, TFilter extends ModelFilter> {
  ModelFilterClass: typeof ModelFilter;
  getList?: (filter: TFilter) => Observable<ListResult<TList>>;
  onExport: (filter: TFilter) => Observable<AxiosResponse<ArrayBuffer>>;
}

export default function useReport<TList, TFilter extends ModelFilter>({
  ModelFilterClass,
  getList,
  onExport,
}: Params<TList, TFilter>) {
  const [isShowResult, setIsShowResult] = useState<boolean>(false);
  const [isReset, setIsReset] = useState<boolean>(false);
  const { notifyToast } = appMessageService.useCRUDMessage();
  const [originFilter, dispatchOriginFilter, _, getModelFilter] =
    queryStringService.useQueryString(
      ModelFilterClass,
      {
        ...new ModelFilterClass(),
        pageIndex: 1,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["isReloadPage"]
    );

  const baseFilter = {
    ...new ModelFilterClass(),
    pageIndex: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  };

  const { modelFilter, dispatchFilter } = filterService.useModelFilter(
    ModelFilterClass,
    originFilter
  );

  const { list, count, loadingList, error, handleLoadList } =
    listService.useList<TList, TFilter>(
      getList,
      baseFilter as TFilter,
      dispatchFilter,
      getModelFilter as () => TFilter
    );
  const isReloadPage = modelFilter?.isReloadPage;

  const {
    handleChangeAllFilter,
    handleChangeInputFilter,
    handleChangeMultipleSelectFilter,
    handleChangeDateFilter,
    handleChangeDateRangeFilter,
    handleChangeSelectFilter,
  } = filterService.useFilter(modelFilter, dispatchFilter);

  const { handlePagination } = tableService.useTable(
    originFilter,
    dispatchOriginFilter,
    handleLoadList as (newFilter?: ModelFilter) => void
  );

  useLayoutEffect(() => {
    if (isReloadPage) {
      handleLoadList();
      setIsShowResult(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = () => {
    const filter = {
      ...modelFilter,
      isReloadPage: true,
      pageSize: originFilter?.pageSize,
      pageIndex: 1,
    } as unknown as TFilter;

    dispatchOriginFilter({
      type: FilterActionEnum.SET,
      payload: filter,
    });
    handleLoadList(filter, true);
    setIsShowResult(true);
    setIsReset(false);
  };

  const handleResetFilter = () => {
    const resetParams = {
      type: FilterActionEnum.SET,
      payload: baseFilter,
    };
    dispatchOriginFilter(resetParams);
    dispatchFilter(resetParams);
    setIsReset(true);
  };

  const handleExportFile = (fileName: string) => {
    const filter = getModelFilter();
    onExport(filter as TFilter).subscribe({
      next: (response: AxiosResponse<ArrayBuffer>) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, fileName);
      },
      error: (error: AxiosError) => {
        notifyToast({
          message: error.response?.data?.message,
          type: "error",
        });
      },
    });
  };

  return {
    modelFilter: {
      ...modelFilter,
      pageIndex: originFilter.pageIndex,
      pageSize: originFilter.pageSize,
    } as TFilter,
    list,
    error: (error as any)?.data,
    count,
    loadingList,
    isReset,
    isShowResult,
    dispatchFilter,
    handleFilter,
    handleResetFilter,
    handleExportFile,
    handlePagination,
    handleChangeInputFilter,
    handleChangeDateFilter,
    handleChangeDateRangeFilter,
    handleChangeSelectFilter,
    handleChangeMultipleSelectFilter,
    handleChangeAllFilter,
  };
}
