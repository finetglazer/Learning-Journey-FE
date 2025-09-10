import { ConfigField } from "core/services/service-types";
import { AcceptanceModel } from "models/Acceptance/Acceptance";

import { createContext, useContext } from "react";

export interface AcceptanceViewContextType {
  model: AcceptanceModel;
  handleApproval?: () => void;
  handleChangeSingleField: (
    config: ConfigField
  ) => (value: string | number | boolean | object) => void;
}

const INITIAL_CONTEXT: AcceptanceViewContextType = {
  model: null,
  handleChangeSingleField: null,
};

const AcceptanceViewContext =
  createContext<AcceptanceViewContextType>(INITIAL_CONTEXT);

const useAcceptanceViewContext = () => {
  const context = useContext(AcceptanceViewContext);

  return context;
};

export { AcceptanceViewContext, useAcceptanceViewContext };
