import { AdvancedCollapseView } from "components";
import { detailService } from "core/services/page-services/detail-service";
import { fieldService } from "core/services/page-services/field-service";
import { cloneDeep, isNil } from "lodash";
import {
  CriteriaType,
  DocumentEvaluationStatus,
  EvaluationItemResult,
  EvaluationResult,
  TechnicalCompetenceType,
} from "models/PurchasingPlan";
import { useCallback, useContext, useEffect } from "react";
import { Drawer } from "react-components-design-system";
import { useTranslation } from "react-i18next";
import { RoundType } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingView/Components/ReviewSummaryTab/Components/TechnicalReview/TechnicalReviewTable";
import "./DetailDocumentEvaluationDrawerTechnical.scss";
import { hasTabOrEnter } from "core/helpers/text";
import BidDocumentTableGroup from "../BidDocumentTableGroup/BidDocumentTableGroup";
import EvaluationResultsTechnicalTable from "../EvaluationResultsTechnicalTable/EvaluationResultsTechnicalTable";
import { PurchasingPlanBiddingDetailHookContext } from "pages/PurchasePage/PurchasingPlanBiddingPage/PurchasingPlanBiddingDetail/PurchasingPlanBiddingDetailHook";

type Props = {
  visible?: boolean;
  onClose?: () => void;
  data?: EvaluationResult;
  isEdit?: boolean;
  roundData?: RoundType;
};

const DetailDocumentEvaluationDrawerTechnical = ({
  onClose,
  data,
  isEdit = false,
  roundData,
}: Props) => {
  const [translate] = useTranslation();
  const { model: modelMaster, ...contextMaster } = useContext(
    PurchasingPlanBiddingDetailHookContext
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
                  evaluationCriteriaId: "totalPassId",
                  name: "Tổng chấm đạt",
                  passFlag: model?.summaryTechnicalPassFlag,
                  note: model?.summaryTechnicalPassFlagNote,
                }
              : {
                  isTotalRow: true,
                  evaluationCriteriaId: "totalPointId",
                  name: "Tổng chấm điểm",
                  point: model?.summaryTechnicalPoint,
                  note: model?.summaryTechnicalPointNote,
                },
          ],
        })
      ),
    };

    dispatch({ type: "SET", payload: newData });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const initialEvaluationGroupResult = model?.evaluationGroupResult;

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
    (evaluationGroupResultId: string, value: EvaluationItemResult[]) => {
      handleUpdateDataTable(evaluationGroupResultId, value);
    },
    [handleUpdateDataTable]
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
              return !itemChild?.evaluationCriteriaId?.includes("total");
            }
          ),
        };
      });
    currentEvaluationResult.status = DocumentEvaluationStatus.Reviewed;

    const evaluationGroupResultItemPass = model?.evaluationGroupResult?.find(
      (item) =>
        item.evaluationMethod ===
          TechnicalCompetenceType.TechnicalCriteriaMet &&
        item.criteriaType === CriteriaType.TechnicalCompetence
    );

    currentEvaluationResult.summaryTechnicalPassFlag =
      evaluationGroupResultItemPass?.evaluationItemResult?.find(
        (item) => item?.evaluationCriteriaId === "totalPassId"
      )?.passFlag;

    currentEvaluationResult.summaryTechnicalPassFlagNote =
      evaluationGroupResultItemPass?.evaluationItemResult?.find(
        (item) => item?.evaluationCriteriaId === "totalPassId"
      )?.note;

    const evaluationGroupResultItemScore = model?.evaluationGroupResult?.find(
      (item) =>
        item.evaluationMethod === TechnicalCompetenceType.TechnicalScore &&
        item.criteriaType === CriteriaType.TechnicalCompetence
    );

    currentEvaluationResult.summaryTechnicalPoint =
      evaluationGroupResultItemScore?.evaluationItemResult?.find(
        (item) => item?.evaluationCriteriaId === "totalPointId"
      )?.point;

    currentEvaluationResult.summaryTechnicalPointNote =
      evaluationGroupResultItemScore?.evaluationItemResult?.find(
        (item) => item?.evaluationCriteriaId === "totalPointId"
      )?.note;

    contextMaster?.handleChangeSingleField({
      fieldName: "profileEvaluation",
    })(modelMaster?.profileEvaluation);

    onClose();
  };

  const validateModel = () => {
    let isValid = true;
    const errors: { [key: string]: string } = {};

    model?.evaluationGroupResult?.forEach((item) => {
      item?.evaluationItemResult?.forEach((itemChild) => {
        if (
          item?.evaluationMethod == TechnicalCompetenceType.TechnicalCriteriaMet
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
      });
    });
    model.errors = errors;
    handleChangeSingleField({ fieldName: "errors" })(errors);
    return isValid;
  };

  const collapseItems = [
    {
      key: "1",
      label: translate("PL.txt_bid_document"),
      children: (
        <BidDocumentTableGroup
          technicalCompetencyProfiles={data?.technicalCompetencyProfiles}
          financialProfiles={data?.financialProfiles}
        />
      ),
    },
    {
      key: "2",
      label: translate("PL.evaluation_results"),
      children: (
        <EvaluationResultsTechnicalTable
          data={initialEvaluationGroupResult || []}
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
        handleClose={onClose}
        handleSave={handleSave}
        handleCancel={onClose}
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

export default DetailDocumentEvaluationDrawerTechnical;
