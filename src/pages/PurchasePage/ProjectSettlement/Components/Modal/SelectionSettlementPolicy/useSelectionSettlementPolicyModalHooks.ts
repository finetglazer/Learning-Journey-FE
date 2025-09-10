import { PROJECT_SETTLEMENT_CREATE_ROUTE } from "config/route-const";
import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { projectSettlement } from "core/repositories/ProjectSettlement";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { tableService } from "core/services/page-services/table-service";
import { isNil } from "lodash";
import { SettlementPolicyModel } from "models/SettlementPolicy/SettlementPolicy";
import { SettlementPolicyFilter } from "models/SettlementPolicy/SettlementPolicyFilter";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const useSelectionSettlementPolicyModalHooks = () => {
  const [translate] = useTranslation();
  const history = useHistory();

  const baseFilter: SettlementPolicyFilter = useMemo(() => {
    return {
      ...new SettlementPolicyFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
    };
  }, []);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(SettlementPolicyFilter, baseFilter);

  const handleGetList = (filter: SettlementPolicyFilter) => {
    const createdDateRange = {
      from: filter?.createdDateRange?.from,
      to: filter?.createdDateRange?.to,
    };

    const totalRange = {
      from: filter?.totalRangeFrom,
      to: filter?.totalRangeTo,
    };
    let params = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search,
    } as SettlementPolicyFilter;

    if (!isNil(createdDateRange?.to) || !isNil(createdDateRange?.from)) {
      params = {
        ...params,
        createdDateRange,
      };
    }

    if (!isNil(totalRange?.to) || !isNil(totalRange?.from)) {
      params = {
        ...params,
        totalRange,
      };
    }
    return projectSettlement.getList(params);
  };

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<SettlementPolicyModel, SettlementPolicyFilter>(
      handleGetList,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );
  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<SettlementPolicyModel>(
      "radio",
      [],
      true,
      "auto"
    );

  const handleSelected = () => {
    const id = selectedRowKeys?.[0];
    if (isNil(id)) return;
    history.push(`${PROJECT_SETTLEMENT_CREATE_ROUTE}/${id}`);
  };

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  useEffect(() => {
    handleLoadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelFilter?.createdDateRange]);

  return {
    list,
    count,
    loadingList,
    modelFilter,
    rowSelection,
    selectedRowKeys,
    translate,
    handleLoadList,
    handleResetList,
    dispatchFilter,
    setSelectedRowKeys,
    handleSelected,
    handleTableChange,
    handlePagination,
  };
};
