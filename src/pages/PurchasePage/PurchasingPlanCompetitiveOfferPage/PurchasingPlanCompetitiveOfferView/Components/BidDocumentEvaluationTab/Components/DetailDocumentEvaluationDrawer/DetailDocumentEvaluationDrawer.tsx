import { AdvancedCollapseView } from "components";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { cloneDeep, isNil } from "lodash";
import {
  DocumentEvaluationStatus,
  EvaluationItemResult,
  EvaluationResult,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";
import { useCallback, useContext, useEffect } from "react";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { PurchasingPlanCompetitiveOfferDetailHookContext } from "pages/PurchasePage/PurchasingPlanCompetitiveOfferPage/PurchasingPlanCompetitiveOfferDetail/PurchasingPlanCompetitiveOfferDetailHook";
import { RoundType } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingView/Components/ReviewSummaryTab/Components/TechnicalReview/TechnicalReviewTable";
import SupplierDocumentTable from "./SupplierDocumentTable";
import EvaluationResultsTable from "./EvaluationResultsTable";
import "./DetailDocumentEvaluationDrawer.scss";
import { hasTabOrEnter } from "core/helpers/text";

type Props = {
  visible?: boolean;
  onPressClose?: () => void;
  data?: EvaluationResult;
  isEdit?: boolean;
  roundData?: RoundType;
};

const DetailDocumentEvaluationDrawer = ({
  onPressClose,
  data,
  isEdit = false,
  roundData,
}: Props) => {
  const [translate] = useTranslation();
  const { model: modelMaster, ...contextMaster } = useContext(
    PurchasingPlanCompetitiveOfferDetailHookContext
  );
  const currentEvaluationGroupResult = data?.evaluationGroupResult?.[0];

  const { model, dispatch } = detailService.useModel<EvaluationResult>(
    EvaluationResult,
    data
  );

  const { handleChangeSingleField } = fieldService.useField(model, dispatch);

  useEffect(() => {
    const evaluationResult = cloneDeep(data);

    const newData = {
      ...evaluationResult,
      evaluationGroupResult: evaluationResult?.evaluationGroupResult?.map(
        (item) => ({
          ...item,
          evaluationItemResult: [
            ...(item?.evaluationItemResult || []),
            item?.evaluationMethod ===
            TechnicalCompetenceType.TechnicalCriteriaMet
              ? {
                  isTotalRow: true,
                  evaluationCriteriaId: "totalId",
                  name: "Tổng điểm",
                  passFlag: model?.editedPassFlag,
                }
              : {
                  isTotalRow: true,
                  evaluationCriteriaId: "totalId",
                  name: "Tổng điểm",
                  point: model?.editedPoint,
                },
          ],
        })
      ),
    };

    dispatch({ type: "SET", payload: newData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const initialEvaluationItemResult =
    model?.evaluationGroupResult?.[0]?.evaluationItemResult;

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

      handleChangeSingleField({
        fieldName: "evaluationGroupResult",
      })(updatedEvaluationGroupResult);
    },
    [handleChangeSingleField, model.evaluationGroupResult]
  );

  const handleUpdateEvaluationResultsTable = useCallback(
    (value: EvaluationItemResult[]) => {
      handleUpdateDataTable(currentEvaluationGroupResult?.id, value);
    },
    [currentEvaluationGroupResult?.id, handleUpdateDataTable]
  );

  const handleSave = () => {
    if (!validateModel()) {
      return;
    }

    const currentEvaluationRound =
      modelMaster?.profileEvaluation?.evaluationRound?.find(
        (item) => item.id === roundData?.id
      );

    const currentEvaluationResult =
      currentEvaluationRound?.evaluationResults?.find(
        (item) => item.id === data?.id
      );

    currentEvaluationResult.evaluationGroupResult =
      model?.evaluationGroupResult?.map((item) => {
        return {
          ...item,
          evaluationItemResult: item?.evaluationItemResult?.filter(
            (itemChild) => {
              return itemChild?.evaluationCriteriaId !== "totalId";
            }
          ),
        };
      });
    currentEvaluationResult.status = DocumentEvaluationStatus.Reviewed;
    if (
      currentEvaluationGroupResult?.evaluationMethod ===
      TechnicalCompetenceType.TechnicalCriteriaMet
    ) {
      currentEvaluationResult.editedPassFlag =
        model?.evaluationGroupResult?.[0]?.evaluationItemResult?.find(
          (item) => item?.evaluationCriteriaId === "totalId"
        )?.passFlag;
    }
    if (
      currentEvaluationGroupResult?.evaluationMethod ===
      TechnicalCompetenceType.TechnicalScore
    ) {
      currentEvaluationResult.editedPoint =
        model?.evaluationGroupResult?.[0]?.evaluationItemResult?.find(
          (item) => item?.evaluationCriteriaId === "totalId"
        )?.point;
    }

    contextMaster?.handleChangeSingleField({
      fieldName: "profileEvaluation",
    })(modelMaster?.profileEvaluation);

    onPressClose();
  };

  const validateModel = () => {
    let isValid = true;
    const errors: { [key: string]: string } = {};

    model?.evaluationGroupResult?.[0]?.evaluationItemResult?.forEach(
      (itemChild) => {
        if (
          model?.evaluationGroupResult?.[0]?.evaluationMethod ==
          TechnicalCompetenceType.TechnicalCriteriaMet
        ) {
          if (isNil(itemChild?.passFlag)) {
            isValid = false;
            errors[`passFlag.${itemChild?.evaluationCriteriaId}`] = translate(
              "CM.input_require_validation"
            );
          }
        } else {
          if (isNil(itemChild?.point)) {
            isValid = false;
            errors[`point.${itemChild?.evaluationCriteriaId}`] = translate(
              "CM.input_require_validation"
            );
          } else if (itemChild?.point < itemChild?.minimumPointScale) {
            isValid = false;
            errors[`point.${itemChild?.evaluationCriteriaId}`] = translate(
              "PL.txt_minimum_point_scale",
              { point: itemChild?.minimumPointScale }
            );
          }
        }

        if (hasTabOrEnter(itemChild?.note)) {
          isValid = false;
          errors[`note.${itemChild?.evaluationCriteriaId}`] = translate(
            "CM.no_tab_enter_chars"
          );
        }

        if (itemChild?.note?.length > 255) {
          isValid = false;
          errors[`note.${itemChild?.evaluationCriteriaId}`] = translate(
            "CM.max_length_character",
            { maxLength: 255 }
          );
        }
      }
    );
    model.errors = errors;
    handleChangeSingleField({ fieldName: "errors" })(errors);
    return isValid;
  };

  const collapseItems = [
    {
      key: "1",
      label: translate("PL.supplier_document"),
      children: <SupplierDocumentTable data={data} />,
    },
    {
      key: "2",
      label: translate("PL.evaluation_results"),
      children: (
        <EvaluationResultsTable
          data={initialEvaluationItemResult || []}
          type={currentEvaluationGroupResult?.evaluationMethod}
          isEdit={isEdit}
          model={model}
          handleUpdate={handleUpdateEvaluationResultsTable}
        />
      ),
    },
  ];

  return (
    <div className="detail_document_evaluation_drawer">
      <Drawer
        size={"2xl"}
        loading={false}
        visible={true}
        titleButtonCancel={translate("PM.bth_close")}
        titleButtonApply={translate("PR.drawer_btn_save")}
        handleClose={onPressClose}
        handleSave={handleSave}
        handleCancel={onPressClose}
        isHaveCloseIcon={true}
        shouldCloseWhenClickOutSide={false}
        hasOverlay={true}
        visibleFooter={isEdit}
        title={
          <div className="fw-bold">
            <span>{translate("CT.contract_plan.supplier")}: </span>
            <span className="txt_blue p-l--3xs">{data?.supplier?.name}</span>
          </div>
        }
      >
        <div className="detail_review_drawer__content">
          <div className="item_content">
            <AdvancedCollapseView
              items={collapseItems}
              className="content__collapse"
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default DetailDocumentEvaluationDrawer;
