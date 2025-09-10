import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { APP_OVERVIEW, COMMERCIAL_TERMS_ROUTE } from "config/route-const";
import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { HandleLoadList } from "core/models/Filter/Filter";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, KeyType } from "core/services/service-types";
import { isEmpty } from "lodash";
import { CommercialTerms } from "models/CommercialTerms/CommercialTerms";
import { CommercialTermsFilter } from "models/CommercialTerms/CommercialTermsFilter";
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
import commercialTermsRepository from "./CommercialTermsRepository";

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

export class CommercialTermsModel extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public description?: string;
  public isActive?: boolean;
  public isUsed?: boolean;
}

export interface CommercialTermsHooks {
  modelFilter: CommercialTermsFilter;
  list: CommercialTerms[];
  count: number;
  countFilter: number;
  loadingList: boolean;
  rowSelection: TableRowSelection<CommercialTerms>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  dispatchFilter: Dispatch<FilterAction<CommercialTermsFilter>>;
  handleLoadList: HandleLoadList<CommercialTermsFilter>;
  handleResetList: () => void;
  setModalType?: Dispatch<SetStateAction<ModalType>>;
}

export const CommercialTermsContext = createContext<CommercialTermsHooks>({
  modelFilter: new CommercialTermsFilter(),
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
});

const INITIAL_MODAL_TYPE: ModalType = {
  type: ConfirmModalType.NONE,
};

export const useCommercialTermsMasterHook = () => {
  const [translate] = useTranslation();
  const [modalType, setModalType] = useState<ModalType>(INITIAL_MODAL_TYPE);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);

  const { notifyToast } = appMessageService.useCRUDMessage();

  const breadcrumb = useMemo(
    () => [
      {
        name: translate("CM.menu_title_home"),
        path: APP_OVERVIEW,
      },
      {
        name: translate("CM.menu_title_catalog"),
        path: APP_OVERVIEW,
      },
      {
        name: translate("CM.menu_title_catalog_commercial_terms"),
        path: COMMERCIAL_TERMS_ROUTE,
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      CommercialTermsFilter,
      {
        ...new CommercialTermsFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: CommercialTermsFilter = useMemo(() => {
    return {
      ...new CommercialTermsFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<CommercialTerms, CommercialTermsFilter>(
      commercialTermsRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<CommercialTerms>("checkbox", [], true);

  const handleDeleteRecord = () => {
    setLoadingModal(true);
    let ids = [];
    if (!isEmpty(modalType?.id)) {
      ids = [modalType.id];
    } else {
      ids = selectedRowKeys as string[];
    }

    commercialTermsRepository
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
    // non-context
    translate,
    breadcrumb,
    modalType,
    handleDeleteRecord,
    isLoadingModal,
  };
};
