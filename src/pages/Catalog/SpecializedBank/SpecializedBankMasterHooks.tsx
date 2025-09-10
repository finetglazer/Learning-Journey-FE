import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { HandleLoadList } from "core/models/Filter/Filter";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, KeyType } from "core/services/service-types";
import { isEmpty } from "lodash";
import { SpecializedBank } from "models/SpecializedBank/SpecializedBank";
import { SpecializedBankFilter } from "models/SpecializedBank/SpecializedBankFilter";
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
import { organizationManagementBaseBreadcrumb } from "../constants";
import specializedBankRepository from "./SpecializedBankRepository";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

export interface ModalType {
  type: "DETAIL" | "CREATE" | "EDIT" | "DELETE" | "NONE";
  id?: string;
}

export interface SpecializedBankHooks {
  modelFilter: SpecializedBankFilter;
  list: SpecializedBank[];
  count: number;
  countFilter: number;
  loadingList: boolean;
  rowSelection: TableRowSelection<SpecializedBank>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  dispatchFilter: Dispatch<FilterAction<SpecializedBankFilter>>;
  handleLoadList: HandleLoadList<SpecializedBankFilter>;
  handleResetList: () => void;
  setModalType?: Dispatch<SetStateAction<ModalType>>;
  validAction?: (action: string) => boolean;
}

export const SpecializedBankContext = createContext<SpecializedBankHooks>({
  modelFilter: new SpecializedBankFilter(),
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
  type: "NONE",
};

export const useSpecializedBankMasterHooks = () => {
  const [translate] = useTranslation();
  const [modalType, setModalType] = useState<ModalType>(INITIAL_MODAL_TYPE);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);

  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_BUSINESS_UNIT
  );

  const { notifyToast } = appMessageService.useCRUDMessage();

  const breadcrumb = useMemo(
    () => [
      ...organizationManagementBaseBreadcrumb,
      {
        name: translate("CM.menu_title_specialized_bank"),
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      SpecializedBankFilter,
      {
        ...new SpecializedBankFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: SpecializedBankFilter = useMemo(() => {
    return {
      ...new SpecializedBankFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<SpecializedBank, SpecializedBankFilter>(
      specializedBankRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<SpecializedBank>("checkbox", [], true);

  const handleDeleteRecord = () => {
    setLoadingModal(true);
    let ids = [];
    if (!isEmpty(modalType?.id)) {
      ids = [modalType.id];
    } else {
      ids = selectedRowKeys as string[];
    }

    specializedBankRepository
      .delete(ids)
      .pipe(finalize(() => setLoadingModal(false)))
      .subscribe({
        next: () => {
          setModalType({ type: "NONE", id: undefined });
          setSelectedRowKeys([]);
          handleLoadList();
          notifyToast();
        },
        error: (error: AxiosError) => {
          notifyToast({
            message: error.response?.data?.message,
            type: "error",
          });

          setModalType({ type: "NONE", id: undefined });
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
