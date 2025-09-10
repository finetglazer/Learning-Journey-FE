import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { acceptanceRepository } from "core/repositories/AcceptanceRepository";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { isEmpty, isEqual } from "lodash";
import { AcceptanceFilter } from "models/Acceptance";
import { GoodsReceiptModel } from "models/Acceptance/GoodsReceipt";
import { useAcceptanceDetailContext } from "pages/PurchasePage/Acceptance/AcceptanceDetail/AcceptanceDetailContext";
import { useAcceptanceActions } from "pages/PurchasePage/Acceptance/Components/hooks/useAcceptanceActions";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface DeliveryReceiptModalHooksParams {
  onSelect?: (params: { listSelected: GoodsReceiptModel[] }) => void;
  goodItemSelectCurrent?: string[];
  selectedItems?: string[];
}

export const useDeliveryReceiptModalHooks = ({
  onSelect,
  selectedItems,
  goodItemSelectCurrent,
}: DeliveryReceiptModalHooksParams) => {
  const [translate] = useTranslation();
  const baseFilter: AcceptanceFilter = useMemo(() => {
    return {
      ...new AcceptanceFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
    };
  }, []);
  const { state } = useAcceptanceActions();
  const { model } = useAcceptanceDetailContext();
  const { model: modelView } = useAcceptanceDetailContext();

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(AcceptanceFilter, baseFilter);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<GoodsReceiptModel, AcceptanceFilter>(
      (filter) =>
        acceptanceRepository.goodsReceiptRequest({
          ...filter,
          contractId: isEqual(state, "CREATE")
            ? model?.id
            : modelView?.contractId,
        }),
      baseFilter,
      dispatchFilter,
      getModelFilter
    );
  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<GoodsReceiptModel>("checkbox", [], true);

  const handleSelected = () => {
    const listSelected = list.filter((item) =>
      selectedRowKeys.includes(item.id)
    );
    onSelect({
      listSelected,
    });
  };

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
    handleSelected,
  };
};
