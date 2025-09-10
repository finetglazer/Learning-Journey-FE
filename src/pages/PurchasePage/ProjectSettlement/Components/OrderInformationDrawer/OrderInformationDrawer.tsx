import { AdvancedCollapseView } from "components";
import {
  MAX_LENGTH_1000,
  MAX_LENGTH_255,
  MAX_LENGTH_500,
} from "core/config/consts";
import { validator } from "core/helpers/validator";
import { isEqual, isNil } from "lodash";
import { TabAssetInformationKey } from "pages/PurchasePage/ProjectSettlement/Components/constant";
import { useCheckState } from "pages/PurchasePage/ProjectSettlement/Components/hooks/useCheckState";
import OrderInformationForm from "pages/PurchasePage/ProjectSettlement/Components/OrderInformationDrawer/Components/OrderInformationForm";
import { useOrderInformationContext } from "pages/PurchasePage/ProjectSettlement/ProjectSettlementDetail/Components/Tabs/context/OrderInformationContext";
import InformationAsset from "pages/PurchasePage/ProjectSettlement/ProjectSettlementView/Components/InformationAsset/InformationAsset";
import InformationSettlement from "pages/PurchasePage/ProjectSettlement/ProjectSettlementView/Components/InformationSettlement/InformationSettlement";
import { useMemo } from "react";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "./OrderInformationDrawer.module.scss";

interface OrderInformationDrawerProps {
  isEdit?: boolean;

  onSave: () => void;
  onDelete: (ids: string[]) => void;
}

export const OrderInformationDrawer = ({
  onSave,
  onDelete,
}: OrderInformationDrawerProps) => {
  const [translate] = useTranslation();
  const { state } = useCheckState();

  const itemsCollapse = useMemo(
    () => [
      {
        key: TabAssetInformationKey.INFORMATION_ASSET,
        label: translate("settlement.property_info"),
        children: <InformationAsset />,
      },
      {
        key: TabAssetInformationKey.INFORMATION_SETTLEMENT,
        label: translate("settlement.settlement_info"),
        children: <InformationSettlement />,
      },
    ],
    [translate]
  );

  const { assetItemSelected: data, setAssetItemSelected } =
    useOrderInformationContext();

  const validate = () => {
    const requiredFields = [
      "type",
      "code",
      "originalCost",
      "depreciationMonths",
      "goods",
      "ownerOrganization",
      "branch",
      "ownerUser",
      "quantity",
      "depreciationStartDate",
      "usageStartDate",
    ];
    const maxLengthFields = ["note", "goodsDescription"];
    const maxLengthFields255 = ["code"];
    const maxLengthFields500 = ["goodsNote"];
    const errors = {
      ...validator.required({
        filedValidate: requiredFields,
        data,
      }),
      ...validator.maxLength({
        filedValidate: maxLengthFields,
        data,
        maxLength: MAX_LENGTH_1000,
      }),
      ...validator.maxLength({
        filedValidate: maxLengthFields255,
        data,
        maxLength: MAX_LENGTH_255,
      }),
      ...validator.maxLength({
        filedValidate: maxLengthFields500,
        data,
        maxLength: MAX_LENGTH_500,
      }),
      ...validator.tabCharacter({
        filedValidate: maxLengthFields,
        data,
      }),
    };

    if (Object.keys(errors).length > 0) {
      setAssetItemSelected({
        ...data,
        errors,
      });
      return false;
    }

    return true;
  };

  const checkState = ["CREATE", "EDIT"].includes(state);

  return (
    <Drawer
      size="2xl"
      title={
        <div className={styles["order-information-drawer__title"]}>
          {translate("PS.txt_asset_drawer_title")}
        </div>
      }
      className={styles["order-information-drawer"]}
      titleButtonApply={translate("CM.txt_save")}
      titleButtonCancel={translate("CM.btn_cancel")}
      titleButtonDelete={translate("PS.txt_delete_asset")}
      handleClose={() => setAssetItemSelected(null)}
      handleCancel={() => setAssetItemSelected(null)}
      handleDelete={() => {
        if (data?.id) {
          onDelete([data?.id]);
        }
        setAssetItemSelected(null);
      }}
      loading={false}
      hasOverlay={false}
      isShowButtonApply={checkState}
      isShowButtonCancel={checkState}
      isShowButtonDelete={data?.isSynced}
      visible={!isNil(data)}
      handleSave={() => {
        if (!validate()) return;
        onSave();
        setAssetItemSelected(null);
      }}
      visibleFooter={checkState}
    >
      {isEqual(state, "DETAIL") ? (
        <div className={styles["asset-drawer__view"]}>
          <div className={styles["asset-drawer__main"]}>
            <AdvancedCollapseView items={itemsCollapse} />
          </div>
        </div>
      ) : (
        <OrderInformationForm />
      )}
    </Drawer>
  );
};
