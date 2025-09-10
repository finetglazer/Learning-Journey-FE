import useDebounceFn from "ahooks/lib/useDebounceFn";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { tableService } from "core/services/page-services/table-service";
import { FilterActionEnum } from "core/services/service-types";
import { SupplierFilter, SupplierModel } from "models/Payment";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { useEffect } from "react";

export const useAddSupplierHook = () => {
  const baseFilter = {
    ...new SupplierFilter(),
    pageIndex: 1,
    pageSize: 10,
  };

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(SupplierFilter, baseFilter);

  const { list, count, handleLoadList, loadingList } = listService.useList<
    SupplierModel,
    SupplierFilter
  >(
    purchasingPlanRepository.getSupplierList,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const { handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  const { rowSelection, selectedRowKeys, selectedRow, setSelectedRowKeys } =
    listService.useRowSelection<SupplierModel>("checkbox", [], false, "auto");

  const { run: handleSearch } = useDebounceFn(
    (search: string) => {
      const filter = {
        ...baseFilter,
        search: search,
      };
      dispatchFilter({
        type: FilterActionEnum.UPDATE,
        payload: filter,
      });
      handleLoadList(filter);
    },
    {
      wait: 300,
    }
  );

  useEffect(() => {
    handleLoadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    list,
    count,
    modelFilter,
    loadingList,
    selectedRow,
    rowSelection,
    selectedRowKeys,
    handleSearch,
    setSelectedRowKeys,
    handlePagination,
  };
};
