import { AxiosError } from "axios";
import { COST_LINE_COST_ITEM_DETAIL_ROUTE } from "config/route-const";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, GeneralActionEnum } from "core/services/service-types";
import { CostLineCostItem } from "models/CostLineCostItem";
import { CostLineCostItemFilter } from "models/CostLineCostItem/CostLineCostItemFilter";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize } from "rxjs";
import { costLineCostItemRepository } from "../CostLineCostItemRepository";
import { detailService } from "core/services/page-services/detail-service";
import { Key, TableRowSelection } from "antd/lib/table/interface";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

export interface CostLineCostItemMasterContextModel {
  // for context content master
  modelFilter: CostLineCostItemFilter;
  list: CostLineCostItem[];
  count: number;
  loadingList: boolean;
  dispatchFilter: React.Dispatch<FilterAction<CostLineCostItemFilter>>;
  countFilter: number;
  rowSelection: TableRowSelection<CostLineCostItem>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[] | Key[]>>;
  handleLoadList: (filterParam?: CostLineCostItemFilter) => void;
  handleResetList: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notifyToast: any;
  handleGoDetail: (id?: string) => void;
  //for delete content
  isOpenModalDelete: boolean;
  handleOpenModalDelete: (model?: CostLineCostItem) => void;
  deleteType: "Single" | "Bulk";
  handleCloseModalDelete: () => void;
  handleDelete: () => void;
  handleBulkDelete: () => void;
  //for preview modal
  previewModel: CostLineCostItem;
  isOpenModalPreview: boolean;
  handleOpenModalPreview: (id?: string) => void;
  handleCloseModalPreview: () => void;
  validAction: (action: string) => boolean;
}
export const CostLineCostItemMasterContext =
  createContext<CostLineCostItemMasterContextModel>({
    // for context content master
    modelFilter: new CostLineCostItemFilter(),
    list: [],
    count: 0,
    loadingList: false,
    dispatchFilter: null,
    countFilter: 0,
    rowSelection: null,
    selectedRowKeys: null,
    setSelectedRowKeys: null,
    handleLoadList: null,
    handleResetList: null,
    notifyToast: null,
    handleGoDetail: null,
    //for delete content
    isOpenModalDelete: false,
    handleOpenModalDelete: null,
    handleCloseModalDelete: null,
    deleteType: null,
    handleBulkDelete: null,
    handleDelete: null,
    previewModel: null,
    isOpenModalPreview: false,
    handleOpenModalPreview: null,
    handleCloseModalPreview: null,
    validAction: null,
  });

export function useCostLineCostItemMasterHooks() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_COSTLINE_COSTGROUP_CONFIG
  );

  // Filter
  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      CostLineCostItemFilter,
      {
        ...new CostLineCostItemFilter(),
        pageIndex: 1,
        pageSize: 10,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: CostLineCostItemFilter = React.useMemo(() => {
    return {
      ...new CostLineCostItemFilter(),
      pageIndex: 1,
      pageSize: 10,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const {
    list,
    count,
    loadingList,
    setLoadingList,
    handleResetList,
    handleLoadList,
  } = listService.useList<CostLineCostItem, CostLineCostItemFilter>(
    costLineCostItemRepository.getAll,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  React.useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  const handleGoDetail = React.useCallback(
    (id?: string) => {
      if (id) {
        history.push(COST_LINE_COST_ITEM_DETAIL_ROUTE + `/${id}`);
      } else history.push(COST_LINE_COST_ITEM_DETAIL_ROUTE);
    },
    [history]
  );

  // for modal Delete

  const { model: detailModel, dispatch: dispatchDetailModel } =
    detailService.useModel<CostLineCostItem>(CostLineCostItem);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);

  const [deleteType, setDeleteType] = React.useState<"Bulk" | "Single">(
    "Single"
  );

  const handleOpenModalDelete = useCallback(
    (model?: CostLineCostItem) => {
      if (!isOpenModalDelete) {
        setIsOpenModalDelete(true);
        if (model?.id) {
          dispatchDetailModel({
            type: GeneralActionEnum.SET,
            payload: model,
          });
          setDeleteType("Single");
        } else {
          setDeleteType("Bulk");
        }
      }
    },
    [dispatchDetailModel, isOpenModalDelete]
  );

  const handleCloseModalDelete = useCallback(() => {
    if (isOpenModalDelete) {
      setIsOpenModalDelete(false);
      dispatchDetailModel({
        type: GeneralActionEnum.SET,
        payload: { ...new CostLineCostItem() },
      });
    }
  }, [dispatchDetailModel, isOpenModalDelete]);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<CostLineCostItem>("checkbox", [], true);

  const handleDelete = () => {
    setLoadingList(true);
    costLineCostItemRepository
      .delete([...[], detailModel?.id])
      .pipe(finalize(() => setLoadingList(false)))
      .subscribe({
        next: () => {
          setIsOpenModalDelete(false);
          handleLoadList();
          notifyToast({
            message: translate("CM.updateSuccess"),
            placement: "topRight",
          });
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
          setIsOpenModalDelete(false);
        },
      });
  };

  const handleBulkDelete = () => {
    setLoadingList(true);
    const ids = selectedRowKeys?.map((item) => item?.toString());
    costLineCostItemRepository
      .delete(ids)
      .pipe(finalize(() => setLoadingList(false)))
      .subscribe({
        next: () => {
          setIsOpenModalDelete(false);
          setSelectedRowKeys([]);
          handleLoadList();
          notifyToast({
            message: translate("CM.updateSuccess"),
            placement: "topRight",
          });
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });
          setIsOpenModalDelete(false);
        },
      });
  };

  const [isOpenModalPreview, setIsOpenModalPreview] = useState<boolean>(false);

  const handleOpenModalPreview = useCallback(
    (id?: string) => {
      if (id) {
        costLineCostItemRepository
          .detail(id)
          .subscribe((res: CostLineCostItem) => {
            dispatchDetailModel({
              type: GeneralActionEnum.SET,
              payload: {
                ...res?.data,
              },
            });
          });
      } else {
        dispatchDetailModel({
          type: GeneralActionEnum.SET,
          payload: {
            ...new CostLineCostItem(),
            isActive: true,
          },
        });
      }
      if (!isOpenModalPreview) {
        setIsOpenModalPreview(true);
      }
    },
    [dispatchDetailModel, isOpenModalPreview]
  );

  const handleCloseModalPreview = useCallback(() => {
    if (isOpenModalPreview) {
      setIsOpenModalPreview(false);
      dispatchDetailModel({
        type: GeneralActionEnum.SET,
        payload: { ...new CostLineCostItem() },
      });
    }
  }, [dispatchDetailModel, isOpenModalPreview]);

  return {
    // context value:
    // context for value content in master
    dispatchFilter,
    modelFilter,
    countFilter,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    list,
    count,
    loadingList,
    handleResetList,
    handleLoadList,
    notifyToast,
    handleGoDetail,
    validAction,
    // for delete content
    isOpenModalDelete,
    handleOpenModalDelete,
    deleteType,
    handleCloseModalDelete,
    handleDelete,
    handleBulkDelete,
    //for preview modal
    previewModel: detailModel,
    isOpenModalPreview,
    handleOpenModalPreview,
    handleCloseModalPreview,
    // non-context value:
    translate,
  };
}
