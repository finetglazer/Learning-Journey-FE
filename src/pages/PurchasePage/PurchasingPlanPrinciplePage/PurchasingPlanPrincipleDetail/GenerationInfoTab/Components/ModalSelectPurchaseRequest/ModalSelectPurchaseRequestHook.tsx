import { TableRowSelection } from "antd/lib/table/interface";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import {
  FilterAction,
  FilterActionEnum,
  KeyType,
} from "core/services/service-types";
import { PurchasingSelectModalFilter } from "models/PurchasingPlan/Filter";
import {
  PurchasePlanTypeRouter,
  PurchaseProposalModel,
} from "models/PurchasingPlan/PurchasingPlan";
import { purchasingPlanRepository } from "pages/PurchasePage/PurchasingPlanPage/PurchasingPlanRepository";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
  TYPE_PURCHASING_PLAN,
  TYPE_PURCHASING_PLAN_OPTIONS,
} from "models/PurchasingPlan/PurchasingPlanConstant";
import { useHistory } from "react-router";

interface ProposalModalHooksProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  callback?: (data: PurchaseProposalModel) => void;
  selectedKey?: string;
  isPurchaseRequestAdjustment?: boolean;
  purchasePlanId?: string;
}

export interface ProposalModal {
  list: PurchaseProposalModel[];
  modelFilter: PurchasingSelectModalFilter;
  count: number;
  loadingList: boolean;
  dispatchFilter: Dispatch<FilterAction<PurchasingSelectModalFilter>>;
  handleLoadList: (filterParams?: PurchasingSelectModalFilter) => void;
  handleResetList: () => void;
  rowSelection: TableRowSelection<PurchaseProposalModel>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
}

export const ProposalModalContext = createContext<ProposalModal>({
  list: [],
  modelFilter: null,
  count: 0,
  loadingList: false,
  dispatchFilter: null,
  handleLoadList: null,
  handleResetList: null,
  rowSelection: undefined,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
});

export const useProposalModalHooks = ({
  setModal,
  callback,
  selectedKey,
  isPurchaseRequestAdjustment,
  purchasePlanId,
}: ProposalModalHooksProps) => {
  const [translate] = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);

  const getPurchasePlanTypeByRouter = useCallback(
    (id?: TYPE_PURCHASING_PLAN) => {
      let itemPurchasePlanType = TYPE_PURCHASING_PLAN_OPTIONS.find(
        (el) => el.pathEdit === history.location.pathname
      );

      if (id) {
        itemPurchasePlanType = TYPE_PURCHASING_PLAN_OPTIONS.find(
          (el) => el.id === id
        );
      }

      return new PurchasePlanTypeRouter(itemPurchasePlanType);
    },
    [history.location.pathname]
  );

  const baseFilter: PurchasingSelectModalFilter = useMemo(() => {
    return {
      ...new PurchasingSelectModalFilter(),
      pageIndex: 1,
      pageSize: 10,
      purchasePlanType: getPurchasePlanTypeByRouter().id,
      isPurchaseRequestAdjustment,
      purchasePlanId,
    };
  }, [
    getPurchasePlanTypeByRouter,
    isPurchaseRequestAdjustment,
    purchasePlanId,
  ]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(PurchasingSelectModalFilter, baseFilter);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<PurchaseProposalModel, PurchasingSelectModalFilter>(
      purchasingPlanRepository.getProposalPurchase,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const listExceptSelectedKey = useMemo(() => {
    return list.filter((item) => item.id !== selectedKey);
  }, [list, selectedKey]);

  const {
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    selectedRow,
  } = listService.useRowSelection<PurchaseProposalModel>(
    "radio",
    [],
    false,
    "auto"
  );

  const onSave = () => {
    if (callback) callback(selectedRow[0]);
    onCancel();
  };

  const onCancel = () => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...new PurchasingSelectModalFilter(),
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
    selectedKey && setSelectedRowKeys([selectedKey]);
  }, [baseFilter, handleLoadList]);

  return {
    dispatchFilter,
    modelFilter,
    list: listExceptSelectedKey,
    loadingList,
    handleLoadList,
    handleResetList,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    count,
    translate,
    onSave,
    onCancel,
    loading,
  };
};
