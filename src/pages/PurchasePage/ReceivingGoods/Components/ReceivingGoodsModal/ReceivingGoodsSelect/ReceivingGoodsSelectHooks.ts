import type { TableRowSelection } from "antd/es/table/interface";
import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { HandleLoadList } from "core/models/Filter/Filter";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { FilterAction } from "core/services/service-types";
import { isEmpty } from "lodash";
import { GoodsReceiptFilter } from "models/GoodsReceipt/GoodsReceiptFilter";
import { GoodsReceiptRequestItem } from "models/ReceivingGood/GoodsReceipt";
import { receivedGoodsRepository } from "pages/PurchasePage/ReceivingGoods/ReceivedGoodRepository";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";

export interface ReceivingGoodsSelectHooks {
  modelFilter: GoodsReceiptFilter;
  list: GoodsReceiptRequestItem[];
  count: number;
  loadingList: boolean;
  rowSelection: TableRowSelection<GoodsReceiptRequestItem>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  dispatchFilter: Dispatch<FilterAction<GoodsReceiptFilter>>;
  handleLoadList: HandleLoadList<GoodsReceiptFilter>;
  handleResetList: () => void;
}

export const ReceivingGoodsSelectHooksContext =
  createContext<ReceivingGoodsSelectHooks>({
    modelFilter: new GoodsReceiptFilter(),
    list: [],
    count: numberConstants.ZERO,
    loadingList: false,
    rowSelection: undefined,
    selectedRowKeys: [],
    setSelectedRowKeys: null,
    dispatchFilter: null,
    handleLoadList: null,
    handleResetList: null,
  });
export const useReceivingGoodsSelectHooks = ({
  contractId,
  goodItemSelectCurrent,
  selectedItems,
}: {
  contractId: string;
  goodItemSelectCurrent: string[];
  selectedItems: string[];
}) => {
  const [translate] = useTranslation();
  const baseFilter: GoodsReceiptFilter = useMemo(() => {
    return {
      ...new GoodsReceiptFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
    };
  }, []);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(GoodsReceiptFilter, baseFilter);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<GoodsReceiptRequestItem, GoodsReceiptFilter>(
      (filter) =>
        receivedGoodsRepository.getGoodServicesList({ ...filter, contractId }),
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<GoodsReceiptRequestItem>("checkbox", [], true);

  useEffect(() => {
    if (isEmpty(list)) {
      return;
    }

    setSelectedRowKeys(goodItemSelectCurrent || []);
  }, [goodItemSelectCurrent, list, setSelectedRowKeys]);

  useEffect(() => {
    handleLoadList();
  }, [modelFilter]);

  const filteredList = useMemo(() => {
    return list.filter((item) => !selectedItems?.includes(item.id));
  }, [list, selectedItems]);

  return {
    list: filteredList,
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
  };
};
