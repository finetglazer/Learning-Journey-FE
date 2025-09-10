import { TableRowSelection } from "antd/lib/table/interface";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import {
  FilterAction,
  FilterActionEnum,
  KeyType,
} from "core/services/service-types";
import { isEmpty } from "lodash";
import { GoodsServices, GoodsServicesFilter } from "models/PurchaseRequest";
import { purchaseRequestRepository } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestRepository";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";

interface GoodsServicesModalHookProps {
  addedGoodsServices: GoodsServices[];
  setModal: Dispatch<SetStateAction<boolean>>;
  callback?: (data: GoodsServices[]) => void;
  id: string;
}

export interface GoodsServicesModal {
  list: GoodsServices[];
  modelFilter: GoodsServicesFilter;
  count: number;
  loadingList: boolean;
  dispatchFilter: Dispatch<FilterAction<GoodsServicesFilter>>;
  handleLoadList: (filterParams?: GoodsServicesFilter) => void;
  rowSelection: TableRowSelection<GoodsServices>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
}

export const GoodsServicesModalContext = createContext<GoodsServicesModal>({
  list: [],
  modelFilter: null,
  count: 0,
  loadingList: false,
  dispatchFilter: null,
  handleLoadList: null,
  rowSelection: undefined,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
});

export const useGoodsServicesModalHooks = ({
  setModal,
  callback,
  addedGoodsServices,
  id,
}: GoodsServicesModalHookProps) => {
  const baseFilter: GoodsServicesFilter = useMemo(() => {
    return {
      ...new GoodsServicesFilter(),
      pageIndex: 1,
      pageSize: 10,
      id,
    };
  }, [id]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(GoodsServicesFilter, baseFilter);

  const { list, count, loadingList, handleLoadList } = listService.useList<
    GoodsServices,
    GoodsServicesFilter
  >(
    purchaseRequestRepository.listGoodsServices,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  const { rowSelection, selectedRowKeys, selectedRow, setSelectedRowKeys } =
    listService.useRowSelection<GoodsServices>("checkbox", [], false);

  useEffect(() => {
    if (!isEmpty(addedGoodsServices)) {
      setSelectedRowKeys(addedGoodsServices.map((item) => item.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedGoodsServices]);

  const onSave = () => {
    const data = selectedRow?.map((item) => ({
      ...item,
      quantity: item?.remainingRequestQuantity,
      branch: item?.manufacturer,
    }));
    callback(data);
    onCancel();
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
  };
};
