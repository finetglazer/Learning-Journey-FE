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
  PaymentCondition,
  PaymentConditionFilter,
} from "models/PaymentCondition";

import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { HandleLoadList } from "core/models/Filter/Filter";
import { goodsManagementBreadcrumb } from "pages/Catalog/constants";
import paymentConditionRepository from "../PaymentConditionRepository";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

export interface PaymentConditionContextProps {
  loadingList: boolean;
  list: PaymentCondition[];
  count: number;
  countFilter: number;
  modelFilter: PaymentConditionFilter;
  rowSelection: TableRowSelection<PaymentCondition>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  dispatchFilter: Dispatch<FilterAction<PaymentConditionFilter>>;
  handleLoadList: HandleLoadList<PaymentConditionFilter>;
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

export const PaymentConditionContext =
  createContext<PaymentConditionContextProps>({
    loadingList: false,
    list: [],
    count: numberConstants.ZERO,
    countFilter: numberConstants.ZERO,
    modelFilter: new PaymentConditionFilter(),
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

export const usePaymentConditionMasterHook = () => {
  const [translate] = useTranslation();
  const [modalType, setModalType] = useState(INITIAL_MODAL_TYPE);
  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_PAYMENT_CONDITION
  );

  const { notifyToast } = appMessageService.useCRUDMessage();
  const handleAddNew = () => setModalType({ type: "CREATE" });
  const handleCloseModal = () => setModalType({ type: "NONE", id: undefined });

  const breadcrumb = useMemo(
    () => [
      ...goodsManagementBreadcrumb,
      {
        name: translate("CM.menu_title_payment_condition"),
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      PaymentConditionFilter,
      {
        ...new PaymentConditionFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: PaymentConditionFilter = useMemo(() => {
    return {
      ...new PaymentConditionFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<PaymentCondition, PaymentConditionFilter>(
      paymentConditionRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<PaymentCondition>("checkbox", [], true);

  const handleDeleteRecord = () => {
    setLoadingModal(true);
    let ids = [];
    if (!isEmpty(modalType?.id)) {
      ids = [modalType.id];
    } else {
      ids = selectedRowKeys as string[];
    }

    paymentConditionRepository
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
