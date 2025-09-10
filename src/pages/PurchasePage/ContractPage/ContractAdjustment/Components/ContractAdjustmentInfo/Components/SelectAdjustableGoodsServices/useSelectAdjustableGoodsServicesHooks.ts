import { DEFAULT_PAGE_SIZE } from "core/config/consts";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { tableService } from "core/services/page-services/table-service";
import { v4 as uuidv4 } from "uuid";
import { SelectAdjustableGoodsServicesModel } from "models/ContractAnnex";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  GoodItem,
  SelectAdjustableGoodsServicesFilterByContract,
} from "models/ContractAdjustment";
import { contractAdjustmentRepository } from "pages/PurchasePage/ContractPage/ContractAdjustment/ContractAdjustmentRepository";
import { isEmpty } from "lodash";

interface SelectAdjustableGoodsServicesParams {
  isContract: boolean;
  contractId: string | undefined;
  selectedFilter?: {
    goodsId: string;
    unitId: string;
  }[];
}

export const useSelectAdjustableGoodsServicesHooks = ({
  isContract,
  contractId,
  selectedFilter,
}: SelectAdjustableGoodsServicesParams) => {
  const [translate] = useTranslation();

  const baseFilter = useMemo(() => {
    return {
      ...new SelectAdjustableGoodsServicesFilterByContract(),
      pageIndex: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      contractId: contractId,
      selectedIds: selectedFilter?.map((item) => item?.goodsId),
    };
  }, []);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(
      SelectAdjustableGoodsServicesFilterByContract,
      baseFilter
    );

  const handleGetList = (
    filter: SelectAdjustableGoodsServicesFilterByContract
  ) => {
    const params: SelectAdjustableGoodsServicesFilterByContract = {
      pageIndex: filter?.pageIndex,
      pageSize: filter?.pageSize,
      search: filter?.search,
      categoryId: filter?.categoryId,
      contractId: filter.contractId,
      selectedIds: filter?.selectedIds,
    };

    if (isContract) {
      return contractAdjustmentRepository.getGoodsServicesFromContract(params);
    }

    return contractAdjustmentRepository.getGoodsServicesFromProposal(params);
  };

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<
      GoodItem,
      SelectAdjustableGoodsServicesFilterByContract
    >(handleGetList, baseFilter, dispatchFilter, getModelFilter);
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
        goodsIdSubmit: item?.id,
        id: `${
          !isEmpty(item?.purchaseItemId)
            ? item?.purchaseItemId
            : item?.contractGoodsItemId
        }}`,
        childrens: item?.childrens?.map((child: GoodItem) => ({
          ...child,
          goodsIdSubmit: child?.id,
          id: `${
            !isEmpty(child?.purchaseItemId)
              ? child?.purchaseItemId
              : child?.contractGoodsItemId
          }`,
        })),
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
