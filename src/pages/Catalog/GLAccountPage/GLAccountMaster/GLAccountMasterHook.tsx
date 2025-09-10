import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import appMessageService from "core/services/common-services/app-message-service";
import { detailService } from "core/services/page-services/detail-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import {
  FilterAction,
  GeneralAction,
  GeneralActionEnum,
  KeyType,
} from "core/services/service-types";
import { GLAccount } from "models/GLAccount";
import { GLAccountFilter } from "models/GLAccount/GLAccountFilter";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { glAccountRepository } from "../GLAccountRepository";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

export interface GLAccountMasterContextModel {
  // for context content master
  modelFilter: GLAccountFilter;
  list: GLAccount[];
  count: number;
  loadingList: boolean;
  dispatchFilter: React.Dispatch<FilterAction<GLAccountFilter>>;
  countFilter: number;

  rowSelection: TableRowSelection<GLAccount>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;

  handleLoadList: (filterParam?: GLAccountFilter) => void;
  handleResetList: () => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notifyToast: any;
  //for context content in detail modal
  detailModel: GLAccount;
  dispatchDetailModel: React.Dispatch<GeneralAction<GLAccount>>;
  isOpenModal: boolean;
  isOpenPreviewModal: boolean;
  handleOpenModal: (id?: string, type?: "detail" | "preview") => void;
  handleCloseModal: (type: "detail" | "preview") => void;
  //for delete content
  isOpenModalDelete: boolean;
  handleOpenModalDelete: (model?: GLAccount) => void;
  deleteType: "Single" | "Bulk";
  handleCloseModalDelete: () => void;
  handleDelete: () => void;
  handleBulkDelete: () => void;
  validAction: (action: string) => boolean;
}
export const GLAccountMasterContext =
  createContext<GLAccountMasterContextModel>({
    // for context content master
    modelFilter: new GLAccountFilter(),
    list: [],
    count: 0,
    loadingList: false,
    dispatchFilter: null,
    countFilter: 0,
    rowSelection: undefined,
    selectedRowKeys: [],
    setSelectedRowKeys: null,
    handleLoadList: null,
    handleResetList: null,
    notifyToast: null,
    //for context content in detail modal
    detailModel: new GLAccount(),
    dispatchDetailModel: null,
    isOpenModal: false,
    isOpenPreviewModal: false,
    handleOpenModal: null,
    handleCloseModal: null,
    //for delete content
    isOpenModalDelete: false,
    handleOpenModalDelete: null,
    deleteType: null,
    handleCloseModalDelete: null,
    handleDelete: null,
    handleBulkDelete: null,
    validAction: null,
  });

export function useGLAccountMasterHooks() {
  const [translate] = useTranslation();

  const { notifyToast } = appMessageService.useCRUDMessage();
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_GL_ACCOUNT
  );
  // Filter
  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      GLAccountFilter,
      {
        ...new GLAccountFilter(),
        pageIndex: 1,
        pageSize: 10,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: GLAccountFilter = React.useMemo(() => {
    return {
      ...new GLAccountFilter(),
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
  } = listService.useList<GLAccount, GLAccountFilter>(
    glAccountRepository.getAll,
    baseFilter,
    dispatchFilter,
    getModelFilter
  );

  React.useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  // for context content value detail

  const { model: detailModel, dispatch: dispatchDetailModel } =
    detailService.useModel<GLAccount>(GLAccount);

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const [isOpenPreviewModal, setIsOpenPreviewModal] = useState<boolean>(false);

  const handleOpenModal = useCallback(
    (id?: string, type?: "preview" | "detail") => {
      if (id) {
        glAccountRepository.detail(id).subscribe((res: GLAccount) => {
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
            ...new GLAccount(),
            isActive: true,
          },
        });
      }

      if (!isOpenModal && type === "detail") {
        setIsOpenModal(true);
      }
      if (!isOpenPreviewModal && type === "preview") {
        setIsOpenPreviewModal(true);
      }
    },
    [dispatchDetailModel, isOpenModal, isOpenPreviewModal]
  );

  const handleCloseModal = useCallback(
    (type: "preview" | "detail") => {
      if (isOpenModal && type === "detail") {
        setIsOpenModal(false);
        dispatchDetailModel({
          type: GeneralActionEnum.SET,
          payload: { ...new GLAccount() },
        });
      }

      if (isOpenPreviewModal && type === "preview") {
        setIsOpenPreviewModal(false);
        dispatchDetailModel({
          type: GeneralActionEnum.SET,
          payload: { ...new GLAccount() },
        });
      }
    },
    [dispatchDetailModel, isOpenModal, isOpenPreviewModal]
  );

  // for modal Delete
  const [isOpenModalDelete, setIsOpenModalDelete] = useState<boolean>(false);

  const [deleteType, setDeleteType] = React.useState<"Bulk" | "Single">(
    "Single"
  );

  const handleOpenModalDelete = useCallback(
    (model?: GLAccount) => {
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
        payload: { ...new GLAccount() },
      });
    }
  }, [dispatchDetailModel, isOpenModalDelete]);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<GLAccount>("checkbox", [], true);

  const handleDelete = () => {
    setLoadingList(true);
    glAccountRepository
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
    glAccountRepository
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
    list,
    count,
    loadingList,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleResetList,
    handleLoadList,
    notifyToast,
    validAction,
    //for context content in detail modal
    detailModel,
    dispatchDetailModel,
    isOpenModal,
    isOpenPreviewModal,
    handleOpenModal,
    handleCloseModal,
    // for delete content
    isOpenModalDelete,
    handleOpenModalDelete,
    deleteType,
    handleCloseModalDelete,
    handleDelete,
    handleBulkDelete,
    // non-context value:
    translate,
  };
}
