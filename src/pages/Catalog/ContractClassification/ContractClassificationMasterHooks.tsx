import { TableRowSelection } from "antd/lib/table/interface";
import { AxiosError } from "axios";
import { DEFAULT_PAGE_SIZE, numberConstants } from "core/config/consts";
import { HandleLoadList } from "core/models/Filter/Filter";
import appMessageService from "core/services/common-services/app-message-service";
import { listService } from "core/services/page-services/list-service";
import { queryStringService } from "core/services/page-services/query-string-service";
import { FilterAction } from "core/services/service-types";
import { isEqual, isNil } from "lodash";
import { ContractClassification } from "models/ContractClassification/ContractClassification";
import { ContractClassificationFilter } from "models/ContractClassification/ContractClassificationFilter";
import {
  createContext,
  Dispatch,
  Key,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { finalize } from "rxjs";
import { contractManagementBreadcrumb } from "../constants";
import { contractClassificationRepository } from "./ContractClassificationRepository";
import { authorizationService } from "core/services/common-services/authorization-service";
import { MENU_CODE } from "config/const";

export enum ContractClassificationModal {
  "DETAIL",
  "CREATE",
  "DELETE",
  "EDIT",
}

export interface ContractClassificationMaster {
  modelFilter: ContractClassificationFilter;
  list: ContractClassification[];
  count: number;
  countFilter: number;
  loadingList: boolean;
  rowSelection: TableRowSelection<ContractClassification>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<Key[]>>;
  dispatchFilter: Dispatch<FilterAction<ContractClassificationFilter>>;
  handleLoadList: HandleLoadList<ContractClassificationFilter>;
  handleResetList: () => void;
  setModal?: Dispatch<SetStateAction<boolean>>;
  handleActionContractClassification?: (params: {
    modal: ContractClassificationModal;
    id?: string;
  }) => void;
  validAction: (action: string) => boolean;
}

export const ContractClassificationMasterContext =
  createContext<ContractClassificationMaster>({
    modelFilter: new ContractClassificationFilter(),
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
    handleActionContractClassification: null,
    validAction: null,
  });

export const useContractClassificationMasterHooks = () => {
  const [translate] = useTranslation();
  const contractClassificationIdSelected = useRef<string | null>(null);
  const [modal, setModal] = useState<ContractClassificationModal | null>(null);
  const { notifyToast } = appMessageService.useCRUDMessage();
  const { validAction } = authorizationService.useAuthorizedAction(
    MENU_CODE.CATALOG_CONTRACT_TYPE
  );
  const breadcrumb = useMemo(
    () => [
      ...contractManagementBreadcrumb,
      {
        name: translate("CM.menu_title_contract_classification"),
      },
    ],
    [translate]
  );

  const [modelFilter, dispatchFilter, countFilter, getModelFilter] =
    queryStringService.useQueryString(
      ContractClassificationFilter,
      {
        ...new ContractClassificationFilter(),
        pageIndex: numberConstants.ONE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
      ["orderBy", "orderType", "search"]
    );

  const baseFilter: ContractClassificationFilter = useMemo(() => {
    return {
      ...new ContractClassificationFilter(),
      pageIndex: numberConstants.ONE,
      pageSize: DEFAULT_PAGE_SIZE,
      search: modelFilter?.search,
    };
  }, [modelFilter]);

  const { list, count, loadingList, handleLoadList, handleResetList } =
    listService.useList<ContractClassification, ContractClassificationFilter>(
      contractClassificationRepository.getAll,
      baseFilter,
      dispatchFilter,
      getModelFilter
    );

  const handleActionContractClassification = useCallback(
    ({ modal, id }: { modal: ContractClassificationModal; id?: string }) => {
      contractClassificationIdSelected.current = id;
      setModal(modal);
    },
    []
  );

  const handleCloseModal = useCallback(
    (shouldReloadList?: boolean) => {
      contractClassificationIdSelected.current = null;
      setModal(null);

      if (isEqual(shouldReloadList, true)) {
        handleLoadList();
      }
    },
    [handleLoadList]
  );

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<ContractClassification>("checkbox", [], true);

  const [isLoadingModal, setLoadingModal] = useState<boolean>(false);

  const handleDeleteRecord = () => {
    setLoadingModal(true);
    const id = contractClassificationIdSelected.current;
    let ids = [];
    if (isNil(id)) {
      ids = selectedRowKeys as string[];
    } else {
      ids = [id];
    }

    contractClassificationRepository
      .delete(ids)
      .pipe(finalize(() => setLoadingModal(false)))
      .subscribe({
        next: () => {
          handleCloseModal();
          setSelectedRowKeys([]);
          handleLoadList();
          notifyToast({
            type: "success",
            message: translate("CM.txt_update_success"),
          });
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

  useEffect(() => {
    handleLoadList();
  }, []);

  return {
    list,
    count,
    countFilter,
    loadingList,
    modelFilter,
    handleLoadList,
    handleResetList,
    dispatchFilter,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleActionContractClassification,
    validAction,
    // non-context
    handleCloseModal,
    handleDeleteRecord,
    isLoadingModal,
    contractClassificationIdSelected: contractClassificationIdSelected.current,
    translate,
    breadcrumb,
    modal,
    setModal,
  };
};
