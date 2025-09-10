import {
  SUPPLIER_DETAIL_ROUTE,
  SUPPLIER_MASTER_ROUTE,
} from "config/route-const";
import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { Supplier } from "models/Supplier/Supplier";
import { SupplierFilter } from "models/Supplier/SupplierFilter";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { supplierManagementBreadcrumb } from "../constants";
import supplierRepository from "./SupplierRepository";
import { useHistory } from "react-router";
import {
  masterService,
  RepoState,
} from "core/services/page-services/master-service";
import { SupplierdraftTab } from "./SupplierMasterTabs/SupplierDraftTabs/SupplierDraftTab";
import { SupplierApprovalMasterTab } from "./SupplierMasterTabs/SupplierApproval/SupplierApprovalMaster/SupplierApprovalMaster";
import { AxiosError } from "axios";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

export const useSupplierMasterHooks = () => {
  const [translate] = useTranslation();

  appMessageService.useCRUDMessage();

  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_MANAGE_SUPPLIER
  );

  const tabRepositories = useMemo<RepoState[]>(() => {
    return [
      {
        tabKey: "0",
        tabTitle: translate("SL.list"),
        children: <SupplierdraftTab />,
        list: supplierRepository.getAll,
      },
      {
        tabKey: "1",
        tabTitle: translate("SL.listAwaitingApprove"),
        children: <SupplierApprovalMasterTab />,
        list: supplierRepository.getAll,
      },
      {
        tabKey: "2",
        tabTitle: translate("SL.listAwaitingApprove"),
        children: <SupplierApprovalMasterTab />,
        list: supplierRepository.getAll,
      },
    ];
  }, [translate]);

  const breadcrumb = useMemo(() => {
    return [
      ...supplierManagementBreadcrumb,
      {
        name: translate("CM.menu_title_supplier"),
        path: SUPPLIER_MASTER_ROUTE,
      },
    ];
  }, [translate]);

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      SupplierFilter,
      {
        ...new SupplierFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search", "tabKey"]
    );

  const baseFilter: SupplierFilter = useMemo(() => {
    return {
      ...new SupplierFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const { repo, handleChangeTab } = masterService.useTabRepository(
    tabRepositories,
    dispatchFilter
  );

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<Supplier, SupplierFilter>(
      repo.list,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<Supplier>("checkbox", [], true);

  useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  const history = useHistory();

  const handleGoDetail = useCallback(
    (id?: string) => {
      if (id) {
        history.push(SUPPLIER_DETAIL_ROUTE + `/${id}`);
      } else history.push(SUPPLIER_DETAIL_ROUTE);
    },
    [history]
  );

  const [visibleAccountModal, setVisibleAccountModal] =
    useState<boolean>(false);

  const [currentId, setCurrentId] = useState<string>(null);

  const [actionWithAccount, setActionWithAccount] = useState<
    "CREATE" | "RECOVER"
  >("CREATE");

  const handleOpenAccountModal = useCallback(
    (id: string, action: "CREATE" | "RECOVER") => {
      setCurrentId(id);
      setActionWithAccount(action);
      setVisibleAccountModal(true);
    },
    []
  );

  const { notifyToast } = appMessageService.useCRUDMessage();

  const handleCreateAccountModal = useCallback(() => {
    supplierRepository.createSupplierAccount(currentId).subscribe(
      (res) => {
        notifyToast({
          message: translate("CM.updateSuccess"),
        });
        setVisibleAccountModal(false);
        handleLoadList();
      },
      (error: AxiosError) => {
        notifyToast({
          message: error.response?.data?.message,
          type: "error",
        });
        setVisibleAccountModal(false);
      }
    );
  }, [currentId, handleLoadList, notifyToast, translate]);

  const handleRecoverAccount = useCallback(() => {
    supplierRepository.recoverAccount(currentId).subscribe(
      (res) => {
        notifyToast({
          message: translate("CM.updateSuccess"),
        });
        setVisibleAccountModal(false);
        handleLoadList();
      },
      (error: AxiosError) => {
        notifyToast({
          message: error.response?.data?.message,
          type: "error",
        });
        setVisibleAccountModal(false);
      }
    );
  }, [currentId, handleLoadList, notifyToast, translate]);

  const handleCloseAccountModal = useCallback(() => {
    setCurrentId(null);
    setVisibleAccountModal(false);
  }, []);

  return {
    list,
    count,
    countFilter,
    loadingList,
    modelFilter,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleGoDetail,
    actionWithAccount,
    handleSaveAccountModal:
      actionWithAccount === "CREATE"
        ? handleCreateAccountModal
        : handleRecoverAccount,
    visibleAccountModal,
    handleCloseAccountModal,
    handleOpenAccountModal,
    currentId,
    validAction,

    // non-context
    translate,
    breadcrumb,
    tabRepositories,
    handleChangeTab,
    repo,
  };
};
