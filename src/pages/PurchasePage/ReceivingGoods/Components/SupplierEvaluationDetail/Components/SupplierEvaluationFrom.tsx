import { MAX_LENGTH_500 } from "core/config/consts";
import { utilService } from "core/services/common-services/util-service";
import { useReceivingGoodsDetailContext } from "pages/PurchasePage/ReceivingGoods/ReceivingGoodsDetail/ReceivingGoodsDetailContext";
import { FormItem, TextArea } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import styles from "../SupplierEvaluationDetail.module.scss";

export const SupplierEvaluationFrom = () => {
  const { model, handleChangeSingleField, isEditable } =
    useReceivingGoodsDetailContext();
  const [translate] = useTranslation();

  return (
    <div className={styles["evaluation-form"]}>
      <FormItem
        validateObject={utilService.getValidateObj(
          model,
          "supplierEvaluation.supplierEvaluationConclusion"
        )}
      >
        <TextArea
          maxLength={MAX_LENGTH_500}
          label={translate("RG.txt_supplier_evaluation_conclusion")}
          placeHolder={translate("RG.txt_placeholder_evaluation_supplier")}
          resize="none"
          onChange={(value) => {
            handleChangeSingleField({
              fieldName: "supplierEvaluation",
              errorName: "supplierEvaluation.supplierEvaluationConclusion",
            })({
              ...model?.supplierEvaluation,
              supplierEvaluationConclusion: value,
            });
          }}
          value={model?.supplierEvaluation?.supplierEvaluationConclusion}
          isRequired
          showCount
          disabled={!isEditable}
        />
      </FormItem>
    </div>
  );
};
