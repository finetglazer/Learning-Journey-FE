import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";

import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { numberConstants } from "core/config/consts";
import {
  ContractDetailModel,
  ContractGoodsServices,
  GoodsServicesModalFilter,
} from "models/Contract";
import { GoodsServices } from "models/PurchaseRequest";
import { contractRepository } from "pages/PurchasePage/ContractPage/ContractRepository";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { tableService } from "core/services/page-services/table-service";

export const useAddGoodsServicesModalHook = () => {
  const [translate] = useTranslation();
  const {
    model: modelMaster,
    isOpenGoodsServicesModal,
    setIsOpenGoodsServicesModal,
    handleChangeSingleField,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const [isFirstSearchGoodsServices, setIsFirstSearchGoodsServices] =
    useState(true);
  const initialGoodsServicesList = useRef<GoodsServices[]>(null);
  const purchasePlanId = modelMaster?.originalPurchasePlanId;
  const supplierId = modelMaster?.contractSupplier?.supplierId;

  const baseFilter: GoodsServicesModalFilter = useMemo(() => {
    return {
      purchasePlanId,
      supplierId,
      search: "",
      purchaseCategory: undefined,
      pageIndex: numberConstants.ONE,
      pageSize: numberConstants.TEN,
    };
  }, [purchasePlanId, supplierId]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(GoodsServicesModalFilter, baseFilter);

  const {
    count,
    list: goodsServicesList,
    loadingList: loadingGoodsServicesList,
    handleLoadList: handleLoadGoodsServicesList,
    handleResetList: handleResetGoodsServicesList,
  } = listService.useList<GoodsServices, GoodsServicesModalFilter>(
    contractRepository.getGoodsServicesListByPurchasePlan,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const { handlePagination } = tableService.useTable(
    baseFilter,
    dispatchFilter,
    handleLoadGoodsServicesList
  );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<GoodsServices>("checkbox", [], true);

  const handleCloseGoodsServicesModal = () => {
    setSelectedRowKeys(
      modelMaster?.contractGoodsServicesList?.map(
        (item: ContractGoodsServices) => item?.id
      ) || []
    );
    setIsOpenGoodsServicesModal(false);
    handleResetGoodsServicesList();
  };

  const handleAddGoodsServices = () => {
    const newSelectedGoodsServices = (
      initialGoodsServicesList?.current || goodsServicesList
    ).filter((goodsServicesItem) =>
      selectedRowKeys.includes(goodsServicesItem?.id)
    );

    handleChangeSingleField({
      fieldName: "contractGoodsServicesList",
    })(newSelectedGoodsServices);
    setIsOpenGoodsServicesModal(false);
    handleResetGoodsServicesList();
  };

  const goodsServicesSelectionCheck = useCallback(() => {
    if (!isEmpty(modelMaster?.contractGoodsServicesList)) {
      setSelectedRowKeys(
        modelMaster?.contractGoodsServicesList?.map(
          (item: ContractGoodsServices) => item?.id
        )
      );
    } else {
      setSelectedRowKeys([]);
    }
  }, [modelMaster?.contractGoodsServicesList, setSelectedRowKeys]);

  useEffect(() => {
    if (isOpenGoodsServicesModal) {
      handleLoadGoodsServicesList(baseFilter);
      goodsServicesSelectionCheck();
    }
  }, [
    baseFilter,
    isOpenGoodsServicesModal,
    handleLoadGoodsServicesList,
    goodsServicesSelectionCheck,
  ]);

  return {
    translate,
    modelFilter,
    goodsServicesList,
    initialGoodsServicesList,
    loadingGoodsServicesList,
    rowSelection,
    isOpenGoodsServicesModal,
    isFirstSearchGoodsServices,
    purchasePlanId,
    supplierId,
    setIsFirstSearchGoodsServices,
    dispatchGoodsServicesModalFilter: dispatchFilter,
    handleLoadGoodsServicesList,
    handleResetGoodsServicesList,
    handleCloseGoodsServicesModal,
    handleAddGoodsServices,
    count,
    handlePagination,
  };
};
