import { AdvancedCollapseView } from "components";
import { CollapseItem } from "components/Collapse/CollapseView";
import ContractAnnexGuarantee from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/WarrantyGuaranteeTab/Components/ContractAnnexGuarantee/ContractAnnexGuarantee";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "./WarrantyGuaranteeTab.module.scss";
import ContractAnnexWarranty from "pages/PurchasePage/ContractPage/ContractAnnex/ContractAnnexDetail/Tabs/WarrantyGuaranteeTab/Components/ContractAnnexWarranty/ContractAnnexWarranty";

enum CollapseKey {
  GUARANTEE = "1",
  WARRANTY = "2",
}

const WarrantyGuaranteeTab = () => {
  const [translate] = useTranslation();

  const items: CollapseItem[] = useMemo(() => {
    return [
      {
        key: CollapseKey.GUARANTEE,
        label: translate("CA.txt_guarantee_information"),
        children: <ContractAnnexGuarantee />,
      },
      {
        key: CollapseKey.WARRANTY,
        label: translate("CA.txt_warranty_information"),
        children: <ContractAnnexWarranty />,
      },
    ];
  }, [translate]);

  return (
    <AdvancedCollapseView
      items={items}
      className={styles["warranty_guarantee_tab"]}
    />
  );
};

export default WarrantyGuaranteeTab;
