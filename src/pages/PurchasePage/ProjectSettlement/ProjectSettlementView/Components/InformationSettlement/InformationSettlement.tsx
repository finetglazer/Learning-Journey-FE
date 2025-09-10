import AssetInfoList from "pages/PurchasePage/ProjectSettlement/ProjectSettlementView/Components/AssetInfoList/AssetInfoList";
import styles from "./InformationSettlement.module.scss";
import { formatDate } from "core/helpers/date-time";
import { formatNumber } from "core/helpers/number";
import { useOrderInformationContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/Tabs/context/OrderInformationContext";
import { useTranslation } from "react-i18next";
import {
  numberConstants,
  STANDARD_DATE_FORMAT_SLASH,
} from "core/config/consts";
import { OneLineText } from "react-components-design-system";

const InformationSettlement = () => {
  const [translate] = useTranslation();
  const { assetItemSelected } = useOrderInformationContext();

  const getAssetType = (type?: number) => {
    switch (type) {
      case numberConstants.ONE:
        return translate("PS.txt_buy_new");
      case numberConstants.TWO:
        return translate("PS.txt_upgrade");
      default:
        return;
    }
  };
  const assetData = [
    {
      key: "AC.txt_receiver_and_in_charge",
      value: assetItemSelected?.ownerUser?.email,
    },
    {
      key: "PS.txt_table_asset_type_settlement",
      value: getAssetType(Number(assetItemSelected?.type?.code)),
    },
    {
      key: "RG.txt_original_price",
      value: formatNumber(assetItemSelected?.originalCost),
    },
    {
      key: "PS.txt_asset_note",
      value: (
        <OneLineText
          value={assetItemSelected?.goodsDescription}
          className={styles["single-line-text"]}
        />
      ),
    },
    {
      key: "PS.txt_asset_note_settlement",
      value: (
        <OneLineText
          value={assetItemSelected?.goodsNote}
          className={styles["single-line-text"]}
        />
      ),
    },
  ];

  const assetRightData = [
    {
      key: "AC.txt_receiving_unit_and_in_charge",
      value: assetItemSelected?.ownerOrganization?.name,
    },
    {
      key: "PM.payment_supplier_table_type_placeholder",
      value: assetItemSelected?.classify,
    },
    {
      key: "PS.txt_table_asset_depreciation_calculation",
      value: assetItemSelected?.depreciationMonths,
    },
    {
      key: "PS.txt_table_asset_date_use",
      value: formatDate(
        assetItemSelected?.usageStartDate,
        STANDARD_DATE_FORMAT_SLASH
      ),
    },
    {
      key: "PS.txt_table_asset_depreciation_start_date",
      value: formatDate(
        assetItemSelected?.depreciationStartDate,
        STANDARD_DATE_FORMAT_SLASH
      ),
    },
  ];
  return (
    <div className={styles["information-settlement__container"]}>
      <AssetInfoList
        data={assetData}
        className={styles["information-asset__left"]}
      />
      <AssetInfoList
        data={assetRightData}
        className={styles["information-asset__right"]}
      />
    </div>
  );
};

export default InformationSettlement;
