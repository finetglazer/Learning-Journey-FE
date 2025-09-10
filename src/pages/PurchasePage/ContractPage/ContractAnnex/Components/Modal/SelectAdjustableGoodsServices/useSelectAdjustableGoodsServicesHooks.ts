import { DEFAULT_PAGE_SIZE } from "core/config/consts";
import { contractAnnexRepository } from "core/repositories/ContractAnnex";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { tableService } from "core/services/page-services/table-service";
import { isEqual, uniqueId } from "lodash";
import {
  SelectAdjustableGoodsServicesFilterByContract,
  SelectAdjustableGoodsServicesFilterByProposal,
  SelectAdjustableGoodsServicesModel,
} from "models/ContractAnnex";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface SelectAdjustableGoodsServicesParams {
  isContract: boolean;
  contractId: string | undefined;
  proposalId: string | undefined;
  selectedFilter?: {
    goodsId: string;
    unitId: string;
    isContract: boolean;
  }[];
}

type Filter =
  | SelectAdjustableGoodsServicesFilterByProposal
  | SelectAdjustableGoodsServicesFilterByContract;

export const useSelectAdjustableGoodsServicesHooks = ({
  isContract,
  contractId,
  proposalId,
  selectedFilter,
}: SelectAdjustableGoodsServicesParams) => {
  const [translate] = useTranslation();

  const FilterModel = isContract
    ? SelectAdjustableGoodsServicesFilterByContract
    : SelectAdjustableGoodsServicesFilterByProposal;

  const baseFilter: Filter = useMemo(() => {
    return {
      ...new FilterModel(),
      pageIndex: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    };
  }, [FilterModel]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(FilterModel, baseFilter);

  const selectedIds = selectedFilter?.map((item) => item?.goodsId);

  const handleGetList = (filter: Filter) => {
    const params: Filter = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search,
      selectedIds,
      categoryId: filter?.categoryId,
    };

    if (isContract) {
      return contractAnnexRepository.getContract({ ...params, contractId });
    }

    return contractAnnexRepository.getProposal({
      ...params,
      proposalId,
    });
  };

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<SelectAdjustableGoodsServicesModel, Filter>(
      handleGetList,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );
  const { rowSelection, selectedRowKeys, setSelectedRowKeys, selectedRow } =
    listService.useRowSelection<SelectAdjustableGoodsServicesModel>(
      "checkbox",
      [],
      true,
      "manual"
    );

  const { handleTableChange, handlePagination } = tableService.useTable(
    modelFilter,
    dispatchFilter,
    handleLoadList
  );

  useEffect(() => {
    handleLoadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContract, modelFilter?.categoryId]);

  const data = useMemo(
    () =>
      list?.map((item) => ({
        ...item,
        id: `${item?.id}_${uniqueId("unit")}`,
      })),
    [list]
  );

  return {
    list: data,
    count,
    loadingList,
    modelFilter,
    rowSelection,
    selectedRow,
    selectedRowKeys,
    translate,
    handleLoadList,
    handleResetList,
    dispatchFilter,
    setSelectedRowKeys,
    handleTableChange,
    handlePagination,
  };
};
