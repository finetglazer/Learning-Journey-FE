import { AxiosError } from "axios";
import { GeneralAction } from "core/services/service-types";
import { GoodsReceipt } from "models/ReceivingGood/GoodsReceipt";
import { createContext, useContext } from "react";

// config enum Tab

export enum TabKeyDetailEnum {
  RECEIVED_INFORMATION = "0",
  SUPPLIER_EVALUATION = "1",
  INTERGRATION = "2",
  HISTORY_APPROVAL = "3",
}

export enum STATUS_RECEIVED_REQUEST {
  DRAFT = 0,
  WAITING_FOR_APPROVAL = 1,
  APPROVED = 2,
  REJECTED = 3,
  CANCELED = 4,
}

export interface ReceivingGoodsDetailContextContextType {
  model: GoodsReceipt;
  dispatch: React.Dispatch<GeneralAction<GoodsReceipt>>;
  handleErrorResponse: (error: AxiosError, newModel: GoodsReceipt) => void;
}

const INITIAL_CONTEXT: ReceivingGoodsDetailContextContextType = {
  model: null,
  dispatch: null,
  handleErrorResponse: null,
};

const ReceivingGoodsViewContext =
  createContext<ReceivingGoodsDetailContextContextType>(INITIAL_CONTEXT);

const useReceivingGoodsViewContext = () => {
  const context = useContext(ReceivingGoodsViewContext);

  return context;
};

export { ReceivingGoodsViewContext, useReceivingGoodsViewContext };
