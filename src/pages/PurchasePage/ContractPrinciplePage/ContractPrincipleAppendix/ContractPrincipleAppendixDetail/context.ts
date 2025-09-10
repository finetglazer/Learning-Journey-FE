import { ConfigField, FieldValue } from "core/services/service-types";
import { Dayjs } from "dayjs";
import { ContractAnnex } from "models/ContractAnnex";
import { createContext, useContext } from "react";
import { Model } from "react-3layer-common";

export interface ContractPrincipleAppendixDetailType {
  model: ContractAnnex;
  dispatch: any;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  handleChangeListField?: (config: ConfigField) => (data?: unknown[]) => void;
  handleChangeDateField?: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  handleChangeSelectField?: (
    config: ConfigField
  ) => (idValue: number, value: Model) => void;
}

const INITIAL_CONTEXT: ContractPrincipleAppendixDetailType = {
  model: null,
  dispatch: null,
};

const ContractPrincipleAppendixDetailContext =
  createContext<ContractPrincipleAppendixDetailType>(INITIAL_CONTEXT);

const useContractPrincipleAppendixDetailContext = () => {
  const context = useContext(ContractPrincipleAppendixDetailContext);

  return context;
};

export {
  ContractPrincipleAppendixDetailContext,
  useContractPrincipleAppendixDetailContext,
};
