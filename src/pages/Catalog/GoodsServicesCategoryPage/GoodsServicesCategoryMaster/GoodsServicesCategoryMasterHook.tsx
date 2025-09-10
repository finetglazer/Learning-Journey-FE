import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import {
  FilterAction,
  GeneralAction,
  GeneralActionEnum,
} from "core/services/service-types";
import {
  GoodsServicesCategory,
  GoodsServicesCategoryFilter,
} from "models/GoodsServicesCategory";
import React, { createContext, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { goodsServicesCategoryRepository } from "../GoodsServicesCategoryRepository";
import { detailService } from "core/services/page-services/detail-service";
import { AxiosError } from "axios";
import { finalize } from "rxjs";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

export interface GoodsServicesCategoryMasterContextModel {
  // for context content master
  modelFilter: GoodsServicesCategoryFilter;
  list: GoodsServicesCategory[];
  count: number;
  loadingList: boolean;
  dispatchFilter: React.Dispatch<FilterAction<GoodsServicesCategoryFilter>>;
  countFilter: number;
  handleLoadList: (filterParam?: GoodsServicesCategoryFilter) => void;
  handleResetList: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notifyToast: any;
  //for context content in detail modal
  detailModel: GoodsServicesCategory;
  dispatchDetailModel: React.Dispatch<GeneralAction<GoodsServicesCategory>>;
  isOpenModal: boolean;
  handleOpenModal: (id?: string) => void;
  handleCreateFromParent: (parentId?: string) => void;
  handleCloseModal: () => void;
  //for delete content
  isOpenModalDelete: boolean;
  handleOpenModalDelete: (model?: GoodsServicesCategory) => void;
  handleCloseModalDelete: () => void;
  handleDelete: () => void;
  //for preview modal
  isOpenPreviewModal: boolean;
  handleOpenPreviewModal: (id?: string) => void;
  handleClosePreviewModal: () => void;
  validAction: (action: string) => boolean;
}
export const GoodsServicesCategoryMasterContext =
  createContext<GoodsServicesCategoryMasterContextModel>({
    // for context content master
    modelFilter: new GoodsServicesCategoryFilter(),
    list: [],
    count: 0,
    loadingList: false,
    dispatchFilter: null,
    countFilter: 0,
    handleLoadList: null,
    handleResetList: null,
    notifyToast: null,
    //for context content in detail modal
    detailModel: new GoodsServicesCategory(),
    dispatchDetailModel: null,
    isOpenModal: false,
    handleOpenModal: null,
    handleCreateFromParent: null,
    handleCloseModal: null,
    //for delete content
    isOpenModalDelete: false,
    handleOpenModalDelete: null,
    handleCloseModalDelete: null,
    handleDelete: null,
    isOpenPreviewModal: false,
    handleOpenPreviewModal: null,
    handleClosePreviewModal: null,
    validAction: null,
  });

const MAX_PAGE_SIZE = 10000;

export function useGoodsServicesCategoryMasterHooks() {
  const [translate] = useTranslation();

  const { notifyToast } = appMessageService.useCRUDMessage();
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_GOODS_SERVICES_CATEGORY
  );

  // Filter
  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      GoodsServicesCategoryFilter,
      {
        ...new GoodsServicesCategoryFilter(),
        pageIndex: 1,
        pageSize: MAX_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: GoodsServicesCategoryFilter = React.useMemo(() => {
    return {
      ...new GoodsServicesCategoryFilter(),
      pageIndex: 1,
      pageSize: MAX_PAGE_SIZE,

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
  } = listService.useList<GoodsServicesCategory, GoodsServicesCategoryFilter>(
    goodsServicesCategoryRepository.getAll,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  React.useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  // for context content value detail

  const { model: detailModel, dispatch: dispatchDetailModel } =
    detailService.useModel<GoodsServicesCategory>(GoodsServicesCategory);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleOpenModal = useCallback(
    (id?: string) => {
      if (!isOpenModal) {
        setIsOpenModal(true);
        if (id) {
          goodsServicesCategoryRepository
            .detail(id)
            .subscribe((res: GoodsServicesCategory) => {
              dispatchDetailModel({
                type: GeneralActionEnum.SET,
                payload: {
                  ...res?.data,
                  parent: {
                    id: res?.parentId,
                    name: res?.parentName,
                  },
                },
              });
            });
        } else {
          dispatchDetailModel({
            type: GeneralActionEnum.SET,
            payload: {
              ...new GoodsServicesCategory(),
              isActive: true,
              color: "#a3c2c2",
            },
          });
        }
      }
    },
    [dispatchDetailModel, isOpenModal]
  );

  const handleCreateFromParent = useCallback(
    (id?: string) => {
      if (!isOpenModal) {
        setIsOpenModal(true);
        if (id) {
          goodsServicesCategoryRepository
            .detail(id)
            .subscribe((res: GoodsServicesCategory) => {
              dispatchDetailModel({
                type: GeneralActionEnum.SET,
                payload: {
                  ...new GoodsServicesCategory(),
                  isActive: true,
                  parentId: res?.data?.id,
                  parent: {
                    id: res?.data?.id,
                    name: res?.data?.name,
                    code: res?.data?.code,
                  },
                },
              });
            });
        } else {
          dispatchDetailModel({
            type: GeneralActionEnum.SET,
            payload: {
              ...new GoodsServicesCategory(),
              isActive: true,
            },
          });
        }
      }
    },
    [dispatchDetailModel, isOpenModal]
  );

  const handleCloseModal = useCallback(() => {
    if (isOpenModal) {
      setIsOpenModal(false);
      dispatchDetailModel({
        type: GeneralActionEnum.SET,
        payload: { ...new GoodsServicesCategory() },
      });
    }
  }, [dispatchDetailModel, isOpenModal]);

  // for modal Delete
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);

  const handleOpenModalDelete = useCallback(
    (model?: GoodsServicesCategory) => {
      if (!isOpenModalDelete) {
        setIsOpenModalDelete(true);
        dispatchDetailModel({
          type: GeneralActionEnum.SET,
          payload: model,
        });
      }
    },
    [dispatchDetailModel, isOpenModalDelete]
  );

  const handleCloseModalDelete = useCallback(() => {
    if (isOpenModalDelete) {
      setIsOpenModalDelete(false);
      dispatchDetailModel({
        type: GeneralActionEnum.SET,
        payload: { ...new GoodsServicesCategory() },
      });
    }
  }, [dispatchDetailModel, isOpenModalDelete]);

  const handleDelete = () => {
    setLoadingList(true);
    goodsServicesCategoryRepository
      .delete(detailModel?.id)
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

  //for preview modal

  const [isOpenPreviewModal, setIsOpenPreviewModal] = useState<boolean>(false);

  const handleOpenPreviewModal = useCallback(
    (id?: string) => {
      if (!isOpenPreviewModal) {
        setIsOpenPreviewModal(true);
        if (id) {
          goodsServicesCategoryRepository
            .detail(id)
            .subscribe((res: GoodsServicesCategory) => {
              dispatchDetailModel({
                type: GeneralActionEnum.SET,
                payload: {
                  ...res?.data,
                  parent: {
                    id: res?.parentId,
                    name: res?.parentName,
                  },
                },
              });
            });
        } else {
          dispatchDetailModel({
            type: GeneralActionEnum.SET,
            payload: {
              ...new GoodsServicesCategory(),
              isActive: true,
              color: "#a3c2c2",
            },
          });
        }
      }
    },
    [dispatchDetailModel, isOpenPreviewModal]
  );
  const handleClosePreviewModal = useCallback(() => {
    if (isOpenPreviewModal) {
      setIsOpenPreviewModal(false);
      dispatchDetailModel({
        type: GeneralActionEnum.SET,
        payload: { ...new GoodsServicesCategory() },
      });
    }
  }, [dispatchDetailModel, isOpenPreviewModal]);

  return {
    // context value:
    // context for value content in master
    dispatchFilter,
    modelFilter,
    countFilter,
    list,
    count,
    loadingList,
    handleResetList,
    handleLoadList,
    notifyToast,
    validAction,
    //for context content in detail modal
    detailModel,
    dispatchDetailModel,
    isOpenModal,
    handleOpenModal,
    handleCreateFromParent,
    handleCloseModal,
    // for delete content
    isOpenModalDelete,
    handleOpenModalDelete,
    handleCloseModalDelete,
    handleDelete,
    //for preview modal
    isOpenPreviewModal,
    handleOpenPreviewModal,
    handleClosePreviewModal,
    // non-context value:
    translate,
  };
}
