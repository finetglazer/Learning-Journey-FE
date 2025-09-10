import { Key, TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import {
  GOODS_SERVICES_DETAIL_ROUTE,
  GOODS_SERVICES_PREVIEW_ROUTE,
} from "config/route-const";
import { openNewTab } from "core/helpers/query";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, GeneralActionEnum } from "core/services/service-types";
import { GoodsServices } from "models/GoodsServices";
import { GoodsServicesFilter } from "models/GoodsServices/GoodsServicesFilter";
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
import { goodsServicesRepository } from "../GoodsServicesRepository";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

export interface GoodsServicesMasterContextModel {
  // for context content master
  modelFilter: GoodsServicesFilter;
  list: GoodsServices[];
  count: number;
  loadingList: boolean;
  dispatchFilter: React.Dispatch<FilterAction<GoodsServicesFilter>>;
  countFilter: number;
  rowSelection: TableRowSelection<GoodsServices>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[] | Key[]>>;
  handleLoadList: (filterParam?: GoodsServicesFilter) => void;
  handleResetList: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notifyToast: any;
  handleGoDetail: (id?: string) => void;
  handleGoPreview: (id?: string, isOpenNewTab?: boolean) => void;
  //for delete content
  //for delete content
  isOpenModalDelete: boolean;
  handleOpenModalDelete: (model?: GoodsServices) => void;
  deleteType: "Single" | "Bulk";
  handleCloseModalDelete: () => void;
  handleDelete: () => void;
  handleBulkDelete: () => void;
  validAction: (action: string) => boolean;
}
export const GoodsServicesMasterContext =
  createContext<GoodsServicesMasterContextModel>({
    // for context content master
    modelFilter: new GoodsServicesFilter(),
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
    handleGoPreview: null,
    //for delete content
    isOpenModalDelete: false,
    handleOpenModalDelete: null,
    deleteType: null,
    handleCloseModalDelete: null,
    handleDelete: null,
    handleBulkDelete: null,
    validAction: null,
  });

export function useGoodsServicesMasterHooks() {
  const [translate] = useTranslation();
  const history = useHistory();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_GOODS_SERVICE
  );

  // Filter
  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      GoodsServicesFilter,
      {
        ...new GoodsServicesFilter(),
        pageIndex: 1,
        pageSize: 10,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: GoodsServicesFilter = React.useMemo(() => {
    return {
      ...new GoodsServicesFilter(),
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
  } = listService.useList<GoodsServices, GoodsServicesFilter>(
    goodsServicesRepository.getAll,
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
        history.push(GOODS_SERVICES_DETAIL_ROUTE + `/${id}`);
      } else history.push(GOODS_SERVICES_DETAIL_ROUTE);
    },
    [history]
  );

  const handleGoPreview = React.useCallback(
    (id?: string, isOpenNewTab?: boolean) => {
      if (id && isOpenNewTab) {
        openNewTab(GOODS_SERVICES_PREVIEW_ROUTE, [id]);
        return;
      }
      history.push(GOODS_SERVICES_PREVIEW_ROUTE + `/${id}`);
    },
    [history]
  );

  // for modal Delete

  const { model: detailModel, dispatch: dispatchDetailModel } =
    detailService.useModel<GoodsServices>(GoodsServices);
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);

  const [deleteType, setDeleteType] = React.useState<"Bulk" | "Single">(
    "Single"
  );

  const handleOpenModalDelete = useCallback(
    (model?: GoodsServices) => {
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
        payload: { ...new GoodsServices() },
      });
    }
  }, [dispatchDetailModel, isOpenModalDelete]);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<GoodsServices>("checkbox", [], true);

  const handleDelete = () => {
    setLoadingList(true);
    goodsServicesRepository
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
    goodsServicesRepository
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
    handleGoPreview,
    validAction,
    // for delete content
    isOpenModalDelete,
    deleteType,
    handleOpenModalDelete,
    handleCloseModalDelete,
    handleDelete,
    handleBulkDelete,
    // non-context value:
    translate,
  };
}
