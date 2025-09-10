import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { LOCAL_STORAGE_PAYMENT_LIST } from "config/const";
import {
  ACCOUNTING_ENTRY_DETAIL_ROUTE,
  ADVANCE_DETAIL_ROUTE,
  APP_OVERVIEW,
  DEPOSIT_DETAIL_ROUTE,
  EXPENSE_DETAIL_ROUTE,
  PAYMENT_CREATE_ACCOUNTING_ENTRY_ROUTE,
  PAYMENT_CREATE_ADVANCE_ROUTE,
  PAYMENT_CREATE_DEPOSIT_ROUTE,
  PAYMENT_CREATE_EXPENSE_ROUTE,
  PAYMENT_CREATE_ROUTE,
  PAYMENT_REQUEST_DETAIL_ROUTE,
  PAYMENT_ROUTE,
} from "config/route-const";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import {
  FilterAction,
  HttpStatusCode,
  KeyType,
} from "core/services/service-types";
import { isEqual, isNil } from "lodash";
import { AppUser } from "models/AppUser";
import { TYPE_OF_PAYMENT_TYPE, TYPE_OF_PROPOSAL } from "models/Payment";
import { PaymentFilter } from "models/Payment/PaymentFilter";
import { TagFilterList } from "pages/PurchasePage/PurchaseRequestPage/PurchaseRequestMaster/PurchaseRequestMasterHook";
import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { finalize, tap } from "rxjs";
import { ConfirmModalType } from "../../BudgetPage/BudgetMaster/BudgetConfirmModal/BudgetConfirmModal";
import { paymentRepository } from "../PaymentRepository";

export interface ModelSelect {
  type: ConfirmModalType;
  model: AppUser;
  errorMessage?: string;
}

export interface PaymentMaster {
  handleChangeSingleField?: any;
  modelFilter: PaymentFilter;
  list: AppUser[];
  count: number;
  loadingList: boolean;
  tabRepositories: TagFilterList[];
  dispatchFilter: React.Dispatch<FilterAction<PaymentFilter>>;
  countFilter: number;
  handleLoadList: (filterParam?: PaymentFilter) => void;
  handleResetList: () => void;
  rowSelection: TableRowSelection<AppUser>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<KeyType[]>>;
  canBulkAction: boolean;
  notifyToast: any;
  handlePressAdd: (type: keyof typeof TYPE_OF_PAYMENT_TYPE) => void;
  breadcrumb: { name: string; path?: string }[];
  handleOnClickRow: (
    record: AppUser,
    waitingForApproval?: boolean,
    isOpenNewTab?: boolean
  ) => void;
  modelSelected: ModelSelect | null;
  isLoadingModal?: boolean;
  handleApplyButtonInConfirmModal: (model: AppUser, reason: string) => void;
  setModelSelected: React.Dispatch<
    React.SetStateAction<ModelSelect | null>
  > | null;
  handleGoToPaymentEdit: (payment: AppUser) => void;
  handleGoToPaymentClone: (payment: AppUser) => void;
  getLinkClickRow?: (record: AppUser, waitingForApproval?: boolean) => string;
}

export const DEFAULT_MODAL_TYPE = "NONE";

export const PaymentMasterContext = createContext<PaymentMaster>({
  modelFilter: new PaymentFilter(),
  list: [],
  count: 0,
  loadingList: false,
  dispatchFilter: null,
  tabRepositories: [],
  countFilter: 0,
  handleLoadList: null,
  handleResetList: null,
  rowSelection: null,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
  canBulkAction: false,
  notifyToast: null,
  handlePressAdd: null,
  breadcrumb: [],
  handleOnClickRow: null,
  modelSelected: null,
  isLoadingModal: false,
  handleApplyButtonInConfirmModal: null,
  setModelSelected: null,
  handleGoToPaymentEdit: null,
  handleGoToPaymentClone: null,
});

export enum TAB_KEY_ENUM {
  ALL,
  MINE,
  IN_PROGRESS,
  APPROVAL,
}

