import { ContractAnnex } from "models/ContractAnnex";
import { createContext, useContext } from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

export interface ContractPrincipleAppendixViewType {
  model: ContractAnnex;
  handleDownloadFileAttached?: (file?: FileModel) => void;
}

const INITIAL_CONTEXT: ContractPrincipleAppendixViewType = {
  model: null,
};

const ContractPrincipleAppendixViewContext =
  createContext<ContractPrincipleAppendixViewType>(INITIAL_CONTEXT);

const useContractPrincipleAppendixViewContext = () => {
  const context = useContext(ContractPrincipleAppendixViewContext);

  return context;
};

export {
  ContractPrincipleAppendixViewContext,
  useContractPrincipleAppendixViewContext,
};
