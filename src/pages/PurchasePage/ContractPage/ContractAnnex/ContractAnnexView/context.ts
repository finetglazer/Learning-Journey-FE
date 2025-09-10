import { ContractAnnex } from "models/ContractAnnex";
import { createContext, useContext } from "react";
import type { FileModel } from "react-components-design-system/dist/esm/types/components/UploadFile/UploadFile";

export interface ContractAnnexViewContextType {
  model: ContractAnnex;
  handleDownloadFileAttached?: (file?: FileModel) => void;
}

const INITIAL_CONTEXT: ContractAnnexViewContextType = {
  model: null,
};

export const ContractAnnexViewContext =
  createContext<ContractAnnexViewContextType>(INITIAL_CONTEXT);

export const useContractAnnexViewContext = () =>
  useContext(ContractAnnexViewContext);
