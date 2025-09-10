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
} from "models/PurchasingPlan";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import { PurchasingPlanPrincipleDetailHookContext } from "pages/PurchasePage/PurchasingPlanPrinciplePage/PurchasingPlanPrincipleDetail/PurchasingPlanPrincipleDetailHook";
import { TYPE_PURCHASING_PLAN } from "models/PurchasingPlan/PurchasingPlanConstant";

interface GoodsServicesModalHookProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  callback?: (data: PurchasePlanGoodsServicesModel[]) => void;
  id: string;
  selectedKeys: string[];
  selectRowsModal?: PurchasePlanGoodsServicesModel[];
  purchasePlanId?: string;
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
}: GoodsServicesModalHookProps) => {
  const { model } = useContext<PurchasingPlanModel>(
    PurchasingPlanPrincipleDetailHookContext
  );

  const goods = model?.purchaseItems?.map((item) => {
    return {
      goodsId: item.goodsId,
      unitId: item.unitId,
      quantity: item.remainingRequestQuantity,
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
      purchasePlanType: TYPE_PURCHASING_PLAN.FROM_CONTRACT_PRINCIPLE,
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
        const existingIndex = selectRowsModal?.findIndex(
          (item) => item?.id === row?.id
        );
        if (existingIndex !== -1) {
          const renderId = selectRowsModal?.[existingIndex]?.renderId;

          const indexRow = parseInt(renderId?.split("@")?.[1]) + 1;

          selectRowsModal.push({
            ...row,
            renderId: `${row?.id}@${indexRow}`,
          });
        } else {
          selectRowsModal.push({ ...row, renderId: `${row?.id}@0` });
        }
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
