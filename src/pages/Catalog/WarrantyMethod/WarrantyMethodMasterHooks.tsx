import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { MENU_CODE } from "config/const";
import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { HandleLoadList } from "core/models/Filter/Filter";
import appMessageService from "core/services/common-services/app-message-service";
import { authorizationService } from "core/services/common-services/authorization-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, KeyType } from "core/services/service-types";
import { isEmpty } from "lodash";
import { WarrantyMethod } from "models/WarrantyMethod/WarrantyMethod";
import { WarrantyMethodFilter } from "models/WarrantyMethod/WarrantyMethodFilter";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Model } from "react-3layer-common";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { contractManagementBreadcrumb } from "../constants";
import warrantyMethodRepository from "./WarrantyMethodRepository";

export enum ConfirmModalType {
  EDIT = "EDIT",
  DELETE = "DELETE",
  DETAIL = "DETAIL",
  CREATE = "CREATE",
  NONE = "NONE",
}

export interface ModalType {
  type: ConfirmModalType;
  id?: string;
}

export class WarrantyMethodModel extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public description?: string;
  public isActive?: boolean;
  public isUsed?: boolean;
}

export interface WarrantyMethodHooks {
  modelFilter: WarrantyMethodFilter;
  list: WarrantyMethod[];
  count: number;
  countFilter: number;
  loadingList: boolean;
  rowSelection: TableRowSelection<WarrantyMethod>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  dispatchFilter: Dispatch<FilterAction<WarrantyMethodFilter>>;
  handleLoadList: HandleLoadList<WarrantyMethodFilter>;
  handleResetList: () => void;
  setModalType?: Dispatch<SetStateAction<ModalType>>;
  validAction: (action: string) => boolean;
}

export const WarrantyMethodContext = createContext<WarrantyMethodHooks>({
  modelFilter: new WarrantyMethodFilter(),
  list: [],
  count: numberConstants.ZERO,
  countFilter: numberConstants.ZERO,
  loadingList: false,
  rowSelection: undefined,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
  dispatchFilter: null,
  handleLoadList: null,
  handleResetList: null,
  validAction: null,
});

const INITIAL_MODAL_TYPE: ModalType = {
  type: ConfirmModalType.NONE,
};

export const useWarrantyMethodMasterHook = () => {
  const [translate] = useTranslation();
  const [modalType, setModalType] = useState<ModalType>(INITIAL_MODAL_TYPE);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_WARRANTY_METHOD
  );
  const { notifyToast } = appMessageService.useCRUDMessage();

  const breadcrumb = useMemo(
    () => [
      ...contractManagementBreadcrumb,
      {
        name: translate("CM.menu_title_catalog_warranty_method"),
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      WarrantyMethodFilter,
      {
        ...new WarrantyMethodFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: WarrantyMethodFilter = useMemo(() => {
    return {
      ...new WarrantyMethodFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<WarrantyMethod, WarrantyMethodFilter>(
      warrantyMethodRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<WarrantyMethod>("checkbox", [], true);

  const handleDeleteRecord = () => {
    setLoadingModal(true);
    let ids = [];
    if (!isEmpty(modalType?.id)) {
      ids = [modalType.id];
    } else {
      ids = selectedRowKeys as string[];
    }

    warrantyMethodRepository
      .delete(ids)
      .pipe(finalize(() => setLoadingModal(false)))
      .subscribe({
        next: () => {
          setModalType({ type: ConfirmModalType.NONE, id: undefined });
          setSelectedRowKeys([]);
          handleLoadList();
          notifyToast();
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });

          setModalType({ type: ConfirmModalType.NONE, id: undefined });
        },
      });
  };

  useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  return {
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
    loadingList,
    setModalType,
    validAction,
    // non-context
    translate,
    breadcrumb,
    modalType,
    handleDeleteRecord,
    isLoadingModal,
  };
};
