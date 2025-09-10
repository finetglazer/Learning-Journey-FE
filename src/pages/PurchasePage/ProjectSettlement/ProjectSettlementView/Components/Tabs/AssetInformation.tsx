import { AdvancedCollapseView } from "components";
import { ContractRequestType } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/Tabs/AssetInformation/AssetInformation";
import OrderFormAsset from "pages/PurchasePage/ProjectSettlement/ProjectSettlementView/Components/OrderFormAsset/OrderFormAsset";
import { useProjectSettlementViewContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementView/context";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TabAssetInformationKey } from "pages/PurchasePage/ProjectSettlement/Components/constant";
import AssetFormationValue from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/AssetFormationValue/AssetFormationValue";
import styles from "../../../ProjectSettlementDetail/Components/Tabs/AssetInformation/AssetInformation.module.scss";
import { Link } from "react-router-dom";
import { CONTRACT_ROUTE_VIEW } from "config/route-const";

const SPACING = "\u00A0";

const AssetInformation = () => {
  const [translate] = useTranslation();

  const { model } = useProjectSettlementViewContext();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getContractTypeLabel = (contractRequestType?: number) => {
    switch (contractRequestType) {
      case ContractRequestType.CONTRACT_NUMBER:
        return translate("PS.txt_contract_number");
      case ContractRequestType.ORDER_NUMBER:
        return translate("PS.txt_order_number");
      default:
        return;
    }
  };

  const itemsCollapse = useMemo(
    () => [
      {
        key: TabAssetInformationKey.ASSET_VALUE,
        label: translate("PS.txt_asset_value"),
        children: <AssetFormationValue model={model} />,
      },
      ...(model?.contractSettlementAsset?.projectSettlementAssets?.map(
        (item, index) => ({
          key: index.toString(),
          label: (
            <>
              {getContractTypeLabel(item?.contractRequestType)}
              {SPACING}
              <Link
                to={`${CONTRACT_ROUTE_VIEW}/${item?.contractId}`}
                className={styles["text-blue"]}
                target="_blank"
              >
                {item?.contractNo}
              </Link>
              {SPACING}
              {translate("PS.txt_for_supplier")} {item?.supplierName} :{SPACING}
              {item?.contractName}
            </>
          ),
          children: <OrderFormAsset key={index} data={item} index={index} />,
        })
      ) || []),
    ],
    [getContractTypeLabel, model, translate]
  );

  return (
    <div className={styles["content-container"]}>
      <AdvancedCollapseView items={itemsCollapse} />
    </div>
  );
};

export default AssetInformation;
