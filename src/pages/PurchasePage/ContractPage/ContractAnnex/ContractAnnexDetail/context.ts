import { ModalTypeError } from "core/models/Common/ErrorModal";
import {
  ConfigField,
  FieldValue,
  GeneralAction,
} from "core/services/service-types";
import { Dayjs } from "dayjs";
import { ContractAnnex } from "models/ContractAnnex";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export interface ContractAnnexDetailContextType {
  model: ContractAnnex;
  dispatch: Dispatch<GeneralAction<ContractAnnex>>;
  handleChangeSingleField?: (
    config: ConfigField
  ) => (value: FieldValue) => void;
  handleChangeSelectField?: (
    config: ConfigField
  ) => (idValue: number, value: ContractAnnex) => void;
  handleChangeDateField?: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  handleChangeBoolField?: (config: ConfigField) => (value: boolean) => void;
  handleChangeAllField?: (data: ContractAnnex) => void;
  handleChangeListField?: (config: ConfigField) => (data?: unknown[]) => void;
  errorsModal?: ModalTypeError;
  setErrorsModal?: Dispatch<SetStateAction<ModalTypeError>>;
}

const INITIAL_CONTEXT: ContractAnnexDetailContextType = {
  model: null,
  dispatch: null,
};

export const ContractAnnexDetailContext =
  createContext<ContractAnnexDetailContextType>(INITIAL_CONTEXT);

export const useContractAnnexDetailContext = () =>
  useContext(ContractAnnexDetailContext);
