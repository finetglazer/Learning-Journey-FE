import { TableRowSelection } from "antd/lib/table/interface";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import {
  FilterAction,
  FilterActionEnum,
  KeyType,
} from "core/services/service-types";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import {
  contactDetailInListModel,
  ContractSettlementFilter,
} from "models/Settlement";
import { isEqual } from "lodash";
import { contactDetailInListTerminationModel } from "models/ContractTermination";
import { contractTerminationRepository } from "pages/PurchasePage/ContractTerminationPage/ContractTerminationRepository";
import { settlementRepository } from "pages/SettlementPage/SettlementRepository";

export interface ModalHooksProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  callback?: (data: contactDetailInListModel) => void;
  selectedKey?: string;
  isShowModel?: boolean;
  title?: string;
  pageUsed?: PAGE_USED;
}

export interface Modal {
  list: contactDetailInListModel[];
  modelFilter: ContractSettlementFilter;
  count: number;
  loadingList: boolean;
  dispatchFilter: Dispatch<FilterAction<ContractSettlementFilter>>;
  handleLoadList: (filterParams?: ContractSettlementFilter) => void;
  handleResetList: () => void;
  rowSelection: TableRowSelection<contactDetailInListModel>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  error?: any;
}

export enum PAGE_USED {
  CONTRACT_SETTLEMENT = "CONTRACT_SETTLEMENT",
  CONTRACT_TERMINATION = "CONTRACT_TERMINATION",
}

export const ModalContext = createContext<Modal>({
  list: [],
  modelFilter: null,
  count: 0,
  loadingList: false,
  dispatchFilter: null,
  handleLoadList: null,
  handleResetList: null,
  rowSelection: undefined,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
});

export const useModalHooks = ({
  setModal,
  callback,
  selectedKey,
  pageUsed,
}: ModalHooksProps) => {
  const [translate] = useTranslation();

  const baseFilter: ContractSettlementFilter = useMemo(() => {
    return {
      ...new ContractSettlementFilter(),
      pageIndex: 1,
      pageSize: 10,
    };
  }, []);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(ContractSettlementFilter, baseFilter);

  const { list, count, loadingList, handleResetList, handleLoadList, error } =
    isEqual(pageUsed, PAGE_USED.CONTRACT_TERMINATION)
      ? listService.useList<
          contactDetailInListTerminationModel,
          ContractSettlementFilter
        >(
          contractTerminationRepository.getContractTermination,
          baseFilter,
          dispatchFilter,
          getModelFilter
        )
      : listService.useList<contactDetailInListModel, ContractSettlementFilter>(
          settlementRepository.getContractSettlement,
          baseFilter,
          dispatchFilter,
          getModelFilter
        );

  const {
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    selectedRow,
  } = listService.useRowSelection<contactDetailInListModel>(
    "radio",
    [],
    false,
    "auto"
  );

  const onSave = () => {
    if (callback) {
      const selectedContact = list?.findIndex(
        (item) => item.id === selectedRowKeys[0]
      );
      if (!isEqual(selectedContact, -1)) {
        callback(list[selectedContact] as any);
      } else {
        callback(selectedRow[0]);
      }
    }
    onCancel();
  };

  const onCancel = () => {
    setModal(false);
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...new ContractSettlementFilter(),
      },
    });
  };

  useEffect(() => {
    handleLoadList({
      ...baseFilter,
    });
    selectedKey && setSelectedRowKeys([selectedKey]);
  }, [baseFilter, handleLoadList]);

  return {
    dispatchFilter,
    modelFilter,
    list,
    loadingList,
    handleLoadList,
    handleResetList,
    canBulkAction,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    count,
    translate,
    onSave,
    onCancel,
    error,
  };
};
