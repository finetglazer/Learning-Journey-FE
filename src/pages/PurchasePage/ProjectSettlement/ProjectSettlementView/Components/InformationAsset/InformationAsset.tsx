import { useOrderInformationContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/Tabs/context/OrderInformationContext";
import AssetInfoList from "pages/PurchasePage/ProjectSettlement/ProjectSettlementView/Components/AssetInfoList/AssetInfoList";
import { OneLineText } from "react-components-design-system";
import styles from "./InformationAsset.module.scss";
import { formatNumber } from "core/helpers/number";

const InformationAsset = () => {
  const { assetItemSelected } = useOrderInformationContext();

  const assetData = [
    { key: "RG.txt_asset_code", value: assetItemSelected?.code },
    { key: "RG.txt_asset_name", value: assetItemSelected?.name },
    { key: "RG.txt_origin_no", value: assetItemSelected?.originNo },
    { key: "RG.txt_serial_number", value: assetItemSelected?.serialNumber },
    {
      key: "RG.txt_asset_quantity",
      value: formatNumber(assetItemSelected?.quantity || 0),
    },
  ];

  const assetRightData = [
    { key: "PS.txt_asset_good_service", value: assetItemSelected?.goods?.code },
    {
      key: "PS.txt_asset_name_good_service",
      value: (
        <OneLineText
          value={assetItemSelected?.goods?.name}
          className={styles["single-line-text"]}
        />
      ),
    },
    {
      key: "PS.txt_asset_manufacturer_type",
      value: assetItemSelected?.branch?.name,
    },
    { key: "AC.txt_notes", value: assetItemSelected?.note },
    {
      key: "PS.txt_asset_good_service_description",
      value: (
        <OneLineText
          value={assetItemSelected?.goodsDescription}
          className={styles["single-line-text"]}
        />
      ),
    },
  ];

  return (
    <div className={styles["information-asset__container"]}>
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

export default InformationAsset;
