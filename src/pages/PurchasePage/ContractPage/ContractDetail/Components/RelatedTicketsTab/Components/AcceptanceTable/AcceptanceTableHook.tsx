import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { ContractDetailModel, TicketAcceptance } from "models/Contract";
import { ContractDetailHookContext } from "pages/PurchasePage/ContractPage/ContractDetailHook";
import { ACCEPTANCE_DETAIL_ROUTE } from "config/route-const";

export const useAcceptanceTableHook = () => {
  const [translate] = useTranslation();

  const { model } = useContext<ContractDetailModel>(ContractDetailHookContext);

  const acceptanceList = model?.ticketRelated?.ticketAcceptances || [];

  const viewAcceptanceTicket = (rowData: TicketAcceptance) => {
    window.open(`${ACCEPTANCE_DETAIL_ROUTE}/${rowData?.id}`, "_blank");
  };

  return {
    translate,
    acceptanceList,
    viewAcceptanceTicket,
  };
};
