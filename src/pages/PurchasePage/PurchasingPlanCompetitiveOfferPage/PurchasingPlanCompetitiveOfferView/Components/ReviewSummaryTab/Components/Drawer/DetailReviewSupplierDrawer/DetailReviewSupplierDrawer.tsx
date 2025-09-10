import { AdvancedCollapseView } from "components";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import {
  EvaluationItemResult,
  EvaluationResult,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";
import { useCallback, useContext, useEffect } from "react";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import "./DetailReviewSupplierDrawer.scss";
import EvaluationResultsTable from "./EvaluationResultsTable";
import SupplierDocumentTable from "./SupplierDocumentTable";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { isNil } from "lodash";
import { NOT_TAB_ENTER_REGEX } from "core/config/consts";

type Props = {
  visible?: boolean;
  onPressClose?: () => void;
  data?: EvaluationResult;
  isEdit?: boolean;
  handleViewQuote?: () => void;
};

const DetailReviewSupplierDrawer = ({
  onPressClose,
  data,
  isEdit,
  handleViewQuote,
}: Props) => {
  const [translate] = useTranslation();
  const {
    model: modelMaster,
    handleChangeAllField: handleChangeAllFieldMaster,
  } = useContext(PurchasingPlanCompetitiveOfferDetailHookContext);

  const currentEvaluationGroupResult = data?.evaluationGroupResult?.[0];

  const { model, dispatch } = detailService.useModel<EvaluationResult>(
    EvaluationResult,
    data
  );

  const {
    handleChangeSingleField,
    handleChangeSelectField,
    handleChangeAllField,
  } = fieldService.useField(model, dispatch);

  useEffect(() => {
    if (data) {
      handleChangeAllField({
        ...model,
      });
    }
  }, [data]);

  const onPressSave = () => {
    if (!validateModel()) {
      return;
    }
    const newData = model?.evaluationGroupResult?.map((item) => {
      if (item.id === currentEvaluationGroupResult?.id) {
        return {
          ...item,
          summaryTechnicalPassFlag: model?.summaryTechnicalPassFlag,
          summaryNote: model?.summaryNote,
          summaryPoint: model?.summaryPoint,
          summaryPassFlag: model?.summaryPassFlag,
          summaryQuotationNote: model?.summaryQuotationNote,
          summaryQuotationPoint: model?.summaryQuotationPoint,
          summaryTechnicalNote: model?.summaryTechnicalNote,
          summaryTechnicalPoint: model?.summaryTechnicalPoint,
        };
      }
      return item;
    });

    const arrayData =
      modelMaster?.evaluationSummary?.flatMap((summary) =>
        summary.evaluationResults?.flatMap((result: EvaluationResult) => {
          if (result?.id === model?.id) {
            const firstItem = newData?.[0] as any;
            return {
              ...result,
              status: 1,
              evaluationGroupResult: newData,
              summaryTechnicalPoint: firstItem?.summaryTechnicalPoint || 0,
              summaryQuotationPoint: firstItem?.summaryQuotationPoint || 0,
              summaryTechnicalNote: firstItem?.summaryTechnicalNote || "",
              summaryQuotationNote: firstItem?.summaryQuotationNote || "",
              summaryPassFlag: firstItem?.summaryPassFlag || 0,
              summaryNote: firstItem?.summaryNote || "",
              summaryTechnicalPassFlag: firstItem?.summaryTechnicalPassFlag,
              summaryPoint: firstItem?.summaryPoint || 0,
              totalAmount: result.totalAmount || 0,
              isEdited: true,
            };
          }
          return result;
        })
      ) || [];

    const newModelMaster = {
      ...modelMaster,
      evaluationSummary: modelMaster?.evaluationSummary?.map((summary) => {
        return {
          ...summary,
          evaluationResults: summary.evaluationResults?.map((result) => {
            const matchingResult = arrayData.find(
              (item) => item.id === result.id
            );
            return matchingResult || result;
          }),
        };
      }),
    };
    handleChangeAllFieldMaster(newModelMaster);
    onPressClose();
  };

  const validateModel = () => {
    let isValid = true;
    const errors: { [key: string]: string } = {};
    let keyValidation = ["summaryQuotationPoint"];
    let keyValidationNote = ["summaryTechnicalNote", "summaryQuotationNote"];
    model?.evaluationMethod === TechnicalCompetenceType.TechnicalScore
      ? ((keyValidation = [
          ...keyValidation,
          "summaryPoint",
          "summaryTechnicalPoint",
        ]),
        (keyValidationNote = [...keyValidationNote, "summaryNote"]))
      : (keyValidation = [...keyValidation, "summaryTechnicalPassFlag"]);

    keyValidation.forEach((key) => {
      if (isNil(model[key])) {
        isValid = false;
        errors[key] = translate("CM.input_require_validation");
      }
    });

    keyValidationNote.forEach((key) => {
      if (!NOT_TAB_ENTER_REGEX.test(model[key])) {
        isValid = false;
      }
    });

    model?.evaluationGroupResult?.forEach((item) => {
      item?.evaluationItemResult?.forEach((itemChild, index) => {
        if (
          item?.evaluationMethod == TechnicalCompetenceType.TechnicalCriteriaMet
        ) {
          if (
            isNil(itemChild?.summaryPassFlag) &&
            index > 0 &&
            itemChild?.isDefaultCriteria
          ) {
            isValid = false;
            errors[`summaryPassFlag.${itemChild?.evaluationCriteriaId}`] =
              translate("CM.input_require_validation");
          }
        } else {
          if (
            isNil(itemChild?.summaryPoint) &&
            index > 0 &&
            itemChild?.isDefaultCriteria
          ) {
            isValid = false;
            errors[`summaryPoint.${itemChild?.evaluationCriteriaId}`] =
              translate("CM.input_require_validation");
          } else if (itemChild?.summaryPoint < itemChild?.minimumPointScale) {
            isValid = false;
            errors[`summaryPoint.${itemChild?.evaluationCriteriaId}`] =
              translate("PL.txt_minimum_point_scale", {
                point: itemChild?.minimumPointScale,
              });
          }
        }

        if (itemChild?.summaryNote?.length > 255) {
          isValid = false;
          errors[`summaryNote.${itemChild?.evaluationCriteriaId}`] = translate(
            "CM.max_length_character",
            { maxLength: 255 }
          );
        }
        //check regex tab and enter
        if (!NOT_TAB_ENTER_REGEX.test(itemChild?.summaryNote)) {
          isValid = false;
        }
      });
    });

    model.errors = errors;
    handleChangeSingleField({ fieldName: "errors" })(errors);
    return isValid;
  };

  const handleUpdateDataTable = useCallback(
    (id: string, data: EvaluationItemResult[]) => {
      const updatedEvaluationGroupResult = model.evaluationGroupResult.map(
        (item) => {
          if (item.id === id) {
            return { ...item, evaluationItemResult: data };
          }
          return item;
        }
      );

      model.evaluationGroupResult = updatedEvaluationGroupResult;
    },
    [model]
  );

  const collapseItems = [
    {
      key: "1",
      label: translate("PL.evaluation_results"),
      children: (
        <EvaluationResultsTable
          data={currentEvaluationGroupResult?.evaluationItemResult || []}
          type={currentEvaluationGroupResult?.evaluationMethod}
          isEdit={isEdit}
          model={model}
          handleUpdate={(value) => {
            handleUpdateDataTable(currentEvaluationGroupResult?.id, value);
          }}
          handleChangeSelectField={handleChangeSelectField}
          handleChangeSingleField={handleChangeSingleField}
          dataTable={data}
        />
      ),
    },
  ];

  return (
    <Drawer
      size={"xl"}
      loading={false}
      visible={true}
      titleButtonCancel={translate("PR.btn_close")}
      titleButtonApply={translate("PR.drawer_btn_save")}
      handleCancel={onPressClose}
      handleClose={onPressClose}
      handleSave={onPressSave}
      isHaveCloseIcon={true}
      shouldCloseWhenClickOutSide={false}
      hasOverlay={true}
      visibleFooter={isEdit}
      className="supplier-review-drawer"
      title={
        <div className="supplier-review-drawer__title fw-bold">
          <span>{translate("PL.table_purchase_plan_provider")}:</span>
          <span className="supplier-review-drawer__title-supplier p-l--3xs">
            {data?.supplier?.name}
          </span>
        </div>
      }
    >
      <div className="supplier-review-drawer__content">
        <div className="supplier-review-drawer__content-item">
          <AdvancedCollapseView
            items={[
              {
                key: "1",
                label: translate("PL.supplier_document"),
                children: (
                  <SupplierDocumentTable
                    data={data?.quotationSupplierProfiles}
                    handleViewQuote={handleViewQuote}
                  />
                ),
              },
            ]}
            className="supplier-review-drawer__collapse"
          />
        </div>
        <div className="supplier-review-drawer__content-item">
          <AdvancedCollapseView
            items={collapseItems}
            className="supplier-review-drawer__collapse"
          />
        </div>
      </div>
    </Drawer>
  );
};

export default DetailReviewSupplierDrawer;