export function usePaymentMasterHook() {
  const [translate] = useTranslation();
  const { notifyToast } = appMessageService.useCRUDMessage();

  const history = useHistory();
  const breadcrumb = [
    {
      name: translate("CM.menu_title_home"),
      path: APP_OVERVIEW,
    },
    {
      name: translate("CM.menu_title_payment"),
    },
  ];

  const tabRepositories = React.useMemo<TagFilterList[]>(
    () => [
      {
        title: translate("BG.tab_all"),
        value: "0",
      },
      {
        title: translate("BG.tab_mine"),
        value: "1",
      },
      {
        title: translate("PP.tab_inprogress"),
        value: "2",
      },
      {
        title: translate("PP.tab_approval"),
        value: "3",
      },
    ],
    [translate]
  );

  const handlePressAdd = React.useCallback(
    (type: keyof typeof TYPE_OF_PAYMENT_TYPE) => {
      const route = TYPE_OF_PAYMENT_TYPE[type];
      history.push(`${PAYMENT_ROUTE}${route}`);
    },
    [history]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      PaymentFilter,
      {
        ...new PaymentFilter(),
        tab: "0",
        pageIndex: 1,
        pageSize: 10,
      },
      ["orderBy", "orderType", "tab", "search"]
    );

  const getListFromLocalStorage = (): unknown[] => {
    try {
      const savedList = localStorage.getItem(LOCAL_STORAGE_PAYMENT_LIST);
      return savedList ? JSON.parse(savedList) : [];
    } catch (error) {
      return [];
    }
  };

  const baseFilter = React.useMemo(() => {
    return {
      ...new PaymentFilter(),
      tab: modelFilter?.tab,
      pageIndex: 1,
      search: modelFilter?.search,
      pageSize: modelFilter?.pageSize,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<AppUser, PaymentFilter>(
      paymentRepository.listAll,
      baseFilter,
      dispatchFilter,
      getModelFilter,
      {
        list: getListFromLocalStorage(),
        count: 0,
      }
    );

  const { canBulkAction, rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<AppUser>("checkbox", [], false);

  React.useEffect(() => {
    handleLoadList();
  }, [handleLoadList]);

  const getLinkClickRow = (payment: AppUser, waitingForApproval?: boolean) => {
    if (isNil(payment?.paymentGroup)) {
      return;
    }

    const routeMap = {
      [TYPE_OF_PROPOSAL.PAYMENT]: PAYMENT_REQUEST_DETAIL_ROUTE,
      [TYPE_OF_PROPOSAL.ADVANCE]: ADVANCE_DETAIL_ROUTE,
      [TYPE_OF_PROPOSAL.EXPENSE]: EXPENSE_DETAIL_ROUTE,
      [TYPE_OF_PROPOSAL.ACCOUNTING_ENTRY]: ACCOUNTING_ENTRY_DETAIL_ROUTE,
      [TYPE_OF_PROPOSAL.DEPOSIT]: DEPOSIT_DETAIL_ROUTE,
    };

    const route = routeMap[payment?.paymentGroup as keyof typeof routeMap];

    return `${route}/${payment?.id}?isView=${!waitingForApproval}`;
  };

  const handleOnClickRow = (payment: AppUser, waitingForApproval?: boolean) => {
    const href = getLinkClickRow(payment, waitingForApproval);

    if (!href) {
      return;
    }

    const statusPayment = {
      statusPayment: waitingForApproval ? payment?.status : -1,
    };

    history.push(href, statusPayment);
  };

  const handleGoToPaymentEdit = (payment: AppUser) => {
    switch (payment?.paymentGroup) {
      case TYPE_OF_PROPOSAL.PAYMENT:
        return history.push(`${PAYMENT_CREATE_ROUTE}/${payment?.id}`);
      case TYPE_OF_PROPOSAL.ADVANCE:
        return history.push(`${PAYMENT_CREATE_ADVANCE_ROUTE}/${payment?.id}`);
      case TYPE_OF_PROPOSAL.EXPENSE:
        return history.push(`${PAYMENT_CREATE_EXPENSE_ROUTE}/${payment?.id}`);
      case TYPE_OF_PROPOSAL.ACCOUNTING_ENTRY:
        return history.push(
          `${PAYMENT_CREATE_ACCOUNTING_ENTRY_ROUTE}/${payment?.id}`
        );
      case TYPE_OF_PROPOSAL.DEPOSIT:
        return history.push(`${PAYMENT_CREATE_DEPOSIT_ROUTE}/${payment?.id}`);
      default:
        break;
    }
  };

  const [modelSelected, setModelSelected] = React.useState<ModelSelect | null>(
    null
  );
  const handleHideModal = () => {
    notifyToast();
    setModelSelected(null);
    handleLoadList();
  };
  const handleUpdatePaymentError = (error: AxiosError) => {
    if (isEqual(error.response?.status, HttpStatusCode.BAD_REQUEST)) {
      const type = error?.response?.data?.type;
      const VALIDATE = "Validate";
      if (isEqual(type, VALIDATE)) {
        setModelSelected((previousState) => ({
          ...previousState,
          errorMessage: error?.response?.data?.errors["reason"],
        }));
      } else {
        notifyToast({
          type: "error",
          message: error?.response?.data?.message,
        });
      }
    }
  };
  // Delete single payment
  const deletePayment = (id: string, reason: string) => {
    paymentRepository
      .deletePayment(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdatePaymentError,
      });
  };
  // Cancel payment request
  const cancelPayment = (id: string, reason: string) => {
    paymentRepository
      .cancelPayment(id, reason)
      .pipe(
        tap(() => setLoadingModal(true)),
        finalize(() => setLoadingModal(false))
      )
      .subscribe({
        next: handleHideModal,
        error: handleUpdatePaymentError,
      });
  };
  const [isLoadingModal, setLoadingModal] = React.useState<boolean>(false);

  const handleApplyButtonInConfirmModal = (model: AppUser, reason: string) => {
    switch (modelSelected?.type) {
      case ConfirmModalType.CANCEL:
        cancelPayment(model?.id?.toString(), reason);
        return;
      case ConfirmModalType.DELETE:
        deletePayment(model?.id?.toString(), reason);
        return;
    }
  };

  const handleGoToPaymentClone = (payment: AppUser) => {
    switch (payment?.paymentGroup) {
      case TYPE_OF_PROPOSAL.PAYMENT:
        return history.push(PAYMENT_CREATE_ROUTE, { idClone: payment?.id });
      case TYPE_OF_PROPOSAL.ADVANCE:
        return history.push(PAYMENT_CREATE_ADVANCE_ROUTE, {
          idClone: payment?.id,
        });
      case TYPE_OF_PROPOSAL.EXPENSE:
        return history.push(PAYMENT_CREATE_EXPENSE_ROUTE, {
          idClone: payment?.id,
        });
      case TYPE_OF_PROPOSAL.ACCOUNTING_ENTRY:
        return history.push(PAYMENT_CREATE_ACCOUNTING_ENTRY_ROUTE, {
          idClone: payment?.id,
        });
      case TYPE_OF_PROPOSAL.DEPOSIT:
        return history.push(PAYMENT_CREATE_DEPOSIT_ROUTE, {
          idClone: payment?.id,
        });
      default:
        break;
    }
  };

  return {
    // context value:
    dispatchFilter,
    modelFilter,
    countFilter,
    list,
    count,
    loadingList,
    handleResetList,
    handleLoadList,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    breadcrumb,
    tabRepositories,
    handlePressAdd,
    handleOnClickRow,
    notifyToast,
    modelSelected,
    setModelSelected,
    isLoadingModal,
    handleApplyButtonInConfirmModal,
    handleGoToPaymentEdit,
    handleGoToPaymentClone,
    getLinkClickRow,

    // non-context value:
    translate,
  };
}
