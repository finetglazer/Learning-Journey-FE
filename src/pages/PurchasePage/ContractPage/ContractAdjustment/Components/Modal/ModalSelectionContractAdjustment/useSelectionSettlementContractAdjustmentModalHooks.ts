import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { getISOStringDate } from "core/helpers/date-time";
import { CONTRACT_ADJUSTMENT_DETAIL_ROUTE } from "config/route-const";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { tableService } from "core/services/page-services/table-service";
import { isNil } from "lodash";
import {
  ContractAdjustmentSettlementFilter,
  ContractToAdjustmentModel,
} from "models/ContractAdjustment";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { contractAdjustmentRepository } from "../../../ContractAdjustmentRepository";

export const useSelectionSettlementContractAdjustmentModalHooks = () => {
  const [translate] = useTranslation();
  const history = useHistory();

  const baseFilter: ContractAdjustmentSettlementFilter = useMemo(() => {
    return {
      ...new ContractAdjustmentSettlementFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
    };
  }, []);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(
      ContractAdjustmentSettlementFilter,
      baseFilter
    );

  const handleGetList = (filter: ContractAdjustmentSettlementFilter) => {
    const createDateFrom =
      getISOStringDate(filter?.createDate?.greaterEqual) || undefined;
    const createDateTo =
      getISOStringDate(filter?.createDate?.lessEqual) || undefined;

    const contractValueFrom = Number(filter?.contractValueFrom) ?? undefined;
    const contractValueTo = Number(filter?.contractValueTo) ?? undefined;
    let params = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search,
    } as ContractAdjustmentSettlementFilter;

    if (!isNil(createDateTo) || !isNil(createDateFrom)) {
      params = {
        ...params,
        createdDateRange: {
          from: createDateFrom,
          to: createDateTo,
        },
      };
    }

    if (!isNil(contractValueFrom) || !isNil(contractValueTo)) {
      params = {
        ...params,
        amountRange: {
          from: contractValueFrom,
          to: contractValueTo,
        },
      };
    }

    return contractAdjustmentRepository.getAllContractNeedAdjust(params);
  };

  const { list, count, loadingList, error, handleLoadList, handleResetList } =
    listService.useList<
      ContractToAdjustmentModel,
      ContractAdjustmentSettlementFilter
    >(handleGetList, baseFilter, dispatchFilter, getModelFilter);
  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<ContractToAdjustmentModel>(
      "radio",
      [],
      true,
      "auto"
    );

  const handleSelected = () => {
    const id = selectedRowKeys?.[numberConstants.ZERO];
    if (isNil(id)) return;
    history.push(`${CONTRACT_ADJUSTMENT_DETAIL_ROUTE}?id=${id}`);
  };

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  useEffect(() => {
    handleLoadList();
  }, [modelFilter?.createDate]);

  return {
    list,
    count,
    error,
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
