import { TableRowSelection } from "antd/lib/table/interface";
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

import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction, KeyType } from "core/services/service-types";

import {
  UseElectronicInvoice,
  UseElectronicInvoiceFilter,
} from "models/UseElectronicInvoice";

import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { HandleLoadList } from "core/models/Filter/Filter";
import { othersManagementBreadcrumb } from "pages/Catalog/constants";
import useElectronicInvoiceRepository from "../UseElectronicInvoiceRepository";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

export interface UseElectronicInvoiceContextProps {
  loadingList: boolean;
  list: UseElectronicInvoice[];
  count: number;
  countFilter: number;
  calculatedFilterCount: number;
  modelFilter: UseElectronicInvoiceFilter;
  rowSelection: TableRowSelection<UseElectronicInvoice>;
  selectedRowKeys: KeyType[];
  selectedElectronicInvoiceIds: string[];
  isOpenDetailDrawer?: boolean;
  invoiceDetailId: string;
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  dispatchFilter: Dispatch<FilterAction<UseElectronicInvoiceFilter>>;
  handleLoadList: HandleLoadList<UseElectronicInvoiceFilter>;
  handleResetList: () => void;
  setElectronicInvoiceId?: Dispatch<SetStateAction<string>>;
  handleCloseModal: () => void;
  handleChangeSingleSubstitute: (id: string) => void;
  navigateToDetail: (id: string) => void;
  handleDisplayChangeSubstituteModal: () => void;
  handleCloseDetailDrawer: () => void;
  validAction: (action: string) => boolean;
}

export const UseElectronicInvoiceContext =
  createContext<UseElectronicInvoiceContextProps>({
    loadingList: false,
    list: [],
    count: numberConstants.ZERO,
    countFilter: numberConstants.ZERO,
    calculatedFilterCount: numberConstants.ZERO,
    modelFilter: new UseElectronicInvoiceFilter(),
    rowSelection: undefined,
    isOpenDetailDrawer: false,
    invoiceDetailId: "",
    selectedRowKeys: [],
    selectedElectronicInvoiceIds: [],
    setSelectedRowKeys: null,
    dispatchFilter: null,
    handleLoadList: null,
    handleResetList: null,
    handleCloseModal: null,
    handleChangeSingleSubstitute: null,
    navigateToDetail: null,
    handleDisplayChangeSubstituteModal: null,
    handleCloseDetailDrawer: null,
    validAction: null,
  });

export const useUseElectronicInvoiceMasterHook = () => {
  const [translate] = useTranslation();
  const [electronicInvoiceId, setElectronicInvoiceId] = useState<string>("");
  const [hasChangeSubstitute, setHasChangeSubstitute] = useState(false);
  const [isOpenDetailDrawer, setIsOpenDetailDrawer] = useState(false);
  const [invoiceDetailId, setInvoiceDetailId] = useState("");
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_INVOICE
  );
  const breadcrumb = useMemo(
    () => [
      ...othersManagementBreadcrumb,
      {
        name: translate("CM.menu_title_use_electronic_invoice"),
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      UseElectronicInvoiceFilter,
      {
        ...new UseElectronicInvoiceFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search"]
    );

  const calculatedFilterCount = useMemo(() => {
    let count = countFilter;
    if (
      modelFilter?.totalAmountFrom?.equal &&
      modelFilter?.totalAmountTo?.equal
    ) {
      count -= 1;
    }

    return count;
  }, [
    countFilter,
    modelFilter?.totalAmountFrom?.equal,
    modelFilter?.totalAmountTo?.equal,
  ]);

  const baseFilter: UseElectronicInvoiceFilter = useMemo(() => {
    return {
      ...new UseElectronicInvoiceFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: modelFilter?.pageSize,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<UseElectronicInvoice, UseElectronicInvoiceFilter>(
      useElectronicInvoiceRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<UseElectronicInvoice>(
      "checkbox",
      [],
      true,
      "manual",
      true
    );

  const handleCloseModal = () => {
    setHasChangeSubstitute(false);
    setElectronicInvoiceId("");
    setSelectedRowKeys([]);
  };

  const handleChangeSingleSubstitute = (id: string) => {
    handleDisplayChangeSubstituteModal();
    setElectronicInvoiceId(id);
  };

  const handleDisplayChangeSubstituteModal = () => {
    setHasChangeSubstitute(true);
  };

  const navigateToDetail = (id: string) => {
    setIsOpenDetailDrawer(true);
    setInvoiceDetailId(id);
  };

  const handleCloseDetailDrawer = () => {
    setIsOpenDetailDrawer(false);
    setInvoiceDetailId("");
  };

  const selectedElectronicInvoiceIds = electronicInvoiceId
    ? [electronicInvoiceId]
    : ([...selectedRowKeys] as string[]);

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
    calculatedFilterCount,
    modelFilter,
    rowSelection,
    selectedRowKeys,
    selectedElectronicInvoiceIds,
    hasChangeSubstitute,
    electronicInvoiceId,
    isOpenDetailDrawer,
    invoiceDetailId,
    setSelectedRowKeys,
    dispatchFilter,
    handleLoadList,
    handleResetList,
    handleCloseModal,
    handleChangeSingleSubstitute,
    navigateToDetail,
    setElectronicInvoiceId,
    handleDisplayChangeSubstituteModal,
    handleCloseDetailDrawer,
    validAction,
    // non-context value
    translate,
    breadcrumb,
    isEmptyData,
  };
};
