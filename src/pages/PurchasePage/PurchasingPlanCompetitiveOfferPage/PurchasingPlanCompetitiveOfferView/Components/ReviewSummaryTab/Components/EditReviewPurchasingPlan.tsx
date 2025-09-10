import { listEvaluation } from "config/const";
import { utilService } from "core/services/common-services/util-service";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { isNil, size } from "lodash";
import { EvaluationResult, ViewRole } from "models/PurchasingPlan";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { useContext } from "react";
import {
  FormItem,
  InputNumber,
  Modal,
  Select,
} from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { of } from "rxjs";

interface EditReviewPurchasingPlanProps {
  editReview?: EvaluationResult;
  dismiss: (shouldReloadList?: boolean) => void;
}

const MODAL_WIDTH = 600;

export const EditReviewPurchasingPlan = ({
  editReview,
  dismiss,
}: EditReviewPurchasingPlanProps) => {
  const [translate] = useTranslation();

  const { model: modelMaster, handleConfirmPurchasingPlanUpdateResults } =
    useContext(PurchasingPlanCompetitiveOfferDetailHookContext);

  const { model, dispatch } = detailService.useModel<EvaluationResult>(
    EvaluationResult,
    editReview
  );

  const { handleChangeSingleField } = fieldService.useField(model, dispatch);

  const validate = () => {
    const errors: any = {};
    if (isShowPassFlag && isNil(model?.editedPassFlag)) {
      errors["editedPassFlag"] = translate("CM.input_require_validation");
    }
    if (isShowEvaluationPoint && isNil(model?.editedQuotationPoint)) {
      errors["editedQuotationPoint"] = translate("CM.input_require_validation");
    }
    if (
      isShowEvaluationPoint &&
      !isNil(model?.editedQuotationPoint) &&
      model?.editedQuotationPoint < model?.minimumPoint
    ) {
      errors["editedQuotationPoint"] = translate("PL.txt_minimum_point_scale", {
        point: model?.minimumPoint,
      });
    }
    if (isShowConvertPoint && isNil(model?.editedConvertPoint)) {
      errors["editedConvertPoint"] = translate("CM.input_require_validation");
    }
    if (
      isShowConvertPoint &&
      !isNil(model?.editedConvertPoint) &&
      model?.editedConvertPoint < model?.minimumPoint
    ) {
      errors["editedConvertPoint"] = translate("PL.txt_minimum_point_scale", {
        point: 0,
      });
    }
    dispatch({ type: "SET_ERRORS", payload: errors });
    return !size(errors);
  };

  const handleSave = () => {
    if (!validate()) return;
    const newDataEvaluationSummary = modelMaster.evaluationSummary?.map(
      (item) => {
        if (item.id === model?.evaluationSummaryId) {
          return {
            ...item,
            evaluationResults: item.evaluationResults.map((i) => {
              if (i.id === model?.id) {
                return model;
              }
              return i;
            }),
          };
        }
        return item;
      }
    );
    handleConfirmPurchasingPlanUpdateResults(newDataEvaluationSummary);
    dismiss();
  };

  const isShowPassFlag = [
    ViewRole.TechnicalLeader,
    ViewRole.TechnicalEvaluator,
    ViewRole.FinancialLeader,
    ViewRole.ProjectDirector,
  ].includes(modelMaster.viewRole);

  const isShowEvaluationPoint = [
    ViewRole.TechnicalLeader,
    ViewRole.TechnicalEvaluator,
    ViewRole.FinancialLeader,
    ViewRole.ProjectDirector,
  ].includes(modelMaster.viewRole);

  const isShowConvertPoint = [
    ViewRole.FinancialEvaluator,
    ViewRole.Buyer,
  ].includes(modelMaster.viewRole);

  const renderContent = () => {
    switch (modelMaster.viewRole) {
      case ViewRole.FinancialEvaluator:
      case ViewRole.Buyer:
      case ViewRole.FinancialLeader:
        return (
          <>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "editedConvertPoint"
              )}
            >
              <InputNumber
                isSmall={false}
                label={translate("PL.txt_review_summary_conversion_point")}
                value={model?.editedConvertPoint}
                onChange={handleChangeSingleField({
                  fieldName: "editedConvertPoint",
                })}
                translate={translate}
                decimalDigit={2}
                numberType={"DECIMAL"}
              />
            </FormItem>
          </>
        );
      case ViewRole.TechnicalLeader:
      case ViewRole.TechnicalEvaluator:
      case ViewRole.ProjectDirector:
        return (
          <>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "editedPassFlag"
              )}
            >
              <Select
                isSmall={false}
                isRequired
                classFilter={undefined}
                getList={() => of(listEvaluation)}
                onChange={(_, value) => {
                  handleChangeSingleField({
                    fieldName: "editedPassFlag",
                  })(value?.id);
                }}
                valueFilter={{
                  name: "",
                }}
                isEnumerable
                placeHolder={translate("PL.txt_review_summary_pass_criteria")}
                value={listEvaluation.find(
                  (item) => item.id == model?.editedPassFlag
                )}
                label={translate("PL.txt_review_summary_pass_criteria")}
              />
            </FormItem>
            <FormItem
              validateObject={utilService.getValidateObj(
                model,
                "editedQuotationPoint"
              )}
            >
              <InputNumber
                isSmall={false}
                label={translate("PL.txt_review_summary_assessment_score")}
                value={model?.editedQuotationPoint}
                onChange={handleChangeSingleField({
                  fieldName: "editedQuotationPoint",
                })}
                decimalDigit={2}
                numberType={"DECIMAL"}
                translate={translate}
                max={model.maximumPoint}
              />
            </FormItem>
          </>
        );
      default:
        break;
    }
  };

  return (
    <Modal
      open
      isShowIconBack={false}
      size={MODAL_WIDTH}
      title={translate("PL.txt_review_summary_edit_review")}
      titleButtonApply={translate("CM.txt_save")}
      titleButtonCancel={translate("CM.btn_close")}
      handleSave={handleSave}
      handleCancel={dismiss}
    >
      <div className="d-flex size-full flex-column gap-3">
        <div className="fw-bold" style={{ fontSize: "18px" }}>
          {translate("PL.table_purchase_plan_provider")}:{" "}
          {model?.supplier?.name}
        </div>
        {renderContent()}
      </div>
    </Modal>
  );
};
