import { numberConstants } from "core/config/consts";
import { isEqual, uniqueId } from "lodash";
import { useTranslation } from "react-i18next";
import { ItemTable } from "../../../ItemTable/ItemTable";
import { useReceivingGoodsDetailDrawerContext } from "../ReceivingGoodsDetailContext";
import styles from "../ReceivingGoodsDetailDrawer.module.scss";
import { OneLineText } from "react-components-design-system";
import { useReceivingGoodsDetailContext } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";

export const ReceivingGoodsDetailTableGeneral = () => {
  const [translate] = useTranslation();

  const { goodsReceiptRequestItem: data } =
    useReceivingGoodsDetailDrawerContext();
  const { state } = useReceivingGoodsDetailContext();

  const columnsHeader = [
    {
      title: translate("RG.txt_product_code"),
      content: data?.contractGoodsItem?.goodsInfo?.code,
    },
    {
      title: translate("RG.txt_product_name"),
      content: data?.contractGoodsItem?.goodsInfo?.name,
    },
    {
      title: translate("RG.txt_manufacturer_brand_type"),
      content: data?.contractGoodsItem?.manufacturerInfo?.name,
    },
  ];
  return (
    <table className={styles["table"]}>
      <tbody>
        <tr className={styles["bg-grey"]}>
          {columnsHeader.map((props) => (
            <ItemTable key={uniqueId()} {...props} />
          ))}
        </tr>
        <tr>
          <ItemTable
            title={translate("RG.txt_unit_of_measure")}
            content={data?.contractGoodsItem?.unitInfo?.name}
          />
          <ItemTable
            title={translate("RG.txt_moving_service_good")}
            colSpan={numberConstants.TWO}
            content={data?.contractGoodsItem?.description}
          />
        </tr>
        <tr>
          <ItemTable
            title={translate("RG.txt_tax_rate")}
            content={data?.contractGoodsItem?.taxInfo?.name}
          />
          <ItemTable
            title={translate("RG.txt_note_received_good")}
            colSpan={numberConstants.TWO}
            content={data?.contractGoodsItem?.note}
          />
        </tr>
        {isEqual(state, "VIEW") ? (
          <tr>
            <ItemTable
              title={translate("RG.txt_notes")}
              content={<OneLineText value={data?.contractGoodsItem?.note} />}
              colSpan={numberConstants.THREE}
            />
          </tr>
        ) : null}
      </tbody>
    </table>
  );
};
