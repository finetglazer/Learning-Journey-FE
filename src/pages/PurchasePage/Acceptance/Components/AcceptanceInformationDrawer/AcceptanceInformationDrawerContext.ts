import { numberConstants } from "core/config/consts";
import { GoodsReceiptRequestItem } from "models/ReceivingGood/GoodsReceipt";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export interface AcceptanceInformationDrawerContextType {
  goodsReceiptRequestItem: GoodsReceiptRequestItem;
  setGoodsReceiptRequestItem: Dispatch<SetStateAction<GoodsReceiptRequestItem>>;
  currency: string;
  exchangeRate: number;
}

const INITIAL_CONTEXT: AcceptanceInformationDrawerContextType = {
  goodsReceiptRequestItem: undefined,
  setGoodsReceiptRequestItem: null,
  currency: null,
  exchangeRate: numberConstants.ONE,
};

const AcceptanceInformationDrawerContext =
  createContext<AcceptanceInformationDrawerContextType>(INITIAL_CONTEXT);

const useAcceptanceInformationDrawerContext = () => {
  const context = useContext(AcceptanceInformationDrawerContext);

  return context;
};

export {
  AcceptanceInformationDrawerContext,
  useAcceptanceInformationDrawerContext,
};
