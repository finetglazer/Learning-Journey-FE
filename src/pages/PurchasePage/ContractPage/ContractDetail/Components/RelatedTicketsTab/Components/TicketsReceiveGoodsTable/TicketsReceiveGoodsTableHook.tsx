import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { ContractDetailModel, TicketReceipt } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { RECEIVING_GOODS_DETAIL_ROUTE } from "config/route-const";

export const useTicketsReceiveGoodsTableHook = () => {
  const [translate] = useTranslation();

  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const ticketsReceiveGoodsList = model?.ticketRelated?.ticketReceipts || [];

  const viewRelatedTicket = (rowData: TicketReceipt) => {
    window.open(`${RECEIVING_GOODS_DETAIL_ROUTE}/${rowData?.id}`, "_blank");
  };

  return {
    translate,
    ticketsReceiveGoodsList,
    viewRelatedTicket,
  };
};
