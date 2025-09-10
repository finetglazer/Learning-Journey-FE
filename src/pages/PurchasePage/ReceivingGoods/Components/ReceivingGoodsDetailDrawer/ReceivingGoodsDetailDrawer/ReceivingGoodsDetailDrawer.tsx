import { numberConstants } from "core/config/consts";
import { isEmpty } from "lodash";
import { useReceivingGoodsDetailContext } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { ReceivingGoodsDetailDrawerForm } from "./Components/ReceivingGoodsDetailDrawerForm";
import { ReceivingGoodsDetailTableGeneral } from "./Components/ReceivingGoodsDetailTableGeneral";
import { ReceivingGoodsDetailTablePrice } from "./Components/ReceivingGoodsDetailTablePrice";
import { ReceivingGoodsDetailTableTotal } from "./Components/ReceivingGoodsDetailTableTotal";
import { ReceivingGoodsDetailDrawerContext } from "./ReceivingGoodsDetailContext";
import styles from "./ReceivingGoodsDetailDrawer.module.scss";
import { useReceivingGoodsDetailDrawerHooks } from "./ReceivingGoodsDetailDrawerHooks";

export const ReceivingGoodsDetailDrawer = () => {
  const [translate] = useTranslation();
  const {
    goodsReceiptIdSelect,
    setGoodsReceiptIdSelect,
    model,
    isEditable,
    handleChangeSingleField,
  } = useReceivingGoodsDetailContext();

  const { handleDelete, handleSave, ...contextValue } =
    useReceivingGoodsDetailDrawerHooks({
      goodsReceiptRequestItems: model?.goodsReceiptRequestItems,
      goodsReceiptIdSelect,
      handleChangeSingleField,
      setGoodsReceiptIdSelect,
    });

  const makeTitle = () => {
    return (
      <div className={styles["receiving-goods-drawer__title"]}>
        {translate("RG.txt_details_receipt_info")}
      </div>
    );
  };

  return (
    <Drawer
      visible={!isEmpty(goodsReceiptIdSelect)}
      size="2xl"
      loading={false}
      hasOverlay={false}
      title={makeTitle()}
      className={styles["receiving-goods-drawer"]}
      titleButtonApply={translate("CM.txt_save")}
      isShowButtonApply={isEditable}
      isShowButtonCancel={isEditable}
      titleButtonCancel={translate("CM.txt_delete_row")}
      handleClose={() => setGoodsReceiptIdSelect(null)}
      handleCancel={handleDelete}
      handleSave={handleSave}
    >
      <ReceivingGoodsDetailDrawerContext.Provider
        value={{
          ...contextValue,
          currency: model?.currency,
          exchangeRate: model?.exchangeRate || numberConstants?.ONE,
        }}
      >
        <ReceivingGoodsDetailTableGeneral />
        <ReceivingGoodsDetailTableTotal />
        <ReceivingGoodsDetailTablePrice />
        <ReceivingGoodsDetailDrawerForm
          isEdit={isEditable}
          exchangeRate={model?.exchangeRate}
        />
      </ReceivingGoodsDetailDrawerContext.Provider>
    </Drawer>
  );
};
