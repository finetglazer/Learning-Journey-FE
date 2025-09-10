import { TableRowSelection } from "antd/lib/table/interface";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import {
  FilterAction,
  FilterActionEnum,
  KeyType,
} from "core/services/service-types";
import { GoodsServicesFilter } from "models/PurchaseRequest";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  PurchasePlanGoodsServicesModel,
  PurchasingPlanModel,
  PurchasingPlanTypeModel,
} from "models/PurchasingPlan";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { PurchasingPlanDetailHookContext } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanDetail/PurchasingPlanDetailHook";
import { v4 as uuidv4 } from "uuid";
import {
  childText,
  TYPE_PURCHASING_PLAN,
} from "models/PurchasingPlan/PurchasingPlanConstant";

interface GoodsServicesModalHookProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  callback?: (data: PurchasePlanGoodsServicesModel[]) => void;
  id: string;
  selectedKeys: string[];
  selectRowsModal?: PurchasePlanGoodsServicesModel[];
  purchasePlanId?: string;
  model?: PurchasingPlanTypeModel;
  isPurchasingPlanCompetitiveOfferPage?: boolean;
}

export interface GoodsServicesModal {
  list: PurchasePlanGoodsServicesModel[];
  modelFilter: GoodsServicesFilter;
  count: number;
  loadingList: boolean;
  dispatchFilter: Dispatch<FilterAction<GoodsServicesFilter>>;
  handleLoadList: (filterParams?: GoodsServicesFilter) => void;
  rowSelection: TableRowSelection<PurchasePlanGoodsServicesModel>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  selectedKeys?: string[];
  selectRowsModal?: PurchasePlanGoodsServicesModel[];
  setSelectedRow: Dispatch<SetStateAction<PurchasePlanGoodsServicesModel[]>>;
  selectedRow?: PurchasePlanGoodsServicesModel[];
  purchasePlanId?: string;
}

export const PlanGoodsServicesModalContext = createContext<GoodsServicesModal>({
  list: [],
  modelFilter: null,
  count: 0,
  loadingList: false,
  dispatchFilter: null,
  handleLoadList: null,
  rowSelection: undefined,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
  selectedKeys: [],
  selectRowsModal: [],
  setSelectedRow: null,
  selectedRow: [],
});

export const useGoodsServicesModalHooks = ({
  setModal,
  callback,
  id,
  selectedKeys,
  selectRowsModal,
  purchasePlanId,
  model,
  isPurchasingPlanCompetitiveOfferPage = false,
}: GoodsServicesModalHookProps) => {
  // const { model } = useContext<PurchasingPlanModel>(
  //   PurchasingPlanDetailHookContext
  // );

  const goods = model?.purchaseItems?.map((item) => {
    return {
      goodsId: item.goodsId,
      unitId: item.unitId,
      quantity: isPurchasingPlanCompetitiveOfferPage
        ? item?.quantity
        : item.remainingRequestQuantity,
    };
  });

  const baseFilter: GoodsServicesFilter = useMemo(() => {
    return {
      ...new GoodsServicesFilter(),
      pageIndex: 1,
      pageSize: 10,
      id,
      purchasePlanId: purchasePlanId,
      goods: goods,
      purchasePlanType: isPurchasingPlanCompetitiveOfferPage
        ? TYPE_PURCHASING_PLAN.COMPETITIVE_BIDDING
        : TYPE_PURCHASING_PLAN.DIRECT_CONTACTING,
    };
  }, [id, purchasePlanId]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(GoodsServicesFilter, baseFilter);

  const { list, count, loadingList, handleLoadList } = listService.useList<
    PurchasePlanGoodsServicesModel,
    GoodsServicesFilter
  >(
    purchasingPlanRepository.getGoodServiceGroup,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const {
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    selectedRow,
    setSelectedRow,
  } = listService.useRowSelection<PurchasePlanGoodsServicesModel>(
    "checkbox",
    [],
    false
  );

  const onSave = () => {
    if (callback) {
      const dataFlatten = flattenPurchaseItems(selectedRow);
      dataFlatten?.forEach((row) => {
        selectRowsModal.push({
          ...row,
          purchaseItemId: row?.id,
          id: `${uuidv4()}${childText}`,
        });
      });
      callback(selectRowsModal);
    }
    onCancel();
  };

  const flattenPurchaseItems = (
    data: PurchasePlanGoodsServicesModel[]
  ): PurchasePlanGoodsServicesModel[] => {
    return data?.reduce((acc, item) => {
      if (item?.childrens) {
        return [...acc, ...(item?.childrens ?? [])];
      }
      return [...acc, item];
    }, [] as PurchasePlanGoodsServicesModel[]);
  };

  const onCancel = () => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...new GoodsServicesFilter(),
      },
    });
    setTimeout(() => {
      setModal(false);
    }, 100);
  };

  useEffect(() => {
    handleLoadList({
      ...baseFilter,
    });
  }, [baseFilter, handleLoadList]);

  return {
    dispatchFilter,
    modelFilter,
    list,
    loadingList,
    handleLoadList,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    count,
    onSave,
    onCancel,
    setSelectedRow,
    selectedRow,
  };
};
