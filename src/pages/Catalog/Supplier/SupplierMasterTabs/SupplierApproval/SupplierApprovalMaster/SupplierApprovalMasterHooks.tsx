import { AxiosError } from "axios";
import { MENU_CODE } from "config/const";
import { APP_OVERVIEW, SUPPLIER_MASTER_ROUTE } from "config/route-const";
import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { ErrorType } from "core/helpers/handle-error";
import { HandleLoadList } from "core/models/Filter/Filter";
import appMessageService from "core/services/common-services/app-message-service";
import { authorizationService } from "core/services/common-services/authorization-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import {
  tabServices,
  TabState,
} from "core/services/page-services/tab-services";
import { FilterAction, HttpStatusCode } from "core/services/service-types";
import { isEmpty, isEqual } from "lodash";
import { Supplier } from "models/Supplier/Supplier";
import { SupplierFilter } from "models/Supplier/SupplierFilter";
import supplierRepository from "pages/Catalog/Supplier/SupplierRepository";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";

interface SupplierModalType {
  type: "APPROVE" | "REJECT" | "NONE";
  id?: string;
  errorMessage?: string;
}

export interface SupplierApprovalMaster {
  modelFilter: SupplierFilter;
  list: Supplier[];
  count: number;
  countFilter: number;
  loadingList: boolean;
  dispatchFilter: Dispatch<FilterAction<SupplierFilter>>;
  handleLoadList: HandleLoadList<SupplierFilter>;
  handleResetList: () => void;
  handleChangeTab: (activeTabKey: string) => void;
  setModal?: Dispatch<SetStateAction<boolean>>;
  tabItems?: TabState[];
  setModalType?: Dispatch<SetStateAction<SupplierModalType>>;
  validAction: (action: string) => boolean;
}

export const SupplierApprovalMasterContext =
  createContext<SupplierApprovalMaster>({
    modelFilter: new SupplierFilter(),
    list: [],
    count: numberConstants.ZERO,
    countFilter: numberConstants.ZERO,
    loadingList: false,
    dispatchFilter: null,
    handleChangeTab: null,
    handleLoadList: null,
    handleResetList: null,
    validAction: null,
  });

export const useSupplierApprovalMasterHooks = () => {
  const [translate] = useTranslation();
  const [modalType, setModalType] = useState<SupplierModalType>({
    type: "NONE",
  });
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const supplierApprovalIdSelected = useRef<string | null>(null);
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_MANAGE_SUPPLIER
  );
  const { notifyToast } = appMessageService.useCRUDMessage();

  const breadcrumb = useMemo(
    () => [
      {
        name: translate("Menu.home"),
        path: APP_OVERVIEW,
      },
      {
        name: translate("Menu.supplierApproval"),
        path: SUPPLIER_MASTER_ROUTE,
      },
    ],
    [translate]
  );

  const tabItems = useMemo<TabState[]>(() => {
    return [
      {
        value: numberConstants?.ONE.toString(),
        title: translate("SL.txt_all"),
      },
      {
        value: numberConstants?.TWO.toString(),
        title: translate("SL.txt_waiting_approve"),
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

  const { repo, handleChangeTab } = tabServices.useTabAction(
    tabItems,
    dispatchFilter
  );

  const baseFilter: SupplierFilter = useMemo(() => {
    return {
      ...new SupplierFilter(),
      tabKey: repo.value,
      pageIndex: modelFilter?.pageIndex || numberConstants.ONE,
      pageSize: modelFilter?.pageSize || DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
    };
  }, [
    modelFilter?.pageIndex,
    modelFilter?.pageSize,
    modelFilter?.search,
    repo.value,
  ]);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<Supplier, SupplierFilter>(
      supplierRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const handleErrors = (error: AxiosError) => {
    if (isEqual(error.response.status, HttpStatusCode.BAD_REQUEST)) {
      const data = error?.response.data;
      const { type, message, errors } = data;

      switch (type) {
        case ErrorType.VALIDATE:
          setModalType((previousState) => ({
            ...previousState,
            errorMessage: errors?.reason,
          }));
          break;
        case ErrorType.BAD_REQUEST:
          notifyToast({
            type: "error",
            message,
          });
          break;

        default:
          break;
      }
    }
  };

  const handleReject = (reason: string | null) => {
    if (isEmpty(modalType?.id)) return;
    setLoadingModal(true);
    supplierRepository
      .reject({ reason: reason || "", id: modalType.id })
      .pipe(finalize(() => setLoadingModal(false)))
      .subscribe({
        next: () => {
          setModalType({
            type: "NONE",
            id: undefined,
            errorMessage: undefined,
          });
          notifyToast();
          handleResetList();
        },
        error: handleErrors,
      });
  };

  useEffect(() => {
    handleLoadList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repo?.value]);

  return {
    list,
    count,
    countFilter,
    loadingList,
    modelFilter,
    handleLoadList,
    handleResetList,
    dispatchFilter,
    handleChangeTab,
    tabItems,
    setModalType,
    validAction,
    // non-context
    supplierApprovalIdSelected: supplierApprovalIdSelected.current,
    translate,
    breadcrumb,
    modalType,
    handleReject,
    loadingModal,
  };
};
