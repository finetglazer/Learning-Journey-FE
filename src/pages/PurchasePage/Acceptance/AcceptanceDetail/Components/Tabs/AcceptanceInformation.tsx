import { TabKey } from "pages/PurchasePage/Acceptance/Components/constant";
import { PartnerInformation } from "pages/PurchasePage/Acceptance/Components/PartnerInformation/PartnerInformation";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AcceptanceInformationLayout } from "../../../Components/Layout/AcceptanceInformationLayout";
import { DescriptionDetails } from "../DescriptionDetails/DescriptionDetails";
import { SupplierInformation } from "../SupplierInformation/SupplierInformation";
import {
  AcceptanceInformationContext,
  AcceptanceInformationContextType,
} from "./contexts/AcceptanceInformationContext";

type AcceptanceInformationProps = AcceptanceInformationContextType;

export const AcceptanceInformation = (
  valueContext: AcceptanceInformationProps
) => {
  const [translate] = useTranslation();
  const { model } = valueContext;

  const itemsCollapse = useMemo(
    () => [
      {
        key: TabKey.DESCRIPTION,
        label: translate("BG.general_information"),
        children: <DescriptionDetails />,
      },
      {
        key: TabKey.BUYER,
        label: translate("AC.txt_tab_buyer_service_info"),
        children: <PartnerInformation data={model?.legalEntity} />,
      },
      {
        key: TabKey.SELLER,
        label: translate("AC.txt_tab_seller_service_info"),
        children: <SupplierInformation />,
      },
    ],
    [model, translate]
  );

  return (
    <AcceptanceInformationContext.Provider value={valueContext}>
      <AcceptanceInformationLayout itemsCollapse={itemsCollapse} isEdit />
    </AcceptanceInformationContext.Provider>
  );
};
