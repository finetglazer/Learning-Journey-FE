import { AddIconRed } from "assets/icons";
import {
  AssetItemModel,
  ProjectSettlementAsset,
} from "models/ProjectSettlement";
import { useCheckState } from "pages/PurchasePage/ProjectSettlement/Components/hooks/useCheckState";
import AssetTableOrder from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/AssetTableOrder/AssetTableOrder";
import { OrderInformationContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/Tabs/context/OrderInformationContext";
import { useProjectSettlementViewContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementView/context";
import { Button } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./OrderFormAsset.module.scss";
import { useOrderFormHooks } from "pages/PurchasePage/ProjectSettlement/Components/hooks/useOrderForm";
const ICON_SIZE = 14;

interface OrderFormAssetProps {
  data: ProjectSettlementAsset;
  index: number;
}
const OrderFormAsset = ({ data, index }: OrderFormAssetProps) => {
  const [translate] = useTranslation();
  const { state } = useCheckState();
  const checkState = ["EDIT", "CREATE"].includes(state);
  const {
    assetItemSelected,
    onSave,
    setAssetItemSelected,
    isOpenModelConfirmDeleteRow,
    setIsOpenModelConfirmDeleteRow,
    handleDeleteOrderForm,
  } = useOrderFormHooks({ data, index });
  return (
    <div className={styles["order_form_container"]}>
      {checkState && (
        <Button
          icon={
            <img
              src={AddIconRed}
              alt="img"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          }
          iconPlace="left"
          type="secondary"
          onClick={() => {
            setAssetItemSelected(new AssetItemModel());
          }}
        >
          {translate("TIA.txt_add_asset")}
        </Button>
      )}
      <OrderInformationContext.Provider
        value={{
          assetItemSelected,
          setAssetItemSelected,
          onSave,
          setIsOpenModelConfirmDeleteRow,
          isOpenModelConfirmDeleteRow,
          handleDeleteOrderForm,
        }}
      >
        <div className={styles["order_form_table"]}>
          <AssetTableOrder data={data} index={index} />
        </div>
      </OrderInformationContext.Provider>
    </div>
  );
};

export default OrderFormAsset;
