import React, { useMemo } from "react";
import "./WarrantyGuaranteeTab.scss";
import CollapseView, { CollapseItem } from "components/Collapse/CollapseView";
import { useTranslation } from "react-i18next";
import WarrantyView from "./Components/WarrantyView/WarrantyView";
import GuaranteeView from "./Components/GuaranteeView/GuaranteeView";

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
        label: translate("CT.guarantee_info"),
        children: <GuaranteeView />,
      },
      {
        key: CollapseKey.WARRANTY,
        label: translate("CT.warranty_info"),
        children: <WarrantyView />,
      },
    ];
  }, [translate]);

  return (
    <CollapseView
      items={items}
      className="warranty_guarantee_tab"
      isShowTopDivider={false}
      defaultActiveKey={[CollapseKey.GUARANTEE, CollapseKey.WARRANTY]}
    />
  );
};

export default WarrantyGuaranteeTab;
