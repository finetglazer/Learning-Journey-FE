import { useContext } from "react";
import { useTranslation } from "react-i18next";

import {
  ContractDetailModel,
  PurchasePlanRelated,
  TicketType,
} from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import {
  PROPOSAL_DETAIL_ROUTE,
  PURCHASE_REQUEST_VIEW_ROUTE,
  PURCHASING_PLAN_VIEW_ROUTE,
} from "config/route-const";

const relatedTicketUrlsMap = {
  [TicketType.ShoppingPlan]: PURCHASING_PLAN_VIEW_ROUTE,
  [TicketType.ShoppingRequest]: PURCHASE_REQUEST_VIEW_ROUTE,
  [TicketType.Policy]: PROPOSAL_DETAIL_ROUTE,
};

export const useRelatedTicketsTableHook = () => {
  const [translate] = useTranslation();
  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const relatedTicketsList = model?.ticketRelated?.purchasePlanRelateds || [];

  const viewRelatedTicket = (rowData: PurchasePlanRelated) => {
    window.open(
      `${relatedTicketUrlsMap[rowData?.ticketType]}/${rowData?.id}`,
      "_blank"
    );
  };

  return {
    translate,
    relatedTicketsList,
    viewRelatedTicket,
  };
};
