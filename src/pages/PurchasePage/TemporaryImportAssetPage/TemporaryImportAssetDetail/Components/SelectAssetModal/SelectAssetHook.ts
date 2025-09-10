import {
  createContext,
  Dispatch,
  Key,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isEmpty, isEqual } from "lodash";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import type { AxiosResponse } from "axios";

import appMessageService from "core/services/common-services/app-message-service";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import { FilterAction, FilterActionEnum } from "core/services/service-types";

import { assetRepository } from "./SelectAssetRepository";
import { SelectAsset } from "models/TemporaryImportAsset/SelectAsset";
import { DEFAULT_PAGE_SIZE, numberConstant } from "core/config/consts";

export const HEIGHT_EMPTY = 500;

export const ICON_SIZE = 14;

export type Modal = "ADD_ASSET" | "NONE";

export interface ModalType {
  type: Modal;
  id?: string;
}
export interface Item {
  id: string;
  code: string;
  value: string;
  businessUnitId?: string;
}

export interface BodyDataProps {
  assetCode?: string;
  ids?: string[];
}

export interface ResponseProps {
  code: string;
  name: string;
}

interface AssetModalHooksProps {
  setModal: Dispatch<SetStateAction<ModalType>>;
  callback?: (list: SelectAsset[]) => void;
  idIgnores: string[];
  contractId: string;
}

export interface ColumnsAssetsProps {
  id: string;

  // mã tài sản
  assetCode: string;

  // hàng hoá dịch vụ
  goodServiceName: string;

  // mã hàng hoá dịch vụ
  goodServiceCode: string;

  // diễn giải hàng hoá dịch vụ
  contractGoodsItemDescription: string;

  // giá trị tạm nhập
  amount: number;

  // phân loại
  classify: string;

  // số tháng khấu hao
  depreciationMonths: string;

  // ngày đưa vào sử dụng
  usageStartDate: string;

  // mã phiếu nghiệm thu
  goodReceiptCode: string;

  // mã phiếu nhận hàng
  acceptanceCode: string;

  // đơn vị nhận và đứng tên
  recipientUnitName: string;

  // người nhận
  receiptPerson: string;

  // hãng, chủng loại
  branchName: string;

  // ghi chú hàng hoá dịch vụ
  contractGoodsItemNote: string;

  // ghi chú nhận hàng
  goodsReceiptRequestItemNote: string;

  // id hàng hoá dịch vụ
  goodsId: string;
}

export interface AssetBudget {
  list: SelectAsset[];
  modelFilter: SelectAsset;
  count: number;
  loadingList: boolean;
  dispatchFilter: Dispatch<FilterAction<SelectAsset>>;
  handleLoadList: (filterParams?: SelectAsset) => void;
  handleResetList: () => void;
  rowSelection: TableRowSelection<SelectAsset>;
  selectedRowKeys: Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<Key[]>>;
}

export const AssetTableContext = createContext<AssetBudget>({
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

export const useAssetTableHook = ({
  idIgnores,
  callback,
  setModal,
  contractId,
}: AssetModalHooksProps) => {
  const [translate] = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const { notifyToast } = appMessageService.useCRUDMessage();

  const onCancel = () => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...new SelectAsset(),
      },
    });
    setSelectedRowKeys([]);
    setModal({ type: "NONE" });
  };

  const handleApply = () => {
    setLoading(true);
    assetRepository
      .getSelected(selectedRowKeys as unknown as string[], contractId)
      .pipe(
        finalize(() => {
          setLoading(false);
        })
      )
      .subscribe({
        next: (response: AxiosResponse) => {
          if (isEqual(response.status, 200)) {
            if (callback)
              callback(formatDataSelectAsset(response?.data?.items));
            onCancel();
          }
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
        },
      });
  };

  const baseFilter: SelectAsset = useMemo(() => {
    return {
      ...new SelectAsset(),
      pageIndex: numberConstant.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
      idIgnores,
      contractId,
    };
  }, [idIgnores, contractId]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(SelectAsset, baseFilter);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<SelectAsset, SelectAsset>(
      assetRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { canBulkAction, rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<SelectAsset>("checkbox", [], true) as {
      canBulkAction: boolean;
      rowSelection: TableRowSelection<SelectAsset>;
      selectedRowKeys: Key[];
      setSelectedRowKeys: React.Dispatch<React.SetStateAction<Key[]>>;
    };

  useEffect(() => {
    handleLoadList({
      ...baseFilter,
    });
  }, [baseFilter, handleLoadList]);

  return {
    loading,
    modelFilter,
    list,
    loadingList,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    count,
    translate,
    onCancel,
    handleApply,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    setSelectedRowKeys,
  };
};

export const convertData = (data: SelectAsset) => {
  if (!data) return [];
  return Object.values(
    data?.reduce((acc: { [key: string]: SelectAsset }, item: SelectAsset) => {
      const categoryId = item?.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          id: categoryId,
          renderId: categoryId,
          classify: item?.classify,
          categoryName: item?.categoryName,
          children: [],
        };
      }
      acc[categoryId].children.push(item);
      return acc;
    }, {})
  );
};

export const formatDataSelectAsset = (data: SelectAsset) => {
  if (isEmpty(data)) return [];

  return data?.map((item: SelectAsset) => formatItem(item));
};

const formatItem = (item: SelectAsset) => {
  return {
    id: item?.id,
    categoryId: item?.goodsReceiptRequestAsset?.category?.id,
    categoryName: item?.goodsReceiptRequestAsset?.category?.name,
    assetCode: item?.goodsReceiptRequestAsset?.asset?.code,
    assetName: item?.goodsReceiptRequestAsset?.asset?.name,
    goodServiceName:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem?.contractGoodsItem
        ?.name,
    goodServiceCode:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem?.contractGoodsItem
        ?.code,
    goodServiceId:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem?.contractGoodsItem
        ?.id,
    contractGoodsItemDescription:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem?.contractGoodsItem
        ?.description,
    amount: item?.amount,
    quantity: item?.goodsReceiptRequestAsset?.quantity,
    classify: item?.classify,
    depreciationMonths: item?.depreciationMonths,
    originNo: item?.goodsReceiptRequestAsset?.originNo,
    serialNumber: item?.goodsReceiptRequestAsset?.serialNumber,
    usageStartDate: item?.goodsReceiptRequestAsset?.usageStartDate,
    goodReceiptCode:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
        ?.goodsReceiptRequest?.code,
    goodReceiptId:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
        ?.goodsReceiptRequest?.id,
    acceptanceCode:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
        ?.goodsReceiptRequest?.acceptance?.code,
    acceptanceId:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
        ?.goodsReceiptRequest?.acceptance?.id,
    recipientUnitName:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
        ?.goodsReceiptRequest?.recipientUnitName,
    receiptPerson:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
        ?.goodsReceiptRequest?.receiptPerson,
    receiptPersonEmail:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem
        ?.goodsReceiptRequest?.receiptPersonEmail,
    branchName:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem?.contractGoodsItem
        ?.branch?.name,
    contractGoodsItemNote:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem?.contractGoodsItem
        ?.note,
    goodsReceiptRequestItemNote:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem?.note,
    goodsReceiptRequestAssetId: item?.goodsReceiptRequestAssetId,
    goodsId:
      item?.goodsReceiptRequestAsset?.goodsReceiptRequestItem?.contractGoodsItem
        ?.goodsId,
  };
};
