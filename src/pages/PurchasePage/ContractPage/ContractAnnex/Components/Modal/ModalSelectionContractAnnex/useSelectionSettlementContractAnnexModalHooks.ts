import { CONTRACT_ANNEX_CREATE_ROUTE } from "config/route-const";
import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { getISOStringDate } from "core/helpers/date-time";
import { contractToAppendix } from "core/repositories/ContractToAppendixRepository";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { tableService } from "core/services/page-services/table-service";
import { isNil } from "lodash";
import {
  ContractAppendixSettlementFilter,
  ContractToAppendixModel,
} from "models/ContractAnnex";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const useSelectionSettlementContractAnnexModalHooks = () => {
  const [translate] = useTranslation();
  const history = useHistory();

  const baseFilter: ContractAppendixSettlementFilter = useMemo(() => {
    return {
      ...new ContractAppendixSettlementFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
    };
  }, []);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(ContractAppendixSettlementFilter, baseFilter);

  const handleGetList = (filter: ContractAppendixSettlementFilter) => {
    const createDateFrom =
      getISOStringDate(filter?.createDate?.greaterEqual) || undefined;
    const createDateTo =
      getISOStringDate(filter?.createDate?.lessEqual) || undefined;

    const contractValueFrom = Number(filter?.contractValueFrom) || undefined;
    const contractValueTo = Number(filter?.contractValueTo) || undefined;
    let params = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search,
    } as ContractAppendixSettlementFilter;

    if (!isNil(createDateTo) || !isNil(createDateFrom)) {
      params = {
        ...params,
        createDateFrom,
        createDateTo,
      };
    }

    if (!isNil(contractValueFrom) || !isNil(contractValueTo)) {
      params = {
        ...params,
        contractValueFrom,
        contractValueTo,
      };
    }
    return contractToAppendix.getList(params);
  };

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<
      ContractToAppendixModel,
      ContractAppendixSettlementFilter
    >(handleGetList, baseFilter, dispatchFilter, getModelFilter);
  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<ContractToAppendixModel>(
      "radio",
      [],
      true,
      "auto"
    );

  const handleSelected = () => {
    const id = selectedRowKeys?.[numberConstants.ZERO];
    if (isNil(id)) return;
    history.push(`${CONTRACT_ANNEX_CREATE_ROUTE}/${id}`);
  };

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  useEffect(() => {
    handleLoadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelFilter?.createDate]);

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
