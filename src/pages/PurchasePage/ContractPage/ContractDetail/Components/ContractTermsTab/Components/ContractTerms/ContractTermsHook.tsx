import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { TableRowSelection } from "antd/lib/table/interface";

import { listService } from "core/services/page-services/list-service";

import { ContractDetailModel, ContractTerm } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import useTranslationContract from "pages/PurchasePage/ContractPage/useTranslationContract";

export enum ContractTermsModalType {
  Detail = "detail",
  Delete = "delete",
}

export interface ContractTermsContextProps {
  contractTermsModalType: ContractTermsModalType;
  selectedContractTerm: ContractTerm;
  rowSelection: TableRowSelection<ContractTerm>;
  selectedRowKeys: KeyType[];
  setSelectedRowKeys: Dispatch<SetStateAction<KeyType[]>>;
  handleEditContractTerm: (contractTerm: ContractTerm) => void;
  handleConfirmDeleteContractTerm: (contractTerm: ContractTerm) => void;
  handleCloseDeleteModal: () => void;
  handleDeleteContractTerm: () => void;
  handleConfirmBulkDeleteContractTerms: () => void;
  setSelectedContractTerm: Dispatch<SetStateAction<ContractTerm>>;
  setContractTermsModalType: Dispatch<SetStateAction<ContractTermsModalType>>;
}

export const ContractTermsContext = createContext<ContractTermsContextProps>({
  contractTermsModalType: null,
  selectedContractTerm: null,
  rowSelection: null,
  selectedRowKeys: [],
  setSelectedRowKeys: null,
  handleEditContractTerm: null,
  handleConfirmDeleteContractTerm: null,
  handleCloseDeleteModal: null,
  handleDeleteContractTerm: null,
  handleConfirmBulkDeleteContractTerms: null,
  setSelectedContractTerm: null,
  setContractTermsModalType: null,
});

export const useContractTermsHook = () => {
  const [translate] = useTranslationContract();

  const {
    isDetail,
    model: modelMaster,
    handleChangeSingleField: handleChangeSingleFieldMaster,
  } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const { rowSelection, selectedRowKeys, setSelectedRowKeys } =
    listService.useRowSelection<ContractTerm>(
      "checkbox",
      [],
      true,
      "manual",
      true
    );

  const [contractTermsModalType, setContractTermsModalType] =
    useState<ContractTermsModalType>(null);
  const [selectedContractTerm, setSelectedContractTerm] =
    useState<ContractTerm>(null);

  const handleEditContractTerm = (contractTerm: ContractTerm) => {
    setContractTermsModalType(ContractTermsModalType.Detail);
    setSelectedContractTerm(contractTerm);
  };

  const handleConfirmDeleteContractTerm = (contractTerm: ContractTerm) => {
    setContractTermsModalType(ContractTermsModalType.Delete);
    setSelectedContractTerm(contractTerm);
  };

  const handleCloseDeleteModal = () => {
    setContractTermsModalType(null);
    setSelectedContractTerm(null);
  };

  const handleDeleteContractTerm = () => {
    const selectedContractTermIds = selectedContractTerm
      ? [selectedContractTerm?.id]
      : [...selectedRowKeys];

    const newContractTermList = modelMaster?.contractTerms?.filter(
      (item) => !selectedContractTermIds.includes(item?.id)
    );

    handleChangeSingleFieldMaster({
      fieldName: "contractTerms",
    })(newContractTermList);

    handleCloseDeleteModal();
    setSelectedRowKeys([]);
  };

  const handleConfirmBulkDeleteContractTerms = () => {
    setContractTermsModalType(ContractTermsModalType.Delete);
  };

  return {
    isDetail,
    translate,
    modelMaster,

    contractTermsModalType,
    selectedContractTerm,
    rowSelection,
    selectedRowKeys,
    setSelectedRowKeys,
    handleEditContractTerm,
    handleConfirmDeleteContractTerm,
    handleCloseDeleteModal,
    handleDeleteContractTerm,
    handleConfirmBulkDeleteContractTerms,
    setSelectedContractTerm,
    setContractTermsModalType,
  };
};
