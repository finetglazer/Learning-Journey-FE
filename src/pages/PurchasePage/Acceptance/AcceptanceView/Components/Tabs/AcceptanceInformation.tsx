import { PurchaseOrganization } from "models/Acceptance/Acceptance";
import {
  AcceptanceInformationContext,
  AcceptanceInformationContextType,
} from "pages/PurchasePage/Acceptance/AcceptanceDetail/Components/Tabs/contexts/AcceptanceInformationContext";
import { DescriptionDetails } from "pages/PurchasePage/Acceptance/AcceptanceView/Components/DescriptionDetails/DescriptionDetails";
import { TabKey } from "pages/PurchasePage/Acceptance/Components/constant";
import { PartnerInformation } from "pages/PurchasePage/Acceptance/Components/PartnerInformation/PartnerInformation";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AcceptanceInformationLayout } from "../../../Components/Layout/AcceptanceInformationLayout";
import { isEqual } from "lodash";
import { AcceptanceStatus } from "models/Acceptance";

type AcceptanceInformationProps = AcceptanceInformationContextType;

export const AcceptanceInformation = (
  valueContext: AcceptanceInformationProps
) => {
  const [translate] = useTranslation();
  const { model } = valueContext;
  const checkStatus = isEqual(model?.status, AcceptanceStatus.APPROVED);

  const supplierInformation: PurchaseOrganization = useMemo(() => {
    if (!model)
      return {
        name: "",
        taxCode: "",
        address: "",
        personAgent: "",
        position: "",
      };
    return {
      name: model.supplierName,
      taxCode: model.supplierTaxCode,
      address: model.supplierAddress,
      personAgent: model.supplierAgent,
      position: model.supplierPosition,
    };
  }, [model]);

  const itemsCollapse = useMemo(
    () => [
      {
        key: TabKey.DESCRIPTION,
        label: translate("AC.txt_tab_general_information"),
        children: <DescriptionDetails />,
      },
      {
        key: TabKey.BUYER,
        label: translate("AC.txt_tab_buyer_service_info"),
        children: (
          <PartnerInformation
            data={{
              ...model?.legalEntity,
              position: model?.approverPosition,
              personAgent: model?.approverName,
            }}
            checkStatus={checkStatus}
          />
        ),
      },
      {
        key: TabKey.SELLER,
        label: translate("AC.txt_tab_seller_service_info"),
        children: <PartnerInformation data={supplierInformation} isSeller />,
      },
    ],
    [
      checkStatus,
      model?.approverName,
      model?.approverPosition,
      model?.legalEntity,
      supplierInformation,
      translate,
    ]
  );

  return (
    <AcceptanceInformationContext.Provider value={valueContext}>
      <AcceptanceInformationLayout itemsCollapse={itemsCollapse} />
    </AcceptanceInformationContext.Provider>
  );
};
