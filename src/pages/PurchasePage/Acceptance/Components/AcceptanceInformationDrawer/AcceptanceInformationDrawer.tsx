import CollapseView from "components/Collapse/CollapseView";
import { numberConstants } from "core/config/consts";
import { validator } from "core/helpers/validator";
import { isEmpty, isEqual } from "lodash";
import { GoodItemsModel } from "models/Acceptance/Acceptance";
import { useMemo } from "react";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { useAcceptanceInformationContext } from "../../AcceptanceDetail/Components/Tabs/contexts/AcceptanceInformationContext";
import { DeliveryReceipt } from "../DeliveryReceipt/DeliveryReceipt";
import { TabKey } from "../constant";
import styles from "./AcceptanceInformationDrawer.module.scss";
import { AcceptanceInformationForm } from "./Components/AcceptanceInformationForm";
import { AcceptanceInformationTableGeneral } from "./Components/AcceptanceInformationTableGeneral";
import { AcceptanceInformationTableTotal } from "./Components/AcceptanceInformationTableTotal";

interface AcceptanceInformationDrawerProps {
  isEdit?: boolean;
  onSave: (data: GoodItemsModel) => void;
}

const KEY_COLLAPSE = `${TabKey.RECEIPT}-drawer`;

export const AcceptanceInformationDrawer = ({
  isEdit,
  onSave,
}: AcceptanceInformationDrawerProps) => {
  const [translate] = useTranslation();
  const { goodsReceiptSelect, setGoodsReceiptSelect } =
    useAcceptanceInformationContext();

  const validate = () => {
    const optional = ["tax"];
    const taxSelected = validator.required({
      filedValidate: optional,
      data: goodsReceiptSelect,
    });
    const required = ["taxAmount"];
    const taxAmountRequired = validator.required({
      filedValidate: required,
      data: goodsReceiptSelect,
    });

    const maxLengthFiled = ["acceptanceNote", "note"];
    const errorsMaxLength = validator.maxLength({
      filedValidate: maxLengthFiled,
      data: goodsReceiptSelect,
      maxLength: 500,
    });

    const errorsTab = validator.tabCharacter({
      filedValidate: maxLengthFiled,
      data: goodsReceiptSelect,
    });

    const hasError = isEmpty(taxSelected) && !isEmpty(taxAmountRequired);

    if (
      isEmpty(errorsMaxLength) &&
      isEqual(hasError, false) &&
      isEmpty(errorsTab)
    ) {
      return true;
    }

    let dataHasError = {
      ...goodsReceiptSelect,
      errors: {
        ...errorsMaxLength,
        ...errorsTab,
      },
    };

    if (isEmpty(taxSelected) && !isEmpty(taxAmountRequired)) {
      dataHasError = {
        ...dataHasError,
        errors: {
          ...dataHasError?.errors,
          ...taxAmountRequired,
        },
      };
    }

    setGoodsReceiptSelect(dataHasError);

    return false;
  };

  const itemsCollapse = useMemo(
    () => [
      {
        key: KEY_COLLAPSE,
        label: translate("AC.txt_tab_goods_receipt_info"),
        children: (
          <div className={styles["table-container"]}>
            <div className={styles["table-scroll"]}>
              <DeliveryReceipt />
            </div>
          </div>
        ),
      },
    ],
    [translate]
  );

  return (
    <Drawer
      size="2xl"
      title={
        <div className={styles["goods-services-drawer__title"]}>
          {translate("AC.txt_details_acceptance_info")}
        </div>
      }
      className={styles["goods-services-drawer"]}
      titleButtonApply={translate("CM.txt_save")}
      handleClose={() => setGoodsReceiptSelect(null)}
      loading={false}
      hasOverlay={false}
      isShowButtonApply={Boolean(isEdit)}
      isShowButtonCancel={false}
      visible={!isEmpty(goodsReceiptSelect)}
      handleSave={() => {
        if (!validate()) return;

        onSave(goodsReceiptSelect);
      }}
    >
      <AcceptanceInformationTableGeneral />
      <AcceptanceInformationForm
        isEdit={Boolean(isEdit)}
        exchangeRate={numberConstants.ZERO}
      >
        <AcceptanceInformationTableTotal />
      </AcceptanceInformationForm>
      <CollapseView
        items={itemsCollapse}
        defaultActiveKey={[KEY_COLLAPSE]}
        className="collapse__container__overflow"
      />
    </Drawer>
  );
};
