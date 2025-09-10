import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { isEmpty, lte } from "lodash";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";

import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, KeyType } from "core/services/service-types";

import {
  CentralPurchaseUnit,
  CentralPurchaseUnitFilter,
} from "models/CentralPurchaseUnit";

import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { HandleLoadList } from "core/models/Filter/Filter";
import { organizationManagementBaseBreadcrumb } from "pages/Catalog/constants";
import centralPurchaseUnitRepository from "../CentralPurchaseUnitRepository";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

export interface CentralPurchaseUnitContextProps {
  loadingList: boolean;
  list: CentralPurchaseUnit[];
  count: number;
  countFilter: number;
  modelFilter: CentralPurchaseUnitFilter;
  rowSelection: TableRowSelection<CentralPurchaseUnit>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  dispatchFilter: Dispatch<FilterAction<CentralPurchaseUnitFilter>>;
  handleLoadList: HandleLoadList<CentralPurchaseUnitFilter>;
  handleResetList: () => void;
  setModalType?: Dispatch<SetStateAction<ModalType>>;
  handleAddNew: () => void;
  handleCloseModal: () => void;
  validAction: (action: string) => boolean;
}

export interface ModalType {
  type: "DETAIL" | "CREATE" | "EDIT" | "DELETE" | "NONE";
  id?: string;
}

export const CentralPurchaseUnitContext =
  createContext<CentralPurchaseUnitContextProps>({
    loadingList: false,
    list: [],
    count: numberConstants.ZERO,
    countFilter: numberConstants.ZERO,
    modelFilter: new CentralPurchaseUnitFilter(),
    rowSelection: undefined,
    selectedRowKeys: [],
    setSelectedRowKeys: null,
    dispatchFilter: null,
    handleLoadList: null,
    handleResetList: null,
    setModalType: null,
    handleAddNew: null,
    handleCloseModal: null,
    validAction: null,
  });

const INITIAL_MODAL_TYPE: ModalType = {
  type: "NONE",
};

export const useCentralPurchaseUnitMasterHook = () => {
  const [translate] = useTranslation();
  const [modalType, setModalType] = useState(INITIAL_MODAL_TYPE);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_CENTRALIZED_PURCHASING_UNIT
  );

  const { notifyToast } = appMessageService.useCRUDMessage();
  const handleAddNew = () => setModalType({ type: "CREATE" });
  const handleCloseModal = () => setModalType({ type: "NONE", id: undefined });

  const breadcrumb = useMemo(
    () => [
      ...organizationManagementBaseBreadcrumb,
      {
        name: translate("CM.menu_title_central_purchase_unit"),
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      CentralPurchaseUnitFilter,
      {
        ...new CentralPurchaseUnitFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: CentralPurchaseUnitFilter = useMemo(() => {
    return {
      ...new CentralPurchaseUnitFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<CentralPurchaseUnit, CentralPurchaseUnitFilter>(
      centralPurchaseUnitRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<CentralPurchaseUnit>("checkbox", [], true);

  const handleDeleteRecord = () => {
    setLoadingModal(true);
    let ids = [];
    if (!isEmpty(modalType?.id)) {
      ids = [modalType.id];
    } else {
      ids = selectedRowKeys as string[];
    }

    centralPurchaseUnitRepository
      .delete(ids)
      .pipe(finalize(() => setLoadingModal(false)))
      .subscribe({
        next: () => {
          handleCloseModal();
          setSelectedRowKeys([]);
          handleLoadList();
          notifyToast();
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });

          handleCloseModal();
        },
      });
  };

  const isEmptyData = () =>
    isEmpty(modelFilter?.search) &&
    isEmpty(list) &&
    lte(countFilter, numberConstants.ZERO);

  useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  return {
    // context value
    loadingList,
    list,
    count,
    countFilter,
    modelFilter,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    setModalType,
    handleAddNew,
    handleCloseModal,
    validAction,
    // non-context value
    translate,
    breadcrumb,
    modalType,
    isLoadingModal,
    handleDeleteRecord,
    isEmptyData,
  };
};
