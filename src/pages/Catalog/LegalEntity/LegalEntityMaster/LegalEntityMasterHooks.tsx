import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import {
  LEGAL_ENTITY_ROUTE_DETAIL,
  LEGAL_ENTITY_ROUTE_VIEW,
} from "config/route-const";
import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { HandleLoadList } from "core/models/Filter/Filter";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, KeyType } from "core/services/service-types";
import { isEmpty, isEqual } from "lodash";
import { LegalEntityFilter } from "models/LegalEntity/LegalEntityFilter";
import React, {
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
// eslint-disable-next-line import/no-unresolved
import { FileAttachments } from "components/Comment/Comment.model";
import { openNewTab } from "core/helpers/query";
import { contractManagementBreadcrumb } from "pages/Catalog/constants";
import { useHistory } from "react-router";
import legalEntityRepository from "../LegalEntityRepository";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

export enum ConfirmModalType {
  EDIT = "EDIT",
  DELETE = "DELETE",
  DETAIL = "DETAIL",
  CREATE = "CREATE",
  NONE = "NONE",
  VIEW_FROM_MASTER = "VFM",
}

export interface ModalType {
  type: ConfirmModalType;
  id?: string;
}

export class Organization {
  public id?: string;
  public code?: string;
  public name?: string;
  public parentId?: string | null;
  public parentName?: string | null;
  public parentIds?: string[];
  public isActive?: boolean;
  public address?: string;
  public email?: string | null;
  public phone?: string;
  public taxCode?: string;
  public avatarFileId?: string | null;
  public avatarPath?: string | null;
}

export class Position {
  public id?: string;
  public code?: string;
  public name?: string;
  public isActive?: boolean;
}

export class Representative {
  public id?: string;
  public name?: string;
  public code?: string;
  public userName?: string;
  public phoneNumber?: string | null;
  public email?: string;
  public positionId?: string;
  public position?: Position;
}

export class LegalEntityModel extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public isActive?: boolean;
  public isUsed?: boolean;
  public organizationId?: string;
  public organization?: Organization;
  public isDefaultLegalEntity?: boolean;
  public representativeId?: string;
  public representative?: Representative;
  public authorizers?: Authorizers[];
  public isDetail?: boolean;
}

export class Authorizers extends Model {
  public id?: string;
  public code?: string;
  public name?: string;
  public position: string;
  public isActive?: boolean;
  public startTime?: string;
  public endTime?: string;
  public attachmentDocuments?: FileAttachments[];
}

export interface LegalEntityHooks {
  modelFilter: LegalEntityFilter;
  list: LegalEntityModel[];
  count: number;
  countFilter: number;
  loadingList: boolean;
  rowSelection: TableRowSelection<LegalEntityModel>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  dispatchFilter: Dispatch<FilterAction<LegalEntityFilter>>;
  handleLoadList: HandleLoadList<LegalEntityFilter>;
  handleResetList: () => void;
  setModalType?: Dispatch<SetStateAction<ModalType>>;
  handleEdit: (record: LegalEntityModel, type: ConfirmModalType) => void;
  handleView: (record: LegalEntityModel, type: ConfirmModalType) => void;
  handlePressAdd: () => void;
  validAction: (action: string) => boolean;
}

export const LegalEntityContext = createContext<LegalEntityHooks>({
  modelFilter: new LegalEntityFilter(),
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
  handleEdit: null,
  handleView: null,
  handlePressAdd: null,
  validAction: null,
});

const INITIAL_MODAL_TYPE: ModalType = {
  type: ConfirmModalType.NONE,
};

export const useLegalEntityMasterHook = () => {
  const [translate] = useTranslation();
  const [modalType, setModalType] = useState<ModalType>(INITIAL_MODAL_TYPE);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);
  const history = useHistory();
  const { notifyToast } = appMessageService.useCRUDMessage();
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_LEGAL_ENTITY
  );
  const breadcrumb = useMemo(
    () => [
      ...contractManagementBreadcrumb,
      {
        name: translate("CM.menu_title_catalog_legal_entity"),
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      LegalEntityFilter,
      {
        ...new LegalEntityFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: LegalEntityFilter = useMemo(() => {
    return {
      ...new LegalEntityFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<LegalEntityModel, LegalEntityFilter>(
      legalEntityRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<LegalEntityModel>("checkbox", [], true);

  const handlePressAdd = React.useCallback(() => {
    history.push(LEGAL_ENTITY_ROUTE_DETAIL);
  }, [history]);

  const handleEdit = React.useCallback(
    (record: LegalEntityModel, type: ConfirmModalType) => {
      history.push(LEGAL_ENTITY_ROUTE_DETAIL + `/${record.id}`);
    },
    [history]
  );

  const handleView = React.useCallback(
    (record: LegalEntityModel, type: ConfirmModalType) => {
      if (isEqual(type, ConfirmModalType.VIEW_FROM_MASTER)) {
        openNewTab(LEGAL_ENTITY_ROUTE_VIEW, [record?.id]);
        return;
      }
      history.push(LEGAL_ENTITY_ROUTE_VIEW + `/${record.id}`);
    },
    [history]
  );

  const handleDeleteRecord = () => {
    setLoadingModal(true);
    let ids = [];
    if (!isEmpty(modalType?.id)) {
      ids = [modalType.id];
    } else {
      ids = selectedRowKeys as string[];
    }

    legalEntityRepository
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
    handlePressAdd,
    handleEdit,
    handleView,
  };
};
