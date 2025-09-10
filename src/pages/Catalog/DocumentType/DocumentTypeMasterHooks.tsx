import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { HandleLoadList } from "core/models/Filter/Filter";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, KeyType } from "core/services/service-types";
import { isEmpty } from "lodash";
import { DocumentType } from "models/DocumentType/DocumentType";
import { DocumentTypeFilter } from "models/DocumentType/DocumentTypeFilter";
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
import { othersManagementBreadcrumb } from "../constants";
import documentTypeRepository from "./DocumentTypeRepository";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

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

export class DocumentTypeModel extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public isActive?: boolean;
  public isUsed?: boolean;
}

export interface DocumentTypeHooks {
  modelFilter: DocumentTypeFilter;
  list: DocumentType[];
  count: number;
  countFilter: number;
  loadingList: boolean;
  rowSelection: TableRowSelection<DocumentType>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  dispatchFilter: Dispatch<FilterAction<DocumentTypeFilter>>;
  handleLoadList: HandleLoadList<DocumentTypeFilter>;
  handleResetList: () => void;
  setModalType?: Dispatch<SetStateAction<ModalType>>;
  validAction: (action: string) => boolean;
}

export const DocumentTypeContext = createContext<DocumentTypeHooks>({
  modelFilter: new DocumentTypeFilter(),
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

export const useDocumentTypeMasterHook = () => {
  const [translate] = useTranslation();
  const [modalType, setModalType] = useState<ModalType>(INITIAL_MODAL_TYPE);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_DOCUMENT_TYPE
  );
  const { notifyToast } = appMessageService.useCRUDMessage();

  const breadcrumb = useMemo(
    () => [
      ...othersManagementBreadcrumb,
      {
        name: translate("CM.menu_title_catalog_document_type"),
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      DocumentTypeFilter,
      {
        ...new DocumentTypeFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: DocumentTypeFilter = useMemo(() => {
    return {
      ...new DocumentTypeFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<DocumentType, DocumentTypeFilter>(
      documentTypeRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<DocumentType>("checkbox", [], true);

  const handleDeleteRecord = () => {
    setLoadingModal(true);
    let ids = [];
    if (!isEmpty(modalType?.id)) {
      ids = [modalType.id];
    } else {
      ids = selectedRowKeys as string[];
    }

    documentTypeRepository
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
