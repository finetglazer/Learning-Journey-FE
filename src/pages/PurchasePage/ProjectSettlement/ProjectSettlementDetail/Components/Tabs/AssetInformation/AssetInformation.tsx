import CollapseView from "components/Collapse/CollapseView";
import { TabAssetInformationKey } from "pages/PurchasePage/ProjectSettlement/Components/constant";
import AssetFormationValue from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/AssetFormationValue/AssetFormationValue";
import OrderFormAsset from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/OrderFormAsset/OrderFormAsset";
import { useProjectSettlementDetailContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/context";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../../ProjectSettlementPage.module.scss";
import { Link } from "react-router-dom";
import { CONTRACT_ROUTE_VIEW } from "config/route-const";

const SPACING = "\u00A0";

export enum ContractRequestType {
  CONTRACT_NUMBER = 0,
  ORDER_NUMBER = 1,
}

const AssetInformation = () => {
  const [translate] = useTranslation();
  const { model } = useProjectSettlementDetailContext();

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
    ],
    [model, translate]
  );

  const itemsCollapseOrderFormAsset = useMemo(
    () => [
      ...(model?.contractSettlementAsset?.projectSettlementAssets?.map(
        (item, index) => ({
          key: index.toString(),
          label: (
            <>
              {getContractTypeLabel(item?.contractRequestType)} {SPACING}
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
    [
      getContractTypeLabel,
      model?.contractSettlementAsset?.projectSettlementAssets,
      translate,
    ]
  );
  return (
    <div className={styles["content-container"]}>
      <CollapseView
        items={itemsCollapse}
        isShowTopDivider={false}
        defaultActiveKey={Object.values(TabAssetInformationKey)}
      />
      <CollapseView
        items={itemsCollapseOrderFormAsset}
        defaultActiveKey={itemsCollapseOrderFormAsset.map((item) => item.key)}
      />
    </div>
  );
};

export default AssetInformation;
