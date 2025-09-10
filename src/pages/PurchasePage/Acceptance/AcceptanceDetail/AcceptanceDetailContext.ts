import { ConfirmModalType } from "core/helpers/enum";
import { ConfigField, GeneralAction } from "core/services/service-types";
import { Dayjs } from "dayjs";
import { AcceptanceModel } from "models/Acceptance/Acceptance";

import { createContext, Dispatch, useContext } from "react";

export interface ModelSelect {
  type: ConfirmModalType;
  model: AcceptanceModel;
  errorMessage?: string;
}

export interface AcceptanceCreate {
  isDraft: boolean;
  isEdit: boolean;
  callbackFc: () => void;
}

export enum STATUS_ACCEPTANCE_REQUEST {
  DRAFT = 0,
  CANCELED = 1,
  WAITING_FOR_APPROVAL = 2,
  APPROVED = 3,
  DECLINED = 4,
  RETURNED = 5,
}

export interface AcceptanceDetailContextType {
  model: AcceptanceModel;
  acceptanceId?: string;
  handleCreate: ({ isDraft, isEdit, callbackFc }: AcceptanceCreate) => void;
  dispatch: Dispatch<GeneralAction<AcceptanceModel>>;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
  handleChangeDateField: (
    config: ConfigField
  ) => (date: Dayjs | [Dayjs, Dayjs]) => void;
  handleChangeAllField: (data: AcceptanceModel) => void;
  loading: boolean;
}

const INITIAL_CONTEXT: AcceptanceDetailContextType = {
  model: null,
  dispatch: null,
  handleCreate: null,
  handleChangeSingleField: null,
  handleChangeDateField: null,
  handleChangeAllField: null,
  loading: null,
};

const AcceptanceDetailContext =
  createContext<AcceptanceDetailContextType>(INITIAL_CONTEXT);

const useAcceptanceDetailContext = () => {
  const context = useContext(AcceptanceDetailContext);

  return context;
};

export { AcceptanceDetailContext, useAcceptanceDetailContext };
