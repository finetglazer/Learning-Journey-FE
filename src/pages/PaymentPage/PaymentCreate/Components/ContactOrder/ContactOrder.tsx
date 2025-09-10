import React, { useMemo } from "react";
import CollapseView, { CollapseItem } from "components/Collapse/CollapseView";
import { useTranslation } from "react-i18next";
import styles from "./ContactOrder.module.scss";
import ContactOrderInsight from "./ContactOrderInsight/ContactOrderInsight";
import { assetFormations, ContractSettlementInfo } from "models/Payment";
import AssetFormationValue from "./AssetFormationValue/AssetFormationValue";
enum InformationSectionKey {
  BY_SERVICE_USER_INFO = "BY_SERVICE_USER_INFO",
  ASSET_FORMATION_VALUE = "ASSET_FORMATION_VALUE",
}

type props = {
  contractSettlement: ContractSettlementInfo;
  assetFormations: assetFormations[];
};
const ContactOrder = ({ contractSettlement, assetFormations }: props) => {
  const [translate] = useTranslation();
  const items = useMemo<CollapseItem[]>(
    () => [
      {
        key: InformationSectionKey.BY_SERVICE_USER_INFO,
        label: translate("PM.contract_settlement_information"),
        children: (
          <ContactOrderInsight contractSettlement={contractSettlement} />
        ),
      },
      {
        key: InformationSectionKey.ASSET_FORMATION_VALUE,
        label: translate("settlement.assetFormationValue"),
        children: <AssetFormationValue assetFormations={assetFormations} />,
      },
    ],
    [translate]
  );
  return (
    <CollapseView
      items={items?.filter(Boolean) as CollapseItem[]}
      className={`${styles["collapse--title_custom"]} mt-1`}
      isShowTopDivider={false}
      defaultActiveKey={[
        InformationSectionKey.BY_SERVICE_USER_INFO,
        InformationSectionKey.ASSET_FORMATION_VALUE,
      ]}
    />
  );
};

export default ContactOrder;
