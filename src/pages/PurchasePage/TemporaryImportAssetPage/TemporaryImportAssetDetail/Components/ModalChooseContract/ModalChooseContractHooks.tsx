import { TableRowSelection } from "antd/lib/table/interface";
import { filterService } from "core/services/page-services/filter-service";
import { listService } from "core/services/page-services/list-service";
import {
  FilterAction,
  FilterActionEnum,
  KeyType,
} from "core/services/service-types";
import { ContractTempReceiptFilter } from "models/Contract";
import { ContractTempReceiptModel } from "models/TemporaryImportAsset/TemporaryImportAsset";
import { temporaryImportAssetRepository } from "pages/PurchasePage/TemporaryImportAssetPage/TemporaryImportAssetRepository";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";

interface ContractModalHooksProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  callback?: (data: ContractTempReceiptModel) => void;
  selectedKey?: ContractTempReceiptModel;
  contractId?: string;
}

export interface ContractModal {
  list: ContractTempReceiptModel[];
  modelFilter: ContractTempReceiptFilter;
  count: number;
  loadingList: boolean;
  dispatchFilter: Dispatch<FilterAction<ContractTempReceiptFilter>>;
  handleLoadList: (filterParams?: ContractTempReceiptFilter) => void;
  handleResetList: () => void;
  rowSelection: TableRowSelection<ContractTempReceiptModel>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
}

export const ContractModalContext = createContext<ContractModal>({
  list: [],
  modelFilter: null,
  count: 0,
  loadingList: false,
  dispatchFilter: null,
  handleLoadList: null,
  handleResetList: null,
  rowSelection: null,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
});

export const useChooseContractModalHooks = ({
  setModal,
  callback,
  selectedKey,
  contractId,
}: ContractModalHooksProps) => {
  const [translate] = useTranslation();
  const baseFilter: ContractTempReceiptFilter = useMemo(() => {
    return {
      ...new ContractTempReceiptFilter(),
      pageIndex: 1,
      pageSize: 10,
      contractId: contractId,
    };
  }, [contractId]);

  const { modelFilter, dispatchFilter, getModelFilter } =
    filterService.useModelFilter(ContractTempReceiptFilter, baseFilter);

  const { list, count, loadingList, handleResetList, handleLoadList } =
    listService.useList<ContractTempReceiptModel, ContractTempReceiptFilter>(
      temporaryImportAssetRepository.getContractTempReceipt,
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
  } = listService.useRowSelection<ContractTempReceiptModel>(
    "radio",
    [],
    false,
    "auto"
  );

  const onCancel = () => {
    dispatchFilter({
      type: FilterActionEnum.SET,
      payload: {
        ...new ContractTempReceiptFilter(),
      },
    });
    setTimeout(() => {
      setModal(false);
    }, 100);
  };

  const onSave = () => {
    if (callback) callback(selectedRow[0]);
    onCancel();
  };

  useEffect(() => {
    handleLoadList({
      ...baseFilter,
    });
    contractId && setSelectedRowKeys([contractId]);
  }, [baseFilter, handleLoadList, selectedKey]);

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
  };
};
